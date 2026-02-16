"use client"

import { useEffect, useState } from "react"
import { pb, type PBUser } from "@/lib/pocketbase"

export function useAuth() {
  const [user, setUser] = useState<PBUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial auth state
    setUser(pb.authStore.model as PBUser | null)
    setIsLoading(false)

    // Subscribe to auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model as PBUser | null)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const logout = () => {
    pb.authStore.clear()
  }

  return {
    user,
    isAuthenticated: pb.authStore.isValid,
    isLoading,
    logout,
  }
}
