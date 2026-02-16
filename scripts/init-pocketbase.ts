import dotenv from 'dotenv'
import { resolve } from 'path'
import PocketBase from 'pocketbase'
import { BAZAARS } from '../lib/mock-data'
import { FOOD_TYPE_LABELS, FOOD_TYPE_COLORS } from '../lib/types'
import type { FoodType } from '../lib/types'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const PB_URL = process.env.POCKETBASE_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL
const PB_ADMIN_EMAIL = process.env.POCKETBASE_SU_EMAIL
const PB_ADMIN_PASSWORD = process.env.POCKETBASE_SU_PASSWORD

if (!PB_URL || !PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error('❌ Missing required environment variables')
  console.error('   POCKETBASE_URL:', PB_URL ? '✓' : '✗')
  console.error('   POCKETBASE_SU_EMAIL:', PB_ADMIN_EMAIL ? '✓' : '✗')
  console.error('   POCKETBASE_SU_PASSWORD:', PB_ADMIN_PASSWORD ? '✓' : '✗')
  process.exit(1)
}

const pb = new PocketBase(PB_URL)

// Food type icons mapping (Lucide icon names)
const FOOD_TYPE_ICONS: Record<FoodType, string> = {
  'nasi-lemak': 'Utensils',
  'satay': 'Flame',
  'murtabak': 'ChefHat',
  'roti-john': 'Sandwich',
  'ayam-percik': 'drumstick',
  'laksa': 'Bowl',
  'kuih': 'Cake',
  'air-tebu': 'GlassWater',
  'nasi-kerabu': 'Salad',
  'rendang': 'Beef',
  'tepung-pelita': 'Cookie',
  'bubur-lambuk': 'Soup',
  'kebab': 'Beef',
  'burger-ramly': 'Burger',
  'putu-piring': 'Cookie',
}

/**
 * Step 1: Authenticate as admin
 */
async function authenticateAdmin() {
  console.log('\n1️⃣  Authenticating as admin...')
  try {
    await pb.admins.authWithPassword(PB_ADMIN_EMAIL!, PB_ADMIN_PASSWORD!)
    console.log('   ✅ Admin authenticated successfully')
  } catch (error) {
    console.error('   ❌ Admin authentication failed:', error)
    throw error
  }
}

/**
 * Step 2: Seed food types
 */
async function seedFoodTypes(): Promise<Map<FoodType, string>> {
  console.log('\n2️⃣  Seeding food types...')
  const foodTypeMap = new Map<FoodType, string>()
  let created = 0
  let skipped = 0

  for (const [slug, name] of Object.entries(FOOD_TYPE_LABELS)) {
    try {
      // Check if already exists
      const existing = await pb.collection('food_types').getFullList({
        filter: `slug="${slug}"`,
      })

      if (existing.length > 0) {
        foodTypeMap.set(slug as FoodType, existing[0].id)
        skipped++
        continue
      }

      // Create new food type
      const record = await pb.collection('food_types').create({
        name,
        slug,
        icon: FOOD_TYPE_ICONS[slug as FoodType],
        color_class: FOOD_TYPE_COLORS[slug as FoodType],
      })

      foodTypeMap.set(slug as FoodType, record.id)
      created++
    } catch (error) {
      console.error(`   ⚠️  Failed to seed food type "${slug}":`, error)
    }
  }

  console.log(`   ✅ Food types: ${created} created, ${skipped} skipped`)
  return foodTypeMap
}

/**
 * Step 3: Create sample users from mock data reviews
 */
async function seedUsers(): Promise<Map<string, string>> {
  console.log('\n3️⃣  Seeding users...')
  const userMap = new Map<string, string>()
  let created = 0
  let skipped = 0

  // Extract unique reviewer names from mock bazaars
  const reviewers = new Set<string>()
  BAZAARS.forEach((bazaar) => {
    bazaar.reviews.forEach((review) => {
      reviewers.add(review.userName)
    })
  })

  for (const userName of reviewers) {
    try {
      // Generate email from name (e.g., "Ahmad Razak" -> "ahmad.razak@example.com")
      const email = userName.toLowerCase().replace(/\s+/g, '.') + '@example.com'

      // Check if user already exists
      const existing = await pb.collection('users').getFullList({
        filter: `email="${email}"`,
      })

      if (existing.length > 0) {
        userMap.set(userName, existing[0].id)
        skipped++
        continue
      }

      // Create new user
      const record = await pb.collection('users').create({
        email,
        password: 'password123',
        passwordConfirm: 'password123',
        name: userName,
        role: 'user',
      })

      userMap.set(userName, record.id)
      created++
    } catch (error) {
      console.error(`   ⚠️  Failed to seed user "${userName}":`, error)
    }
  }

  console.log(`   ✅ Users: ${created} created, ${skipped} skipped`)
  return userMap
}

/**
 * Step 4: Seed bazaars with food type relations
 */
