import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Shared mock PocketBase collection helper ──────────────────
const mockGetOne = vi.fn()
const mockGetFullList = vi.fn()

vi.mock('@/lib/pocketbase', () => ({
  pb: {
    collection: vi.fn(() => ({
      getOne: mockGetOne,
      getFullList: mockGetFullList,
    })),
    files: {
      getURL: vi.fn((_record: any, filename: string) => `https://pb.test/files/${filename}`),
    },
    authStore: { isValid: false, model: null, clear: vi.fn() },
  },
  isAuthenticated: vi.fn(() => false),
  getCurrentUser: vi.fn(() => null),
  clearAuth: vi.fn(),
}))

import {
  getBazaarById,
  getAllBazaars,
  searchBazaars,
  filterBazaars,
  getBazaarsByIds,
} from '@/lib/api/bazaars'

// ── Minimal PBBazaarResponse fixture ─────────────────────────
function makePBBazaar(overrides = {}) {
  return {
    id: 'baz1',
    name: 'Bazaar PJ',
    description: 'Test bazaar',
    lat: 3.1,
    lng: 101.6,
    address: 'Jalan PJ',
    district: 'Petaling',
    state: 'Selangor',
    stall_count: 50,
    food_types: [],
    open_hours: { start: '14:00', end: '22:00' },
    photos: [],
    status: 'approved',
    submitted_by: 'usr1',
    avg_rating: 4.0,
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    expand: {},
    ...overrides,
  }
}

// ─────────────────────────────────────────────────────────────

describe('getBazaarById', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns a transformed Bazaar on success', async () => {
    mockGetOne.mockResolvedValueOnce(makePBBazaar())
    const result = await getBazaarById('baz1')
    expect(result).not.toBeNull()
    expect(result?.id).toBe('baz1')
    expect(result?.name).toBe('Bazaar PJ')
  })

  it('returns null when PocketBase throws', async () => {
    mockGetOne.mockRejectedValueOnce(new Error('Not found'))
    const result = await getBazaarById('nonexistent')
    expect(result).toBeNull()
  })

  it('calls getOne with the correct ID and expand string', async () => {
    mockGetOne.mockResolvedValueOnce(makePBBazaar())
    await getBazaarById('baz1')
    expect(mockGetOne).toHaveBeenCalledWith('baz1', expect.objectContaining({ expand: expect.any(String) }))
  })
})

// ─────────────────────────────────────────────────────────────

describe('getAllBazaars', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns array of transformed Bazaars', async () => {
    mockGetFullList.mockResolvedValueOnce([makePBBazaar(), makePBBazaar({ id: 'baz2', name: 'Bazaar KL' })])
    const result = await getAllBazaars()
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('baz1')
    expect(result[1].id).toBe('baz2')
  })

  it('returns empty array when PocketBase throws', async () => {
    mockGetFullList.mockRejectedValueOnce(new Error('Network error'))
    const result = await getAllBazaars()
    expect(result).toEqual([])
  })

  it('calls getFullList with status = "approved" filter', async () => {
    mockGetFullList.mockResolvedValueOnce([])
    await getAllBazaars()
    expect(mockGetFullList).toHaveBeenCalledWith(
      expect.objectContaining({ filter: expect.stringContaining('approved') })
    )
  })
})

// ─────────────────────────────────────────────────────────────

describe('searchBazaars', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns matching bazaars for a query', async () => {
    mockGetFullList.mockResolvedValueOnce([makePBBazaar({ name: 'Bazaar PJ Utama' })])
    const result = await searchBazaars('PJ')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Bazaar PJ Utama')
  })

  it('uses name/address/district filter when query is provided', async () => {
    mockGetFullList.mockResolvedValueOnce([])
    await searchBazaars('Shah Alam')
    const call = mockGetFullList.mock.calls[0][0]
    expect(call.filter).toContain('Shah Alam')
    expect(call.filter).toContain('name ~')
  })

  it('uses only status = "approved" filter when query is empty', async () => {
    mockGetFullList.mockResolvedValueOnce([])
    await searchBazaars('')
    const call = mockGetFullList.mock.calls[0][0]
    expect(call.filter).toBe('status = "approved"')
  })

  it('returns empty array on error', async () => {
    mockGetFullList.mockRejectedValueOnce(new Error('Timeout'))
    const result = await searchBazaars('anything')
    expect(result).toEqual([])
  })
})

// ─────────────────────────────────────────────────────────────

describe('filterBazaars', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns all approved bazaars when no options provided', async () => {
    mockGetFullList.mockResolvedValueOnce([makePBBazaar()])
    const result = await filterBazaars({})
    expect(result).toHaveLength(1)
  })

  it('adds minRating to server-side filter', async () => {
    mockGetFullList.mockResolvedValueOnce([])
    await filterBazaars({ minRating: 4 })
    const call = mockGetFullList.mock.calls[0][0]
    expect(call.filter).toContain('avg_rating >= 4')
  })

  it('adds food type filters to server-side filter', async () => {
    mockGetFullList.mockResolvedValueOnce([])
    await filterBazaars({ foodTypes: ['nasi-lemak', 'satay'] })
    const call = mockGetFullList.mock.calls[0][0]
    expect(call.filter).toContain('food_types.slug ?= "nasi-lemak"')
    expect(call.filter).toContain('food_types.slug ?= "satay"')
  })

  it('filters openOnly client-side (keeps only isOpen=true bazaars)', async () => {
    vi.setSystemTime(new Date('2025-01-01T15:00:00'))
    const openBazaar = makePBBazaar({ id: 'open', open_hours: { start: '14:00', end: '22:00' } })
    const closedBazaar = makePBBazaar({ id: 'closed', open_hours: { start: '08:00', end: '10:00' } })
    mockGetFullList.mockResolvedValueOnce([openBazaar, closedBazaar])
    const result = await filterBazaars({ openOnly: true })
    expect(result.every((b) => b.isOpen)).toBe(true)
    vi.useRealTimers()
  })

  it('returns empty array on error', async () => {
    mockGetFullList.mockRejectedValueOnce(new Error('Server error'))
    const result = await filterBazaars({ minRating: 3 })
    expect(result).toEqual([])
  })
})

// ─────────────────────────────────────────────────────────────

describe('getBazaarsByIds', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns empty array immediately when ids is empty', async () => {
    const result = await getBazaarsByIds([])
    expect(result).toEqual([])
    expect(mockGetFullList).not.toHaveBeenCalled()
  })

  it('fetches bazaars matching the provided IDs', async () => {
    mockGetFullList.mockResolvedValueOnce([
      makePBBazaar({ id: 'baz1' }),
      makePBBazaar({ id: 'baz2' }),
    ])
    const result = await getBazaarsByIds(['baz1', 'baz2'])
    expect(result).toHaveLength(2)
  })

  it('includes all IDs in the filter', async () => {
    mockGetFullList.mockResolvedValueOnce([])
    await getBazaarsByIds(['abc', 'def'])
    const call = mockGetFullList.mock.calls[0][0]
    expect(call.filter).toContain('id = "abc"')
    expect(call.filter).toContain('id = "def"')
  })

  it('also filters by status = "approved"', async () => {
    mockGetFullList.mockResolvedValueOnce([])
    await getBazaarsByIds(['baz1'])
    const call = mockGetFullList.mock.calls[0][0]
    expect(call.filter).toContain('approved')
  })

  it('returns empty array on error', async () => {
    mockGetFullList.mockRejectedValueOnce(new Error('Error'))
    const result = await getBazaarsByIds(['baz1'])
    expect(result).toEqual([])
  })
})
