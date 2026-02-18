import { notFound } from "next/navigation"
import { getBazaarById, getAllBazaars } from "@/lib/api/bazaars"
import { BazaarDetail } from "./bazaar-detail"

// Enable ISR (Incremental Static Regeneration) - revalidate every hour
export const revalidate = 3600

export async function generateStaticParams() {
  // Generate static routes for all bazaars at build time
  const bazaars = await getAllBazaars()
  return bazaars.map((b) => ({ id: b.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bazaar = await getBazaarById(id)
  if (!bazaar) return { title: "Bazaar tidak dijumpai" }
  return {
    title: `${bazaar.name} - Cari Bazar`,
    description: bazaar.description,
  }
}

export default async function BazaarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bazaar = await getBazaarById(id)
  if (!bazaar) notFound()

  return <BazaarDetail bazaar={bazaar} />
}
