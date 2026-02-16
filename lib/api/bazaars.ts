import { pb } from '@/lib/pocketbase'
import { transformBazaar, type PBBazaarResponse } from '@/lib/pocketbase-types'
import type { Bazaar } from '@/lib/types'

/**
 * Fetch a single bazaar by ID with all relations expanded
 * @param id - Bazaar ID
 * @returns Bazaar object or null if not found
 */
export async function getBazaarById(id: string): Promise<Bazaar | null> {
  try {
    const record = await pb.collection('bazaars').getOne<PBBazaarResponse>(id, {
      expand: 'food_types,reviews,reviews.user',
    })

    return transformBazaar(record)
  } catch (error) {
    console.error(`Failed to fetch bazaar ${id}:`, error)
    return null
  }
}

/**
 * Search bazaars by query string (name, address, district)
 * @param query - Search query
 * @returns Array of matching bazaars (approved only)
 */
export async function searchBazaars(query: string): Promise<Bazaar[]> {
  try {
    const filter = query
      ? `status = "approved" && (
          name ~ "${query}" ||
          address ~ "${query}" ||
          district ~ "${query}"
        )`
      : 'status = "approved"'

    const records = await pb.collection('bazaars').getFullList<PBBazaarResponse>({
      filter,
      expand: 'food_types,reviews',
      sort: '-avg_rating,-created',
    })

    return records.map(transformBazaar)
  } catch (error) {
    console.error('Failed to search bazaars:', error)
    return []
  }
}

/**
 * Get all approved bazaars
 * @returns Array of all approved bazaars
 */
export async function getAllBazaars(): Promise<Bazaar[]> {
  try {
    const records = await pb.collection('bazaars').getFullList<PBBazaarResponse>({
      filter: 'status = "approved"',
      expand: 'food_types,reviews',
      sort: '-avg_rating,-created',
    })

    return records.map(transformBazaar)
  } catch (error) {
    console.error('Failed to fetch all bazaars:', error)
    return []
  }
}

/**
 * Filter bazaars by criteria (food types, rating, open status)
 * @param options - Filter options
 * @returns Array of filtered bazaars
 */
export async function filterBazaars(options: {
  foodTypes?: string[]
  minRating?: number
  openOnly?: boolean
}): Promise<Bazaar[]> {
  try {
    const filters: string[] = ['status = "approved"']

    // Server-side filter for minimum rating
    if (options.minRating) {
      filters.push(`avg_rating >= ${options.minRating}`)
    }

    // Server-side filter for food types
    // Note: This requires checking if the bazaar has ANY of the selected food types
    if (options.foodTypes && options.foodTypes.length > 0) {
      const foodTypeFilters = options.foodTypes
        .map((ft) => `food_types.slug ?= "${ft}"`)
        .join(' || ')
      filters.push(`(${foodTypeFilters})`)
    }

    const records = await pb.collection('bazaars').getFullList<PBBazaarResponse>({
      filter: filters.join(' && '),
      expand: 'food_types,reviews',
      sort: '-avg_rating,-created',
    })

    let bazaars = records.map(transformBazaar)

    // Client-side filter for openOnly (computed field, can't filter in PB)
    if (options.openOnly) {
      bazaars = bazaars.filter((b) => b.isOpen)
    }

    return bazaars
  } catch (error) {
    console.error('Failed to filter bazaars:', error)
    return []
  }
}

/**
 * Get bazaars by an array of IDs (for favorites page)
 * @param ids - Array of bazaar IDs
 * @returns Array of bazaars matching the IDs
 */
export async function getBazaarsByIds(ids: string[]): Promise<Bazaar[]> {
  if (ids.length === 0) {
    return []
  }

  try {
    // Build filter: (id = "1" || id = "2" || id = "3")
    const idFilter = ids.map((id) => `id = "${id}"`).join(' || ')

    const records = await pb.collection('bazaars').getFullList<PBBazaarResponse>({
      filter: `(${idFilter}) && status = "approved"`,
      expand: 'food_types,reviews',
      sort: '-avg_rating',
    })

    return records.map(transformBazaar)
  } catch (error) {
    console.error('Failed to fetch bazaars by IDs:', error)
    return []
  }
}
