import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Hoisted mocks (must be defined before vi.mock calls) ──────
const { dbFavorites, mockWhereChain, mockPBCreate, mockPBDelete, mockPBGetFullList } = vi.hoisted(() => {
  const mockWhereChain: any = {
    equals: vi.fn(),
    toArray: vi.fn(async () => []),
    count: vi.fn(async () => 0),
  }
  mockWhereChain.equals.mockReturnValue(mockWhereChain)

  const dbFavorites = {
    put: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    where: vi.fn(() => mockWhereChain),
    update: vi.fn(),
  }

  return {
    dbFavorites,
    mockWhereChain,
    mockPBCreate: vi.fn(),
    mockPBDelete: vi.fn(),
    mockPBGetFullList: vi.fn(),
  }
})

vi.mock('@/lib/db', () => ({
  db: {
    favorites: dbFavorites,
  },
}))

// ── Mock PocketBase ───────────────────────────────────────────
vi.mock('@/lib/pocketbase', () => ({
  pb: {
    collection: vi.fn(() => ({
      create: mockPBCreate,
      delete: mockPBDelete,
      getFullList: mockPBGetFullList,
    })),
    authStore: { isValid: false, model: null, clear: vi.fn() },
    files: { getURL: vi.fn(() => '') },
  },
  isAuthenticated: vi.fn(() => false),
  getCurrentUser: vi.fn(() => null),
  clearAuth: vi.fn(),
}))

import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getFavoriteIds,
  getFavoriteCount,
  syncFavoritesFromCloud,
  syncLocalFavoritesToCloud,
} from '@/lib/favorites'
import { isAuthenticated, getCurrentUser } from '@/lib/pocketbase'

// ─────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  // Reset where chain mocks
  mockWhereChain.toArray.mockResolvedValue([])
  mockWhereChain.count.mockResolvedValue(0)
  dbFavorites.where.mockReturnValue(mockWhereChain)
  mockWhereChain.equals.mockReturnValue(mockWhereChain)
  ;(isAuthenticated as ReturnType<typeof vi.fn>).mockReturnValue(false)
  ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue(null)
})

// ─────────────────────────────────────────────────────────────
// addToFavorites
// ─────────────────────────────────────────────────────────────
describe('addToFavorites', () => {
  it('stores favorite locally with local_ prefix when not authenticated', async () => {
    dbFavorites.put.mockResolvedValue(undefined)
    await addToFavorites('baz1')
    expect(dbFavorites.put).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'local_baz1', bazaarId: 'baz1', userId: undefined })
    )
  })

  it('stores favorite with userId prefix when authenticated', async () => {
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    dbFavorites.put.mockResolvedValue(undefined)
    await addToFavorites('baz2')
    expect(dbFavorites.put).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'usr1_baz2', bazaarId: 'baz2', userId: 'usr1' })
    )
  })

  it('sets syncedToCloud to false initially', async () => {
    dbFavorites.put.mockResolvedValue(undefined)
    await addToFavorites('baz1')
    expect(dbFavorites.put).toHaveBeenCalledWith(
      expect.objectContaining({ syncedToCloud: false })
    )
  })

  it('does NOT call pb.collection().create (cloud sync disabled)', async () => {
    dbFavorites.put.mockResolvedValue(undefined)
    ;(isAuthenticated as ReturnType<typeof vi.fn>).mockReturnValue(true)
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    await addToFavorites('baz1')
    expect(mockPBCreate).not.toHaveBeenCalled()
  })
})

// ─────────────────────────────────────────────────────────────
// removeFromFavorites
// ─────────────────────────────────────────────────────────────
describe('removeFromFavorites', () => {
  it('deletes local favorite with local_ prefix when not authenticated', async () => {
    dbFavorites.delete.mockResolvedValue(undefined)
    await removeFromFavorites('baz1')
    expect(dbFavorites.delete).toHaveBeenCalledWith('local_baz1')
  })

  it('deletes local favorite with userId prefix when authenticated', async () => {
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    dbFavorites.delete.mockResolvedValue(undefined)
    await removeFromFavorites('baz2')
    expect(dbFavorites.delete).toHaveBeenCalledWith('usr1_baz2')
  })

  it('does NOT call pb.collection().delete (cloud sync disabled)', async () => {
    dbFavorites.delete.mockResolvedValue(undefined)
    ;(isAuthenticated as ReturnType<typeof vi.fn>).mockReturnValue(true)
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    await removeFromFavorites('baz1')
    expect(mockPBDelete).not.toHaveBeenCalled()
  })
})

// ─────────────────────────────────────────────────────────────
// isFavorite
// ─────────────────────────────────────────────────────────────
describe('isFavorite', () => {
  it('returns true when the favorite exists in db', async () => {
    dbFavorites.get.mockResolvedValue({ id: 'local_baz1', bazaarId: 'baz1' })
    expect(await isFavorite('baz1')).toBe(true)
  })

  it('returns false when the favorite does not exist in db', async () => {
    dbFavorites.get.mockResolvedValue(undefined)
    expect(await isFavorite('baz999')).toBe(false)
  })

  it('checks with local_ prefix when not authenticated', async () => {
    dbFavorites.get.mockResolvedValue(undefined)
    await isFavorite('baz1')
    expect(dbFavorites.get).toHaveBeenCalledWith('local_baz1')
  })

  it('checks with userId prefix when authenticated', async () => {
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    dbFavorites.get.mockResolvedValue({ id: 'usr1_baz1' })
    await isFavorite('baz1')
    expect(dbFavorites.get).toHaveBeenCalledWith('usr1_baz1')
  })
})

