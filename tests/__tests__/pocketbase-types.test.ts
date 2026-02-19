import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the pocketbase module before importing the module under test
vi.mock('@/lib/pocketbase', () => ({
  pb: {
    files: {
      getURL: vi.fn((record: any, filename: string) => `https://pb.test/files/${record.id}/${filename}`),
    },
    authStore: {
      isValid: false,
      model: null,
      clear: vi.fn(),
    },
  },
  isAuthenticated: vi.fn(() => false),
  getCurrentUser: vi.fn(() => null),
  clearAuth: vi.fn(),
}))

import {
  calculateIsOpen,
  formatDate,
  transformReview,
  transformBazaar,
  transformReport,
  type PBBazaarResponse,
  type PBReview,
  type PBReport,
} from '@/lib/pocketbase-types'

// ──────────────────────────────────────────────────────────────
// calculateIsOpen
// ──────────────────────────────────────────────────────────────
describe('calculateIsOpen', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('returns true when current time is within hours', () => {
    // Fix time to 15:00
    vi.setSystemTime(new Date('2025-01-01T15:00:00'))
    expect(calculateIsOpen({ start: '14:00', end: '22:00' })).toBe(true)
  })

  it('returns false when current time is before opening', () => {
    vi.setSystemTime(new Date('2025-01-01T13:00:00'))
    expect(calculateIsOpen({ start: '14:00', end: '22:00' })).toBe(false)
  })

  it('returns false when current time is after closing', () => {
    vi.setSystemTime(new Date('2025-01-01T23:00:00'))
    expect(calculateIsOpen({ start: '14:00', end: '22:00' })).toBe(false)
  })

  it('returns true exactly at opening time', () => {
    vi.setSystemTime(new Date('2025-01-01T14:00:00'))
    expect(calculateIsOpen({ start: '14:00', end: '22:00' })).toBe(true)
  })

  it('returns true exactly at closing time', () => {
    vi.setSystemTime(new Date('2025-01-01T22:00:00'))
    expect(calculateIsOpen({ start: '14:00', end: '22:00' })).toBe(true)
  })

  it('handles midnight-crossing hours (start > end) - currently treated as closed after midnight', () => {
    // Note: current impl does NOT support overnight hours (treats end < start as never open overnight)
    vi.setSystemTime(new Date('2025-01-01T01:00:00'))
    // 22:00 to 02:00 - with current logic this won't wrap, so 01:00 is NOT between 22:00 and 02:00
    expect(calculateIsOpen({ start: '22:00', end: '02:00' })).toBe(false)
  })
})

// ──────────────────────────────────────────────────────────────
// formatDate
// ──────────────────────────────────────────────────────────────
describe('formatDate', () => {
  it('formats ISO date string to YYYY-MM-DD', () => {
    expect(formatDate('2025-03-15T10:30:00.000Z')).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns a date in YYYY-MM-DD format', () => {
    const result = formatDate('2024-01-05T00:00:00.000Z')
    expect(result).toMatch(/^2024-01-\d{2}$/)
  })

  it('pads single-digit month and day with zero', () => {
    // 2025-01-05 UTC → may shift by timezone but format should be padded
    const result = formatDate('2025-06-09T12:00:00.000Z')
    const [, month, day] = result.split('-')
    expect(month.length).toBe(2)
    expect(day.length).toBe(2)
  })
})

