"use client"

import { db, type FavoriteBazaar } from './db'
import { pb, isAuthenticated, getCurrentUser, type PBFavorite } from './pocketbase'

/**
 * Add a bazaar to favorites (local + cloud if authenticated)
 */
export async function addToFavorites(bazaarId: string): Promise<void> {
  const userId = getCurrentUser()?.id
  const favoriteId = userId ? `${userId}_${bazaarId}` : `local_${bazaarId}`

  // Add to local database
  await db.favorites.put({
    id: favoriteId,
    bazaarId,
    userId,
    createdAt: new Date().toISOString(),
    syncedToCloud: false,
  })

  // TEMPORARILY DISABLED: Cloud sync requires authentication
  // TODO: Re-enable after implementing login/register pages
  // Sync to cloud if authenticated
  if (false && isAuthenticated() && userId) {
    try {
      // Verify the user and bazaar exist before creating favorite
      const record = await pb.collection('favorites').create({
        user: userId,
        bazaar: bazaarId,
      })

      // Mark as synced
      await db.favorites.update(favoriteId, { syncedToCloud: true })
    } catch (error: any) {
      console.error('Failed to sync favorite to cloud:', error)

      // If the error is due to authentication issues, clear the auth store
      if (error?.status === 400 || error?.status === 401 || error?.status === 403) {
        console.warn('Authentication issue detected. Favorites will remain local only.')
        pb.authStore.clear()
      }

      // Keep in local database even if cloud sync fails
    }
  }
}

/**
 * Remove a bazaar from favorites (local + cloud)
 */
export async function removeFromFavorites(bazaarId: string): Promise<void> {
  const userId = getCurrentUser()?.id
  const favoriteId = userId ? `${userId}_${bazaarId}` : `local_${bazaarId}`

  // Remove from local database
  await db.favorites.delete(favoriteId)

  // TEMPORARILY DISABLED: Cloud sync requires authentication
  // TODO: Re-enable after implementing login/register pages
  // Remove from cloud if authenticated
  if (false && isAuthenticated() && userId) {
    try {
      // Find the favorite in PocketBase
      const records = await pb.collection('favorites').getFullList<PBFavorite>({
        filter: `user = "${userId}" && bazaar = "${bazaarId}"`,
      })

      // Delete all matching records
      for (const record of records) {
        await pb.collection('favorites').delete(record.id)
      }
    } catch (error) {
      console.error('Failed to remove favorite from cloud:', error)
    }
  }
}

/**
 * Check if a bazaar is favorited
 */
export async function isFavorite(bazaarId: string): Promise<boolean> {
  const userId = getCurrentUser()?.id
  const favoriteId = userId ? `${userId}_${bazaarId}` : `local_${bazaarId}`

  const favorite = await db.favorites.get(favoriteId)
  return !!favorite
}

/**
 * Get all favorite bazaar IDs
 */
export async function getFavoriteIds(): Promise<string[]> {
  const userId = getCurrentUser()?.id

  if (userId) {
    // If authenticated, get user's favorites
    const favorites = await db.favorites
      .where('userId')
      .equals(userId)
      .toArray()
    return favorites.map((f) => f.bazaarId)
  } else {
    // If not authenticated, get local favorites
    const favorites = await db.favorites
      .where('userId')
      .equals(undefined as any)
      .toArray()
    return favorites.map((f) => f.bazaarId)
  }
}

/**
 * Sync favorites from cloud to local database
 * Call this after user logs in
 */
export async function syncFavoritesFromCloud(): Promise<void> {
  if (!isAuthenticated()) {
    return
  }

  const userId = getCurrentUser()?.id
  if (!userId) {
    return
  }

  try {
    // Fetch all favorites from cloud
    const cloudFavorites = await pb.collection('favorites').getFullList<PBFavorite>({
      filter: `user = "${userId}"`,
      sort: '-created',
    })

    // Add to local database
    for (const cloudFav of cloudFavorites) {
      const favoriteId = `${userId}_${cloudFav.bazaar}`
      await db.favorites.put({
        id: favoriteId,
        bazaarId: cloudFav.bazaar,
        userId: userId,
        createdAt: cloudFav.created,
        syncedToCloud: true,
      })
    }
  } catch (error) {
    console.error('Failed to sync favorites from cloud:', error)
  }
}

/**
 * Sync local favorites to cloud
 * Call this after user logs in to upload local favorites
 */
export async function syncLocalFavoritesToCloud(): Promise<void> {
  if (!isAuthenticated()) {
    return
  }

  const userId = getCurrentUser()?.id
  if (!userId) {
    return
  }

  try {
    // Get all unsynced local favorites
    const unsyncedFavorites = await db.favorites
      .where('syncedToCloud')
      .equals(false)
      .toArray()

    // Upload to cloud
    for (const favorite of unsyncedFavorites) {
      try {
        await pb.collection('favorites').create({
          user: userId,
          bazaar: favorite.bazaarId,
        })

        // Update local record
        await db.favorites.update(favorite.id, {
          userId: userId,
          syncedToCloud: true,
        })
      } catch (error) {
        console.error('Failed to sync favorite to cloud:', error)
      }
    }
  } catch (error) {
    console.error('Failed to sync local favorites to cloud:', error)
  }
}

/**
 * Get total favorite count
 */
export async function getFavoriteCount(): Promise<number> {
  const userId = getCurrentUser()?.id

  if (userId) {
    return await db.favorites.where('userId').equals(userId).count()
  } else {
    return await db.favorites.where('userId').equals(undefined as any).count()
  }
}
