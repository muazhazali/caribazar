import type { Bazaar, Review, FoodType, Report } from './types'
import type { PBUser } from './pocketbase'
import { pb as pbClient } from './pocketbase'

/**
 * PocketBase response type for food_types collection
 */
export interface PBFoodType {
  id: string
  name: string
  slug: FoodType
  icon: string
  color_class: string
  created: string
  updated: string
}

/**
 * PocketBase response type for reviews collection
 */
export interface PBReview {
  id: string
  bazaar: string
  user: string
  rating: number
  comment: string
  photos: string[]
  created: string
  updated: string
  expand?: {
    user?: PBUser
  }
}

/**
 * PocketBase response type for bazaars collection (snake_case)
 */
export interface PBBazaarResponse {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  address: string
  district: string
  state: string
  stall_count: number
  food_types: string[] // Relation IDs
  open_hours: {
    start: string
    end: string
  }
  photos: string[]
  status: 'pending' | 'approved' | 'rejected'
  submitted_by: string
  avg_rating: number
  created: string
  updated: string
  expand?: {
    food_types?: PBFoodType[]
    reviews_via_bazaar?: PBReview[] // Back-relation from reviews collection
  }
}

/**
 * Calculate if a bazaar is currently open based on operating hours
 */
export function calculateIsOpen(hours: { start: string; end: string }): boolean {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute

  // Parse start time
  const [startHour, startMin] = hours.start.split(':').map(Number)
  const startTime = startHour * 60 + startMin

  // Parse end time
  const [endHour, endMin] = hours.end.split(':').map(Number)
  const endTime = endHour * 60 + endMin

  // Check if current time is within operating hours
  return currentTime >= startTime && currentTime <= endTime
}

/**
 * Format ISO date string to display format
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Transform PocketBase review response to app Review type
 */
export function transformReview(pbReview: PBReview): Review {
  // Construct full URLs for review photos
  const photos = (pbReview.photos || []).map((filename) =>
    pbClient.files.getURL(pbReview as any, filename)
  )

  return {
    id: pbReview.id,
    userId: pbReview.user,
    userName: pbReview.expand?.user?.name || 'Anonymous',
    rating: pbReview.rating,
    comment: pbReview.comment,
    photos,
    createdAt: formatDate(pbReview.created),
  }
}

/**
 * PocketBase response type for reports collection
 */
export interface PBReport {
  id: string
  bazaar: string
  reason: string
  details: string
  status: 'pending' | 'resolved' | 'dismissed'
  created: string
  updated: string
  expand?: {
    bazaar?: PBBazaarResponse
  }
}

/**
 * Transform PocketBase bazaar response to app Bazaar type
 * Converts snake_case to camelCase and expands relations
 */
export function transformBazaar(pb: PBBazaarResponse): Bazaar {
  // Get food type slugs from expanded relation or empty array
  const foodTypes: FoodType[] = pb.expand?.food_types
    ? pb.expand.food_types.map((ft) => ft.slug)
    : []

  // Transform reviews if expanded (using back-relation)
  const reviews: Review[] = pb.expand?.reviews_via_bazaar
    ? pb.expand.reviews_via_bazaar.map(transformReview)
    : []

  // Calculate computed fields
  const isOpen = calculateIsOpen(pb.open_hours)
  const reviewCount = reviews.length

  // Construct full URLs for photos using PocketBase file helper
  const photos = (pb.photos || []).map((filename) =>
    pbClient.files.getURL(pb as any, filename)
  )

  return {
    id: pb.id,
    name: pb.name,
    description: pb.description,
    address: pb.address,
    lat: pb.lat,
    lng: pb.lng,
    district: pb.district,
    state: pb.state,
    stallCount: pb.stall_count,
    foodTypes,
    rating: pb.avg_rating || 0,
    reviewCount,
    reviews,
    operatingHours: pb.open_hours,
    isOpen,
    photos,
    status: pb.status,
  }
}

/**
 * Transform PocketBase report response to app Report type
 */
export function transformReport(pb: PBReport): Report {
  return {
    id: pb.id,
    bazaarId: pb.bazaar,
    bazaarName: pb.expand?.bazaar?.name,
    reason: pb.reason,
    details: pb.details,
    status: pb.status,
    createdAt: formatDate(pb.created),
  }
}
