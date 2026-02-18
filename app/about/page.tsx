"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Heart, Globe, Github, Mail, ExternalLink, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  const router = useRouter()

  const features = [
    {
      icon: Globe,
      title: "Peta Interaktif",
      description: "Cari bazar dengan mudah menggunakan peta interaktif"
    },
    {
      icon: Heart,
      title: "Simpan Kegemaran",
      description: "Simpan bazaar kegemaran anda untuk akses mudah"
    },
    {
      icon: Shield,
      title: "Offline Support",
      description: "Akses data walaupun tanpa sambungan internet"
    }
  ]

  const contributors = [
    { name: "Tim Pembangunan", role: "Pembangunan & Reka Bentuk" },
    { name: "Komuniti", role: "Penyumbang Data Bazaar" }
  ]

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
        <h1 className="text-xl font-bold text-foreground">Tentang</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-6">
        <div className="mx-auto max-w-lg space-y-6">
          {/* App Info */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <span className="text-3xl">🌙</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Cari Bazar</h2>
            <p className="text-muted-foreground text-sm">
              Cari Juadah Berbuka
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Versi 1.0.0 Beta
            </div>
          </div>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ciri-ciri Utama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Misi Kami</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami komited untuk membantu komuniti menemui dan berkongsi maklumat tentang
                bazaar Ramadan di seluruh Malaysia. Dengan platform yang mudah digunakan,
                kami mahu memudahkan perjalanan anda mencari juadah berbuka puasa yang
                terbaik.
              </p>
            </CardContent>
          </Card>

          {/* Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Penyumbang</CardTitle>
              <CardDescription className="text-sm">
                Terima kasih kepada semua yang menyumbang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {contributors.map((contributor, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-3" />}
                  <div>
                    <div className="font-medium text-sm">{contributor.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {contributor.role}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pautan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <Github size={16} className="mr-2" />
                Kod Sumber
                <ExternalLink size={14} className="ml-auto text-muted-foreground" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open("mailto:support@bazaarramadan.app", "_blank")}
              >
                <Mail size={16} className="mr-2" />
                Hubungi Kami
                <ExternalLink size={14} className="ml-auto text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>

          {/* Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Perundangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <FileText size={16} className="mr-2" />
                Dasar Privasi
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText size={16} className="mr-2" />
                Terma & Syarat
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield size={16} className="mr-2" />
                Lesen
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-1 pt-4">
            <p>Dibuat dengan ❤️ untuk komuniti</p>
            <p>© 2025 Cari Bazar. Semua hak terpelihara.</p>
            <p className="text-[10px]">
              Powered by Next.js, PocketBase & OpenStreetMap
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
