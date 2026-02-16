"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Mail, Lock, User, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { pb } from "@/lib/pocketbase"
import { toast } from "sonner"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Sila isi semua medan")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Kata laluan tidak sepadan")
      return
    }

    if (password.length < 8) {
      toast.error("Kata laluan mestilah sekurang-kurangnya 8 aksara")
      return
    }

    setIsLoading(true)

    try {
      // Create user
      await pb.collection('users').create({
        username,
        email,
        password,
        passwordConfirm: confirmPassword,
        name: username,
        role: 'user',
      })

      // Auto-login after registration
      await pb.collection('users').authWithPassword(email, password)

      toast.success("Akaun berjaya didaftarkan!")
      router.push("/")
      router.refresh()
    } catch (error: any) {
      console.error("Registration error:", error)

      // Handle specific error messages
      let errorMessage = "Pendaftaran gagal. Sila cuba lagi."

      if (error?.data?.data) {
        const errorData = error.data.data
        if (errorData.email) {
          errorMessage = "E-mel telah digunakan"
        } else if (errorData.username) {
          errorMessage = "Nama pengguna telah digunakan"
        }
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true)

    try {
      // Get OAuth2 providers
      const authMethods = await pb.collection('users').listAuthMethods()
      const googleProvider = authMethods.authProviders.find(
        (provider) => provider.name === 'google'
      )

      if (!googleProvider) {
        toast.error("Google OAuth2 tidak dikonfigurasi")
        setIsGoogleLoading(false)
        return
      }

      // Redirect to Google OAuth2
      const redirectUrl = `${window.location.origin}/auth/callback`
      const authUrl = googleProvider.authUrl + redirectUrl

      // Open OAuth2 popup
      const width = 500
      const height = 600
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        authUrl,
        'oauth2-popup',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      // Listen for OAuth2 callback
      const checkPopup = setInterval(async () => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup)
          setIsGoogleLoading(false)
          return
        }

        try {
          // Check if popup has navigated to callback URL
          const popupUrl = popup.location.href
          if (popupUrl.includes('/auth/callback')) {
            const urlParams = new URLSearchParams(popup.location.search)
            const code = urlParams.get('code')
            const state = urlParams.get('state')

            if (code && state) {
              clearInterval(checkPopup)
              popup.close()

              // Exchange code for auth token
              await pb.collection('users').authWithOAuth2Code(
                googleProvider.name,
                code,
                googleProvider.codeVerifier,
                redirectUrl
              )

              toast.success("Berjaya daftar dengan Google!")
              router.push("/")
              router.refresh()
            }
          }
        } catch (error) {
          // Ignore cross-origin errors while popup is on Google domain
        }
      }, 500)
    } catch (error: any) {
      console.error("Google register error:", error)
      toast.error(error?.message || "Pendaftaran dengan Google gagal")
      setIsGoogleLoading(false)
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
        <h1 className="text-xl font-bold text-foreground">Daftar Akaun</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Cipta Akaun Baru</CardTitle>
            <CardDescription>
              Daftar akaun untuk menyimpan bazaar kegemaran anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google OAuth2 */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent mr-2" />
                  Memuatkan...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                  Daftar dengan Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nama Pengguna</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="namapengguna"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-9"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@contoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Laluan</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 aksara"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Sahkan Kata Laluan</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Taip semula kata laluan"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    Mendaftar...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    Daftar Akaun
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Sudah ada akaun? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Log masuk di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
