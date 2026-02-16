import Dexie, { Table } from 'dexie'

export interface FavoriteBazaar {
  id: string
  bazaarId: string
  userId?: string
  createdAt: string
  syncedToCloud: boolean
}

export interface CachedBazaar {
  id: string
  name: string
  description: string
  address: string
  lat: number
  lng: number
  rating: number
  photos: string[]
  cachedAt: string
}

export class BazaarDB extends Dexie {
  favorites!: Table<FavoriteBazaar>
  cachedBazaars!: Table<CachedBazaar>

  constructor() {
    super('BazaarDB')
    this.version(1).stores({
      favorites: 'id, bazaarId, userId, createdAt, syncedToCloud',
      cachedBazaars: 'id, name, cachedAt',
    })
  }
}

export const db = new BazaarDB()
