"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Camera, Save, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isAuthenticated, getCurrentUser, type PBUser } from "@/lib/pocketbase"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<PBUser | null>(null)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      setUsername(currentUser.username)
      setEmail(currentUser.email)
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    // TODO: Implement profile update with PocketBase
    setTimeout(() => {
      toast.success("Profil berjaya dikemaskini")
      setIsLoading(false)
    }, 500)
  }

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    toast.info("Ciri upload avatar akan datang!")
  }

  if (!isAuthenticated()) {
    return (
      <div className="flex h-dvh flex-col bg-background">
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
          <h1 className="text-xl font-bold text-foreground">Profil</h1>
        </div>

        {/* Not Authenticated */}
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-sm w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <LogIn size={28} className="text-primary" />
                </div>
              </div>
              <CardTitle>Log Masuk Diperlukan</CardTitle>
              <CardDescription>
                Log masuk dengan Google untuk menguruskan profil dan menyimpan data anda di cloud
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/login")}>
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
                Log Masuk dengan Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
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
        <h1 className="text-xl font-bold text-foreground">Profil Saya</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-6">
        <div className="mx-auto max-w-lg space-y-6">
          {/* Avatar Section */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-border">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                onClick={handleAvatarUpload}
                aria-label="Upload avatar"
              >
                <Camera size={14} />
              </Button>
            </div>
          </div>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Maklumat Peribadi</CardTitle>
              <CardDescription className="text-sm">
                Kemaskini maklumat profil anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama pengguna"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mel</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan e-mel"
                />
              </div>

              <div className="space-y-2">
                <Label>Peranan</Label>
                <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  {user?.role === "admin" ? "Pentadbir" : user?.role === "mod" ? "Moderator" : "Pengguna"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistik Akaun</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">0</div>
                  <div className="text-xs text-muted-foreground mt-1">Sumbangan</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">0</div>
                  <div className="text-xs text-muted-foreground mt-1">Ulasan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
