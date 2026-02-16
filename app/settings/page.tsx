"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ChevronLeft, Moon, Sun, Monitor, Bell, Globe, Ruler, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [newBazaarAlerts, setNewBazaarAlerts] = useState(true)
  const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">("km")
  const [language, setLanguage] = useState<"ms" | "en">("ms")

  const handleLogout = () => {
    logout()
    toast.success("Berjaya log keluar")
    router.push("/")
    router.refresh()
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
        <h1 className="text-xl font-bold text-foreground">Tetapan</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-6">
        <div className="mx-auto max-w-lg space-y-6">
          {/* Account Section */}
          {isAuthenticated && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User size={16} />
                  Akaun
                </CardTitle>
                <CardDescription className="text-sm">
                  Urus akaun anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="text-muted-foreground">Log masuk sebagai</div>
                  <div className="font-medium">{user?.email}</div>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Log Keluar
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Moon size={16} />
                Tema
              </CardTitle>
              <CardDescription className="text-sm">
                Pilih tema paparan aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={theme} onValueChange={setTheme}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <Sun size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium">Terang</div>
                      <div className="text-xs text-muted-foreground">Paparan terang</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <Moon size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium">Gelap</div>
                      <div className="text-xs text-muted-foreground">Paparan gelap</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <Monitor size={16} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium">Sistem</div>
                      <div className="text-xs text-muted-foreground">Ikut tetapan peranti</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell size={16} />
                Notifikasi
              </CardTitle>
              <CardDescription className="text-sm">
                Urus notifikasi dan makluman
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="notifications" className="text-sm font-medium">
                    Benarkan Notifikasi
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Terima notifikasi push dari aplikasi
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="new-bazaar" className="text-sm font-medium">
                    Bazaar Baharu
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Makluman apabila bazaar baharu ditambah
                  </p>
                </div>
                <Switch
                  id="new-bazaar"
                  checked={newBazaarAlerts}
                  onCheckedChange={setNewBazaarAlerts}
                  disabled={!notifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe size={16} />
                Bahasa
              </CardTitle>
              <CardDescription className="text-sm">
                Pilih bahasa paparan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={language} onValueChange={(v) => setLanguage(v as "ms" | "en")}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="ms" id="ms" />
                  <Label htmlFor="ms" className="flex-1 cursor-pointer">
                    <div className="font-medium">Bahasa Melayu</div>
                    <div className="text-xs text-muted-foreground">Malay</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en" className="flex-1 cursor-pointer">
                    <div className="font-medium">English</div>
                    <div className="text-xs text-muted-foreground">Inggeris</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Distance Unit Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Ruler size={16} />
                Unit Jarak
              </CardTitle>
              <CardDescription className="text-sm">
                Pilih unit pengukuran jarak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={distanceUnit} onValueChange={(v) => setDistanceUnit(v as "km" | "miles")}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="km" id="km" />
                  <Label htmlFor="km" className="flex-1 cursor-pointer">
                    <div className="font-medium">Kilometer (km)</div>
                    <div className="text-xs text-muted-foreground">Unit metrik</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="miles" id="miles" />
                  <Label htmlFor="miles" className="flex-1 cursor-pointer">
                    <div className="font-medium">Miles (mi)</div>
                    <div className="text-xs text-muted-foreground">Unit imperial</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Data & Storage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data & Storan</CardTitle>
              <CardDescription className="text-sm">
                Urus data tempatan dan storan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (confirm("Kosongkan cache? Ini akan membuang semua data tempatan.")) {
                    localStorage.clear()
                    sessionStorage.clear()
                    toast.success("Cache dikosongkan")
                    setTimeout(() => window.location.reload(), 500)
                  }
                }}
              >
                Kosongkan Cache
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => {
                  if (confirm("Padam semua data tempatan? Tindakan ini tidak boleh dibatalkan.")) {
                    localStorage.clear()
                    sessionStorage.clear()
                    // Clear IndexedDB
                    if (window.indexedDB) {
                      indexedDB.databases().then((dbs) => {
                        dbs.forEach((db) => {
                          if (db.name) indexedDB.deleteDatabase(db.name)
                        })
                      })
                    }
                    toast.success("Data tempatan dipadam")
                    setTimeout(() => window.location.href = "/", 500)
                  }
                }}
              >
                Padam Data Tempatan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
