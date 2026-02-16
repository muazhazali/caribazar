import type { Bazaar } from "./types"

export const BAZAARS: Bazaar[] = [
  {
    id: "1",
    name: "Bazaar Ramadan Kampung Baru",
    description:
      "One of the largest and most iconic Ramadan bazaars in Kuala Lumpur, located in the heart of the Malay enclave. Famous for its wide variety of traditional dishes and bustling atmosphere.",
    address: "Jalan Raja Muda Musa, Kampung Baru, 50300 Kuala Lumpur",
    lat: 3.1650,
    lng: 101.7000,
    foodTypes: ["nasi-lemak", "satay", "murtabak", "ayam-percik", "kuih", "air-tebu", "bubur-lambuk"],
    rating: 4.5,
    reviewCount: 234,
    reviews: [
      { id: "r1", userId: "u1", userName: "Ahmad Razak", rating: 5, comment: "Best Ramadan bazaar in KL! The nasi lemak here is unbeatable.", createdAt: "2025-03-15" },
      { id: "r2", userId: "u2", userName: "Siti Nurhaliza", rating: 4, comment: "Great variety but very crowded during peak hours.", createdAt: "2025-03-14" },
      { id: "r3", userId: "u3", userName: "Kamal Hassan", rating: 5, comment: "Must visit every Ramadan. The satay stall near the entrance is legendary.", createdAt: "2025-03-12" },
    ],
    operatingHours: { start: "15:00", end: "19:30" },
    isOpen: true,
    photos: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"],
    stallCount: 150,
    district: "Kampung Baru",
    state: "Kuala Lumpur",
    status: "approved",
  },
  {
    id: "2",
    name: "Bazaar Ramadan Jalan TAR",
    description:
      "Stretching along the vibrant Jalan Tuanku Abdul Rahman, this bazaar is a shoppers paradise with food stalls serving everything from traditional Malay cuisine to modern fusion dishes.",
    address: "Jalan Tuanku Abdul Rahman, 50100 Kuala Lumpur",
    lat: 3.1530,
    lng: 101.6950,
    foodTypes: ["roti-john", "kebab", "burger-ramly", "laksa", "kuih", "tepung-pelita"],
    rating: 4.2,
    reviewCount: 187,
    reviews: [
      { id: "r4", userId: "u4", userName: "Fatimah Zahra", rating: 4, comment: "Love the Roti John here! Always fresh and generous portions.", createdAt: "2025-03-15" },
      { id: "r5", userId: "u5", userName: "Ismail Sabri", rating: 4, comment: "Good selection of food but parking is a nightmare.", createdAt: "2025-03-13" },
    ],
    operatingHours: { start: "15:00", end: "19:00" },
    isOpen: true,
    photos: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80"],
    stallCount: 120,
    district: "Jalan TAR",
    state: "Kuala Lumpur",
    status: "approved",
  },
  {
    id: "3",
    name: "Bazaar Ramadan Bangsar",
    description:
      "A more upscale bazaar catering to the Bangsar crowd with a mix of traditional and contemporary food offerings. Great for those looking for quality over quantity.",
    address: "Jalan Telawi, Bangsar, 59100 Kuala Lumpur",
    lat: 3.1300,
    lng: 101.6710,
    foodTypes: ["nasi-kerabu", "rendang", "satay", "kuih", "air-tebu"],
    rating: 4.3,
    reviewCount: 98,
    reviews: [
      { id: "r6", userId: "u6", userName: "Nurul Izzah", rating: 5, comment: "The nasi kerabu here is authentic Kelantanese style. Amazing!", createdAt: "2025-03-15" },
      { id: "r7", userId: "u7", userName: "Hafiz Rahman", rating: 4, comment: "Slightly pricier but the quality is top-notch.", createdAt: "2025-03-14" },
    ],
    operatingHours: { start: "15:30", end: "19:30" },
    isOpen: true,
    photos: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80"],
    stallCount: 60,
    district: "Bangsar",
    state: "Kuala Lumpur",
    status: "approved",
  },
  {
    id: "4",
    name: "Bazaar Ramadan Kelana Jaya",
    description:
      "A neighborhood favorite in Petaling Jaya, known for its friendly atmosphere and home-style cooking. Perfect for families looking for a local bazaar experience.",
    address: "Dataran Kelana, Kelana Jaya, 47301 Petaling Jaya",
    lat: 3.1060,
    lng: 101.6260,
    foodTypes: ["nasi-lemak", "murtabak", "putu-piring", "bubur-lambuk", "kuih"],
    rating: 4.0,
    reviewCount: 76,
    reviews: [
      { id: "r8", userId: "u8", userName: "Zainab Ali", rating: 4, comment: "The putu piring is freshly made and delicious!", createdAt: "2025-03-14" },
    ],
    operatingHours: { start: "16:00", end: "19:00" },
    isOpen: false,
    photos: ["https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80", "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80"],
    stallCount: 45,
    district: "Kelana Jaya",
    state: "Selangor",
    status: "approved",
  },
  {
    id: "5",
    name: "Bazaar Ramadan Shah Alam",
    description:
      "Located near the iconic Blue Mosque, this bazaar is one of the largest in Selangor. A must-visit for food lovers with hundreds of stalls offering every imaginable Malay delicacy.",
    address: "Persiaran Masjid, Seksyen 14, 40000 Shah Alam",
    lat: 3.0733,
    lng: 101.5185,
    foodTypes: ["ayam-percik", "satay", "laksa", "rendang", "nasi-lemak", "kebab", "burger-ramly"],
    rating: 4.6,
    reviewCount: 312,
    reviews: [
      { id: "r9", userId: "u9", userName: "Mohd Faizal", rating: 5, comment: "Massive bazaar with endless choices. The ayam percik is the best Ive ever had!", createdAt: "2025-03-15" },
      { id: "r10", userId: "u10", userName: "Aisha Tan", rating: 4, comment: "Arrive early to avoid the crowds. Worth the trip from KL!", createdAt: "2025-03-13" },
    ],
    operatingHours: { start: "15:00", end: "19:30" },
    isOpen: true,
    photos: ["https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80", "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=800&q=80"],
    stallCount: 200,
    district: "Shah Alam",
    state: "Selangor",
    status: "approved",
  },
  {
    id: "6",
    name: "Bazaar Ramadan Taman Tun",
    description:
      "A cozy bazaar in the TTDI neighborhood, popular with local residents and known for its quality homemade dishes and friendly vendors.",
    address: "Jalan Tun Mohd Fuad, TTDI, 60000 Kuala Lumpur",
    lat: 3.1340,
    lng: 101.6320,
    foodTypes: ["nasi-lemak", "kuih", "tepung-pelita", "air-tebu", "murtabak"],
    rating: 4.1,
    reviewCount: 65,
    reviews: [
      { id: "r11", userId: "u11", userName: "Rashid Ibrahim", rating: 4, comment: "Small but has excellent tepung pelita. A hidden gem!", createdAt: "2025-03-14" },
    ],
    operatingHours: { start: "16:00", end: "19:00" },
    isOpen: true,
    photos: ["https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80", "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80"],
    stallCount: 35,
    district: "TTDI",
    state: "Kuala Lumpur",
    status: "approved",
  },
  {
    id: "7",
    name: "Bazaar Ramadan Putrajaya",
    description:
      "A grand bazaar in Malaysias administrative capital, set against the beautiful backdrop of modern architecture. Draws visitors from across the Klang Valley.",
    address: "Presint 3, 62000 Putrajaya",
    lat: 2.9345,
    lng: 101.6865,
    foodTypes: ["satay", "nasi-kerabu", "ayam-percik", "rendang", "kuih", "bubur-lambuk"],
    rating: 4.4,
    reviewCount: 145,
    reviews: [
      { id: "r12", userId: "u12", userName: "Diana Yusof", rating: 5, comment: "Beautiful setting and amazing food. The rendang here is unforgettable.", createdAt: "2025-03-15" },
      { id: "r13", userId: "u13", userName: "Azlan Shah", rating: 4, comment: "Nice atmosphere but can get very hot in the afternoon.", createdAt: "2025-03-12" },
    ],
    operatingHours: { start: "15:00", end: "19:30" },
    isOpen: true,
    photos: ["https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80", "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80"],
    stallCount: 100,
    district: "Presint 3",
    state: "Putrajaya",
    status: "approved",
  },
  {
    id: "8",
    name: "Bazaar Ramadan Subang Jaya",
    description:
      "A vibrant suburban bazaar popular with students and young families. Known for its affordable prices and trendy food options alongside traditional favorites.",
    address: "SS15, 47500 Subang Jaya",
    lat: 3.0764,
    lng: 101.5874,
    foodTypes: ["burger-ramly", "kebab", "roti-john", "nasi-lemak", "air-tebu", "putu-piring"],
    rating: 3.9,
    reviewCount: 89,
    reviews: [
      { id: "r14", userId: "u14", userName: "Lina Ng", rating: 4, comment: "Great for a quick grab before iftar. The burger ramly stall is always packed!", createdAt: "2025-03-14" },
    ],
    operatingHours: { start: "15:30", end: "19:00" },
    isOpen: false,
    photos: ["https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&q=80", "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80"],
    stallCount: 55,
    district: "Subang Jaya",
    state: "Selangor",
    status: "approved",
  },
]

export function getBazaarById(id: string): Bazaar | undefined {
  return BAZAARS.find((b) => b.id === id)
}

export function searchBazaars(query: string): Bazaar[] {
  const lower = query.toLowerCase()
  return BAZAARS.filter(
    (b) =>
      b.name.toLowerCase().includes(lower) ||
      b.address.toLowerCase().includes(lower) ||
      b.district.toLowerCase().includes(lower) ||
      b.foodTypes.some((ft) => ft.includes(lower))
  )
}
