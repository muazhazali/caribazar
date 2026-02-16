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
                Log masuk untuk menguruskan profil dan menyimpan data anda di cloud
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={() => router.push("/login")}>
                  Log Masuk
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/register")}>
                  Daftar Akaun
                </Button>
              </div>
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
