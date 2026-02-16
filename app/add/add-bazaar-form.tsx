"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Camera,
  Info,
  UtensilsCrossed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FOOD_TYPE_LABELS, type FoodType } from "@/lib/types"

const STEPS = [
  { id: 1, label: "Maklumat", icon: Info },
  { id: 2, label: "Lokasi", icon: MapPin },
  { id: 3, label: "Makanan", icon: UtensilsCrossed },
  { id: 4, label: "Foto", icon: Camera },
]

interface FormData {
  name: string
  description: string
  address: string
  district: string
  state: string
  lat: string
  lng: string
  startTime: string
  endTime: string
  stallCount: string
  foodTypes: FoodType[]
}

export function AddBazaarForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    address: "",
    district: "",
    state: "",
    lat: "",
    lng: "",
    startTime: "15:00",
    endTime: "19:00",
    stallCount: "",
    foodTypes: [],
  })

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleFoodType = (ft: FoodType) => {
    setForm((prev) => ({
      ...prev,
      foodTypes: prev.foodTypes.includes(ft)
        ? prev.foodTypes.filter((f) => f !== ft)
        : [...prev.foodTypes, ft],
    }))
  }

  const canNext = () => {
    switch (step) {
      case 1:
        return form.name.trim() !== "" && form.address.trim() !== ""
      case 2:
        return form.district.trim() !== "" && form.state.trim() !== ""
      case 3:
        return form.foodTypes.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Check size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Berjaya Dihantar!</h1>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Terima kasih kerana menyumbang. Bazaar anda akan disemak oleh admin sebelum disiarkan.
          </p>
          <Button className="mt-4 rounded-xl" onClick={() => router.push("/")}>
            Kembali ke Peta
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </Link>
        <h1 className="text-base font-semibold text-foreground">Tambah Bazaar Baru</h1>
      </header>

      {/* Step Progress */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  step > s.id
                    ? "bg-primary text-primary-foreground"
                    : step === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s.id ? <Check size={14} /> : s.id}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  step >= s.id ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 w-6 rounded-full sm:w-10",
                    step > s.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto max-w-lg">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <StepHeader
                title="Maklumat Asas"
                description="Masukkan maklumat asas mengenai bazaar"
              />
              <FieldGroup label="Nama Bazaar *">
                <Input
                  placeholder="cth: Bazaar Ramadan Kampung Baru"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Alamat Penuh *">
                <Input
                  placeholder="cth: Jalan Raja Muda Musa, Kampung Baru"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Perihal">
                <textarea
                  placeholder="Ceritakan serba sedikit mengenai bazaar ini..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </FieldGroup>
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Waktu Mula">
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => updateField("startTime", e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Waktu Tamat">
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => updateField("endTime", e.target.value)}
                  />
                </FieldGroup>
              </div>
              <FieldGroup label="Anggaran Jumlah Gerai">
                <Input
                  type="number"
                  placeholder="cth: 50"
                  value={form.stallCount}
                  onChange={(e) => updateField("stallCount", e.target.value)}
                />
              </FieldGroup>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <StepHeader
                title="Lokasi"
                description="Masukkan lokasi bazaar untuk dipaparkan di peta"
              />
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Daerah *">
                  <Input
                    placeholder="cth: Kampung Baru"
                    value={form.district}
                    onChange={(e) => updateField("district", e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Negeri *">
                  <Input
                    placeholder="cth: Kuala Lumpur"
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                  />
                </FieldGroup>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Latitud">
                  <Input
                    type="number"
                    step="any"
                    placeholder="cth: 3.1650"
                    value={form.lat}
                    onChange={(e) => updateField("lat", e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Longitud">
                  <Input
                    type="number"
                    step="any"
                    placeholder="cth: 101.7000"
                    value={form.lng}
                    onChange={(e) => updateField("lng", e.target.value)}
                  />
                </FieldGroup>
              </div>
              {/* Map placeholder */}
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border bg-muted">
                <div className="flex h-full flex-col items-center justify-center gap-2">
                  <MapPin size={28} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Peta interaktif akan dimuatkan selepas sambungan backend
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <StepHeader
                title="Jenis Makanan"
                description="Pilih jenis makanan yang tersedia di bazaar ini"
              />
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FOOD_TYPE_LABELS) as FoodType[]).map((ft) => (
                  <button
                    key={ft}
                    onClick={() => toggleFoodType(ft)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      form.foodTypes.includes(ft)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {FOOD_TYPE_LABELS[ft]}
                  </button>
                ))}
              </div>
              {form.foodTypes.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {form.foodTypes.length} jenis makanan dipilih
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <StepHeader
                title="Foto Bazaar"
                description="Muat naik gambar bazaar untuk dikongsi"
              />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors"
                    aria-label={`Upload photo ${i}`}
                  >
                    <Camera size={20} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Tambah</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Muat naik foto akan diaktifkan selepas sambungan backend. Sila teruskan untuk hantar borang.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg gap-2">
          {step > 1 && (
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft size={16} className="mr-1" />
              Kembali
            </Button>
          )}
          {step < 4 ? (
            <Button
              className="flex-1 rounded-xl"
              disabled={!canNext()}
              onClick={() => setStep(step + 1)}
            >
              Seterusnya
              <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button className="flex-1 rounded-xl" onClick={handleSubmit}>
              <Check size={16} className="mr-1" />
              Hantar untuk Semakan
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-1">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function FieldGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}
