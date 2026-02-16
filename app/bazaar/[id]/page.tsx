import { notFound } from "next/navigation"
import { getBazaarById, BAZAARS } from "@/lib/mock-data"
import { BazaarDetail } from "./bazaar-detail"

export function generateStaticParams() {
  return BAZAARS.map((b) => ({ id: b.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bazaar = getBazaarById(id)
  if (!bazaar) return { title: "Bazaar tidak dijumpai" }
  return {
    title: `${bazaar.name} - Bazaar Ramadan`,
    description: bazaar.description,
  }
}

export default async function BazaarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bazaar = getBazaarById(id)
  if (!bazaar) notFound()

  return <BazaarDetail bazaar={bazaar} />
}
