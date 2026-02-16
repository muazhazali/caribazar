"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { pb } from "@/lib/pocketbase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuth2Callback = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const state = params.get('state')

        console.log('Callback params:', { code: code?.substring(0, 20), state })

        if (!code) {
          setError("Kod pengesahan tidak dijumpai")
          return
        }

        // Get provider data from localStorage
        const providerData = localStorage.getItem('provider')
        if (!providerData) {
          setError("Data provider tidak dijumpai. Sila cuba log masuk semula.")
          return
        }

        const provider = JSON.parse(providerData)
        console.log('Provider data:', provider)

        // Verify state matches
        if (state && provider.state && state !== provider.state) {
          setError("State tidak sepadan. Kemungkinan serangan CSRF.")
          return
        }

        const redirectUrl = `${window.location.origin}/auth/callback`

        console.log('Exchanging code for token...')

        // Exchange code for auth token
        const authData = await pb.collection('users').authWithOAuth2Code(
          provider.name,
          code,
          provider.codeVerifier,
          redirectUrl
        )

        console.log('Auth successful:', authData)

        // Clear provider data
        localStorage.removeItem('provider')

        // Redirect to home page
        router.push("/")
        router.refresh()

      } catch (error: any) {
        console.error("OAuth2 callback error:", error)
        setError(error?.message || "Pengesahan gagal. Sila cuba lagi.")
      }
    }

    handleOAuth2Callback()
  }, [router])

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle>Pengesahan Gagal</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Cuba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <div>
          <p className="text-lg font-medium">Mengesahkan...</p>
          <p className="text-sm text-muted-foreground mt-1">Sila tunggu sebentar</p>
        </div>
      </div>
    </div>
  )
}
