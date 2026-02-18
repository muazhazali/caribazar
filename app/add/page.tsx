import type { Metadata } from "next"
import { AddBazaarForm } from "./add-bazaar-form"

export const metadata: Metadata = {
  title: "Tambah Bazaar Baru - Cari Bazar",
  description: "Daftar bazaar baru untuk dikongsi dengan komuniti.",
}

export default function AddBazaarPage() {
  return <AddBazaarForm />
}