// ─────────────────────────────────────────────────────────────
// getFavoriteIds
// ─────────────────────────────────────────────────────────────
describe('getFavoriteIds', () => {
  it('returns array of bazaarIds for anonymous user', async () => {
    mockWhereChain.toArray.mockResolvedValue([
      { id: 'local_baz1', bazaarId: 'baz1' },
      { id: 'local_baz2', bazaarId: 'baz2' },
    ])
    const ids = await getFavoriteIds()
    expect(ids).toEqual(['baz1', 'baz2'])
  })

  it('returns array of bazaarIds for authenticated user', async () => {
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    mockWhereChain.toArray.mockResolvedValue([
      { id: 'usr1_baz1', bazaarId: 'baz1', userId: 'usr1' },
    ])
    const ids = await getFavoriteIds()
    expect(ids).toEqual(['baz1'])
  })

  it('returns empty array when no favorites', async () => {
    mockWhereChain.toArray.mockResolvedValue([])
    const ids = await getFavoriteIds()
    expect(ids).toEqual([])
  })
})

// ─────────────────────────────────────────────────────────────
// getFavoriteCount
// ─────────────────────────────────────────────────────────────
describe('getFavoriteCount', () => {
  it('returns count for anonymous user', async () => {
    mockWhereChain.count.mockResolvedValue(3)
    expect(await getFavoriteCount()).toBe(3)
  })

  it('returns count for authenticated user', async () => {
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    mockWhereChain.count.mockResolvedValue(7)
    expect(await getFavoriteCount()).toBe(7)
  })

  it('returns 0 when no favorites', async () => {
    mockWhereChain.count.mockResolvedValue(0)
    expect(await getFavoriteCount()).toBe(0)
  })
})

// ─────────────────────────────────────────────────────────────
// syncFavoritesFromCloud
// ─────────────────────────────────────────────────────────────
describe('syncFavoritesFromCloud', () => {
  it('does nothing when not authenticated', async () => {
    await syncFavoritesFromCloud()
    expect(mockPBGetFullList).not.toHaveBeenCalled()
    expect(dbFavorites.put).not.toHaveBeenCalled()
  })

  it('does nothing when authenticated but no userId', async () => {
    ;(isAuthenticated as ReturnType<typeof vi.fn>).mockReturnValue(true)
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue(null)
    await syncFavoritesFromCloud()
    expect(mockPBGetFullList).not.toHaveBeenCalled()
  })

  it('fetches cloud favorites and stores them locally when authenticated', async () => {
    ;(isAuthenticated as ReturnType<typeof vi.fn>).mockReturnValue(true)
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    mockPBGetFullList.mockResolvedValue([
      { id: 'cf1', user: 'usr1', bazaar: 'baz1', created: '2025-01-01T00:00:00Z', updated: '' },
    ])
    dbFavorites.put.mockResolvedValue(undefined)

    await syncFavoritesFromCloud()

    expect(mockPBGetFullList).toHaveBeenCalledWith(expect.objectContaining({ filter: expect.stringContaining('usr1') }))
    expect(dbFavorites.put).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'usr1_baz1', bazaarId: 'baz1', syncedToCloud: true })
    )
  })
})

// ─────────────────────────────────────────────────────────────
// syncLocalFavoritesToCloud
// ─────────────────────────────────────────────────────────────
describe('syncLocalFavoritesToCloud', () => {
  it('does nothing when not authenticated', async () => {
    await syncLocalFavoritesToCloud()
    expect(mockPBCreate).not.toHaveBeenCalled()
  })

  it('does nothing when authenticated but no userId', async () => {
    ;(isAuthenticated as ReturnType<typeof vi.fn>).mockReturnValue(true)
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue(null)
    await syncLocalFavoritesToCloud()
    expect(mockPBCreate).not.toHaveBeenCalled()
  })

  it('uploads unsynced favorites to cloud when authenticated', async () => {
    ;(isAuthenticated as ReturnType<typeof vi.fn>).mockReturnValue(true)
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    mockWhereChain.toArray.mockResolvedValue([
      { id: 'local_baz1', bazaarId: 'baz1', syncedToCloud: false },
    ])
    mockPBCreate.mockResolvedValue({ id: 'pb_fav1' })
    dbFavorites.update.mockResolvedValue(undefined)

    await syncLocalFavoritesToCloud()

    expect(mockPBCreate).toHaveBeenCalledWith({ user: 'usr1', bazaar: 'baz1' })
    expect(dbFavorites.update).toHaveBeenCalledWith(
      'local_baz1',
      expect.objectContaining({ syncedToCloud: true })
    )
  })

  it('continues with remaining favorites even if one cloud upload fails', async () => {
    ;(isAuthenticated as ReturnType<typeof vi.fn>).mockReturnValue(true)
    ;(getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'usr1' })
    mockWhereChain.toArray.mockResolvedValue([
      { id: 'local_baz1', bazaarId: 'baz1', syncedToCloud: false },
      { id: 'local_baz2', bazaarId: 'baz2', syncedToCloud: false },
    ])
    mockPBCreate
      .mockRejectedValueOnce(new Error('First upload failed'))
      .mockResolvedValueOnce({ id: 'pb_fav2' })
    dbFavorites.update.mockResolvedValue(undefined)

    await syncLocalFavoritesToCloud()

    expect(mockPBCreate).toHaveBeenCalledTimes(2)
    // Second one should still update
    expect(dbFavorites.update).toHaveBeenCalledTimes(1)
  })
})
