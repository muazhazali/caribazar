import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Bazaar Ramadan - Cari Bazaar Berhampiran Anda',
  description:
    'Direktori Bazaar Ramadan seluruh Malaysia. Cari bazaar berhampiran, lihat menu, dan kongsi pengalaman anda.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#15803d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ms">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
