"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getFavoriteIds,
  getFavoriteCount,
} from '@/lib/favorites'

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites on mount
  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setIsLoading(true)
      const ids = await getFavoriteIds()
      setFavoriteIds(ids)
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = useCallback(
    async (bazaarId: string) => {
      const isFav = favoriteIds.includes(bazaarId)

      // Optimistically update UI
      setFavoriteIds((prev) =>
        isFav ? prev.filter((id) => id !== bazaarId) : [...prev, bazaarId]
      )

      try {
        if (isFav) {
          await removeFromFavorites(bazaarId)
        } else {
          await addToFavorites(bazaarId)
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
        // Revert on error
        setFavoriteIds((prev) =>
          isFav ? [...prev, bazaarId] : prev.filter((id) => id !== bazaarId)
        )
      }
    },
    [favoriteIds]
  )

  const checkIsFavorite = useCallback(
    (bazaarId: string) => {
      return favoriteIds.includes(bazaarId)
    },
    [favoriteIds]
  )

  return {
    favoriteIds,
    isLoading,
    toggleFavorite,
    isFavorite: checkIsFavorite,
    reload: loadFavorites,
  }
}

export function useFavoriteCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getFavoriteCount().then(setCount)
  }, [])

  return count
}