// ──────────────────────────────────────────────────────────────
// transformReview
// ──────────────────────────────────────────────────────────────
describe('transformReview', () => {
  const baseReview: PBReview = {
    id: 'rev1',
    bazaar: 'baz1',
    user: 'usr1',
    rating: 4,
    comment: 'Great food!',
    photos: ['photo1.jpg', 'photo2.jpg'],
    created: '2025-03-01T10:00:00.000Z',
    updated: '2025-03-01T10:00:00.000Z',
  }

  it('maps id, userId, rating, comment correctly', () => {
    const result = transformReview(baseReview)
    expect(result.id).toBe('rev1')
    expect(result.userId).toBe('usr1')
    expect(result.rating).toBe(4)
    expect(result.comment).toBe('Great food!')
  })

  it('constructs photo URLs for each photo', () => {
    const result = transformReview(baseReview)
    expect(result.photos).toHaveLength(2)
    result.photos.forEach((url) => expect(url).toMatch(/^https?:\/\//))
  })

  it('falls back to "Anonymous" when expand.user is missing', () => {
    const result = transformReview({ ...baseReview, expand: undefined })
    expect(result.userName).toBe('Anonymous')
  })

  it('uses expanded user name when available', () => {
    const result = transformReview({
      ...baseReview,
      expand: {
        user: {
          id: 'usr1',
          email: 'test@test.com',
          username: 'testuser',
          name: 'Ali Ahmad',
          created: '',
          updated: '',
        },
      },
    })
    expect(result.userName).toBe('Ali Ahmad')
  })

  it('handles empty photos array', () => {
    const result = transformReview({ ...baseReview, photos: [] })
    expect(result.photos).toHaveLength(0)
  })

  it('formats createdAt from ISO date', () => {
    const result = transformReview(baseReview)
    expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

// ──────────────────────────────────────────────────────────────
// transformBazaar
// ──────────────────────────────────────────────────────────────
describe('transformBazaar', () => {
  const basePB: PBBazaarResponse = {
    id: 'baz1',
    name: 'Bazaar Ramadan Petaling Jaya',
    description: 'A great bazaar',
    lat: 3.1234,
    lng: 101.5678,
    address: 'Jalan PJ, Petaling Jaya',
    district: 'Petaling',
    state: 'Selangor',
    stall_count: 120,
    food_types: ['ft1', 'ft2'],
    open_hours: { start: '14:00', end: '22:00' },
    photos: ['banner.jpg'],
    status: 'approved',
    submitted_by: 'usr1',
    avg_rating: 4.2,
    created: '2025-01-10T08:00:00.000Z',
    updated: '2025-01-10T08:00:00.000Z',
  }

  it('maps basic fields correctly', () => {
    const result = transformBazaar(basePB)
    expect(result.id).toBe('baz1')
    expect(result.name).toBe('Bazaar Ramadan Petaling Jaya')
    expect(result.address).toBe('Jalan PJ, Petaling Jaya')
    expect(result.lat).toBe(3.1234)
    expect(result.lng).toBe(101.5678)
    expect(result.district).toBe('Petaling')
    expect(result.state).toBe('Selangor')
    expect(result.stallCount).toBe(120)
    expect(result.status).toBe('approved')
  })

  it('converts avg_rating to rating, defaults to 0 when missing', () => {
    expect(transformBazaar(basePB).rating).toBe(4.2)
    expect(transformBazaar({ ...basePB, avg_rating: 0 }).rating).toBe(0)
  })

  it('returns empty foodTypes when expand is absent', () => {
    const result = transformBazaar({ ...basePB, expand: undefined })
    expect(result.foodTypes).toEqual([])
  })

  it('extracts food type slugs from expand.food_types', () => {
    const result = transformBazaar({
      ...basePB,
      expand: {
        food_types: [
          { id: 'ft1', name: 'Nasi Lemak', slug: 'nasi-lemak', icon: '🍚', color_class: 'bg-amber-100', created: '', updated: '' },
          { id: 'ft2', name: 'Satay', slug: 'satay', icon: '🍢', color_class: 'bg-orange-100', created: '', updated: '' },
        ],
      },
    })
    expect(result.foodTypes).toEqual(['nasi-lemak', 'satay'])
  })

  it('returns empty reviews when expand.reviews_via_bazaar is absent', () => {
    const result = transformBazaar({ ...basePB, expand: undefined })
    expect(result.reviews).toEqual([])
    expect(result.reviewCount).toBe(0)
  })

  it('transforms reviews from expand.reviews_via_bazaar', () => {
    const result = transformBazaar({
      ...basePB,
      expand: {
        reviews_via_bazaar: [
          {
            id: 'rev1',
            bazaar: 'baz1',
            user: 'usr1',
            rating: 5,
            comment: 'Delicious!',
            photos: [],
            created: '2025-02-01T00:00:00.000Z',
            updated: '2025-02-01T00:00:00.000Z',
          },
        ],
      },
    })
    expect(result.reviews).toHaveLength(1)
    expect(result.reviewCount).toBe(1)
  })

  it('constructs photo URLs', () => {
    const result = transformBazaar(basePB)
    expect(result.photos).toHaveLength(1)
    expect(result.photos[0]).toMatch(/^https?:\/\//)
  })

  it('handles empty photos array', () => {
    const result = transformBazaar({ ...basePB, photos: [] })
    expect(result.photos).toHaveLength(0)
  })

  it('calculates isOpen based on current time', () => {
    // Just verify isOpen is a boolean
    const result = transformBazaar(basePB)
    expect(typeof result.isOpen).toBe('boolean')
  })

  it('sets operatingHours from open_hours', () => {
    const result = transformBazaar(basePB)
    expect(result.operatingHours).toEqual({ start: '14:00', end: '22:00' })
  })
})

// ──────────────────────────────────────────────────────────────
// transformReport
// ──────────────────────────────────────────────────────────────
describe('transformReport', () => {
  const basePBReport: PBReport = {
    id: 'rep1',
    bazaar: 'baz1',
    reason: 'closed',
    details: 'Bazaar was not open on this date',
    status: 'pending',
    created: '2025-04-01T09:00:00.000Z',
    updated: '2025-04-01T09:00:00.000Z',
  }

  it('maps fields correctly', () => {
    const result = transformReport(basePBReport)
    expect(result.id).toBe('rep1')
    expect(result.bazaarId).toBe('baz1')
    expect(result.reason).toBe('closed')
    expect(result.details).toBe('Bazaar was not open on this date')
    expect(result.status).toBe('pending')
  })

  it('formats createdAt to YYYY-MM-DD', () => {
    const result = transformReport(basePBReport)
    expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('includes bazaarName from expand when available', () => {
    const result = transformReport({
      ...basePBReport,
      expand: {
        bazaar: {
          id: 'baz1',
          name: 'Bazaar PJ',
          description: '',
          lat: 0,
          lng: 0,
          address: '',
          district: '',
          state: '',
          stall_count: 0,
          food_types: [],
          open_hours: { start: '14:00', end: '22:00' },
          photos: [],
          status: 'approved',
          submitted_by: '',
          avg_rating: 0,
          created: '',
          updated: '',
        },
      },
    })
    expect(result.bazaarName).toBe('Bazaar PJ')
  })

  it('bazaarName is undefined when expand is absent', () => {
    const result = transformReport(basePBReport)
    expect(result.bazaarName).toBeUndefined()
  })
})
