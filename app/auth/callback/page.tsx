"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  useEffect(() => {
    // This page is opened in a popup by the OAuth2 flow
    // The parent window will read the URL params and close this popup
    // We just show a loading state
  }, [])

  return (
    <div className="flex h-dvh items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Mengesahkan...</p>
      </div>
    </div>
  )
}
