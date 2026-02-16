import PocketBase from 'pocketbase'

// Initialize PocketBase client
// TODO: Replace with your actual PocketBase URL
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090')

// Auto-refresh authentication
pb.autoCancellation(false)

// Types for PocketBase collections
export interface PBFavorite {
  id: string
  user: string
  bazaar: string
  created: string
  updated: string
}

export interface PBBazaar {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  address: string
  stall_count: number
  food_types: string[]
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
}

export interface PBUser {
  id: string
  username: string
  email: string
  name?: string // Custom field for display name
  avatar?: string // File field for profile image
  created: string
  updated: string
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  return pb.authStore.isValid
}

// Helper function to get current user
export function getCurrentUser(): PBUser | null {
  return pb.authStore.model as PBUser | null
}
