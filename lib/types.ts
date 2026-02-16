export type FoodType =
  | "nasi-lemak"
  | "satay"
  | "murtabak"
  | "roti-john"
  | "ayam-percik"
  | "laksa"
  | "kuih"
  | "air-tebu"
  | "nasi-kerabu"
  | "rendang"
  | "tepung-pelita"
  | "bubur-lambuk"
  | "kebab"
  | "burger-ramly"
  | "putu-piring"

export const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  "nasi-lemak": "Nasi Lemak",
  satay: "Satay",
  murtabak: "Murtabak",
  "roti-john": "Roti John",
  "ayam-percik": "Ayam Percik",
  laksa: "Laksa",
  kuih: "Kuih",
  "air-tebu": "Air Tebu",
  "nasi-kerabu": "Nasi Kerabu",
  rendang: "Rendang",
  "tepung-pelita": "Tepung Pelita",
  "bubur-lambuk": "Bubur Lambuk",
  kebab: "Kebab",
  "burger-ramly": "Burger Ramly",
  "putu-piring": "Putu Piring",
}

export const FOOD_TYPE_COLORS: Record<FoodType, string> = {
  "nasi-lemak": "bg-amber-100 text-amber-800",
  satay: "bg-orange-100 text-orange-800",
  murtabak: "bg-yellow-100 text-yellow-800",
  "roti-john": "bg-red-100 text-red-800",
  "ayam-percik": "bg-rose-100 text-rose-800",
  laksa: "bg-emerald-100 text-emerald-800",
  kuih: "bg-pink-100 text-pink-800",
  "air-tebu": "bg-lime-100 text-lime-800",
  "nasi-kerabu": "bg-blue-100 text-blue-800",
  rendang: "bg-stone-200 text-stone-800",
  "tepung-pelita": "bg-green-100 text-green-800",
  "bubur-lambuk": "bg-amber-100 text-amber-800",
  kebab: "bg-sky-100 text-sky-800",
  "burger-ramly": "bg-violet-100 text-violet-800",
  "putu-piring": "bg-teal-100 text-teal-800",
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface Bazaar {
  id: string
  name: string
  description: string
  address: string
  lat: number
  lng: number
  foodTypes: FoodType[]
  rating: number
  reviewCount: number
  reviews: Review[]
  operatingHours: {
    start: string
    end: string
  }
  isOpen: boolean
  photos: string[]
  stallCount: number
  district: string
  state: string
  status: "approved" | "pending" | "rejected"
}
