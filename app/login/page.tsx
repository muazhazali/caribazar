"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { pb } from "@/lib/pocketbase"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      // Get OAuth2 providers
      const authMethods = await pb.collection('users').listAuthMethods()

      console.log('Auth methods response:', authMethods)

      // Check if oauth2 exists
      if (!authMethods.oauth2 || !authMethods.oauth2.providers) {
        toast.error("Google OAuth2 tidak dikonfigurasi. Sila hubungi admin.")
        console.error('OAuth2 providers not found in response:', authMethods)
        setIsLoading(false)
        return
      }

      const googleProvider = authMethods.oauth2.providers.find(
        (provider: any) => provider.name === 'google'
      )

      if (!googleProvider) {
        toast.error("Google OAuth2 tidak dijumpai. Sila hubungi admin.")
        console.error('Google provider not found. Available providers:', authMethods.oauth2.providers)
        setIsLoading(false)
        return
      }

      console.log('Google provider found:', googleProvider)

      // Create redirect URL
      const redirectUrl = `${window.location.origin}/auth/callback`

      // Store provider data for callback
      localStorage.setItem('provider', JSON.stringify({
        name: googleProvider.name,
        codeVerifier: googleProvider.codeVerifier,
        state: googleProvider.state
      }))

      // The authUrl already contains all necessary parameters including state
      // We just need to append the redirect_uri
      const separator = googleProvider.authUrl.includes('?') ? '&' : '?'
      const authUrl = `${googleProvider.authUrl}${separator}redirect_uri=${encodeURIComponent(redirectUrl)}`

      console.log('Final auth URL:', authUrl)

      // Redirect to Google OAuth2
      window.location.href = authUrl

    } catch (error: any) {
      console.error("Google login error:", error)
      toast.error(error?.message || "Log masuk dengan Google gagal. Sila cuba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Kembali"
        >
          <ChevronLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Log Masuk</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Selamat Kembali!</CardTitle>
            <CardDescription>
              Log masuk dengan akaun Google anda untuk menyimpan bazaar kegemaran
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google OAuth2 Button */}
            <Button
              className="w-full h-12"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent mr-3" />
                  Memuatkan...
                </>
              ) : (
                <>
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Log Masuk dengan Google
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Dengan log masuk, anda bersetuju dengan Terma Perkhidmatan dan Dasar Privasi kami
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