async function seedBazaars(
  foodTypeMap: Map<FoodType, string>,
  userMap: Map<string, string>
): Promise<Map<string, string>> {
  console.log('\n4️⃣  Seeding bazaars...')
  const bazaarMap = new Map<string, string>()
  let created = 0
  let skipped = 0

  // Get the first user to use as submitter
  const submitterId = Array.from(userMap.values())[0]

  for (const bazaar of BAZAARS) {
    try {
      // Check if bazaar already exists
      const existing = await pb.collection('bazaars').getFullList({
        filter: `name="${bazaar.name.replace(/"/g, '\\"')}"`,
      })

      if (existing.length > 0) {
        bazaarMap.set(bazaar.name, existing[0].id)
        skipped++
        continue
      }

      // Map food type slugs to PocketBase IDs
      const foodTypeIds = bazaar.foodTypes
        .map((slug) => foodTypeMap.get(slug))
        .filter((id): id is string => id !== undefined)

      // Create bazaar
      const record = await pb.collection('bazaars').create({
        name: bazaar.name,
        description: bazaar.description,
        district: bazaar.district,
        state: bazaar.state,
        address: bazaar.address,
        lat: bazaar.lat,
        lng: bazaar.lng,
        stall_count: bazaar.stallCount,
        food_types: foodTypeIds,
        open_hours: bazaar.operatingHours,
        status: 'approved',
        submitted_by: submitterId,
        avg_rating: 0, // Will be updated after seeding reviews
      })

      bazaarMap.set(bazaar.name, record.id)
      created++
    } catch (error) {
      console.error(`   ⚠️  Failed to seed bazaar "${bazaar.name}":`, error)
    }
  }

  console.log(`   ✅ Bazaars: ${created} created, ${skipped} skipped`)
  return bazaarMap
}

/**
 * Step 5: Seed reviews and calculate avg_rating
 */
async function seedReviews(
  userMap: Map<string, string>,
  bazaarMap: Map<string, string>
) {
  console.log('\n5️⃣  Seeding reviews...')
  let created = 0
  let skipped = 0

  for (const bazaar of BAZAARS) {
    const bazaarId = bazaarMap.get(bazaar.name)
    if (!bazaarId) {
      console.warn(`   ⚠️  Bazaar "${bazaar.name}" not found, skipping reviews`)
      continue
    }

    for (const review of bazaar.reviews) {
      try {
        const userId = userMap.get(review.userName)
        if (!userId) {
          console.warn(`   ⚠️  User "${review.userName}" not found, skipping review`)
          continue
        }

        // Check if review already exists (by bazaar + user combination)
        const existing = await pb.collection('reviews').getFullList({
          filter: `bazaar="${bazaarId}" && user="${userId}"`,
        })

        if (existing.length > 0) {
          skipped++
          continue
        }

        // Create review
        await pb.collection('reviews').create({
          bazaar: bazaarId,
          user: userId,
          rating: review.rating,
          comment: review.comment,
        })

        created++
      } catch (error) {
        console.error(`   ⚠️  Failed to seed review:`, error)
      }
    }

    // Calculate and update avg_rating for this bazaar
    try {
      const reviews = await pb.collection('reviews').getFullList({
        filter: `bazaar="${bazaarId}"`,
      })

      if (reviews.length > 0) {
        const avgRating =
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        await pb.collection('bazaars').update(bazaarId, {
          avg_rating: avgRating,
        })
      }
    } catch (error) {
      console.error(`   ⚠️  Failed to update avg_rating for "${bazaar.name}":`, error)
    }
  }

  console.log(`   ✅ Reviews: ${created} created, ${skipped} skipped`)
}

/**
 * Step 6: Verify setup
 */
async function verifySetup() {
  console.log('\n6️⃣  Verifying setup...')

  try {
    const foodTypes = await pb.collection('food_types').getFullList()
    console.log(`   ✅ food_types: ${foodTypes.length} records`)

    const users = await pb.collection('users').getFullList()
    console.log(`   ✅ users: ${users.length} records`)

    const bazaars = await pb.collection('bazaars').getFullList()
    console.log(`   ✅ bazaars: ${bazaars.length} records`)

    const reviews = await pb.collection('reviews').getFullList()
    console.log(`   ✅ reviews: ${reviews.length} records`)

    const favorites = await pb.collection('favorites').getFullList()
    console.log(`   ✅ favorites: ${favorites.length} records`)

    const reports = await pb.collection('reports').getFullList()
    console.log(`   ✅ reports: ${reports.length} records`)
  } catch (error) {
    console.error('   ❌ Verification failed:', error)
    throw error
  }
}

/**
 * Main initialization function
 */
async function initPocketBase() {
  console.log('🚀 PocketBase Initialization Started')
  console.log(`   URL: ${PB_URL}`)

  try {
    // Step 1: Authenticate as admin
    await authenticateAdmin()

    // Step 2: Seed food types
    const foodTypeMap = await seedFoodTypes()

    // Step 3: Create sample users
    const userMap = await seedUsers()

    // Step 4: Seed bazaars with food type relations
    const bazaarMap = await seedBazaars(foodTypeMap, userMap)

    // Step 5: Seed reviews and calculate avg_rating
    await seedReviews(userMap, bazaarMap)

    // Step 6: Verify setup
    await verifySetup()

    console.log('\n✅ Initialization completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('   1. Start your dev server: pnpm dev')
    console.log('   2. Test the integration with: pnpm run test:crud')
    console.log('   3. View your PocketBase admin panel at:', PB_URL + '/_/')
  } catch (error) {
    console.error('\n❌ Initialization failed:', error)
    process.exit(1)
  }
}

// Run initialization
initPocketBase()
