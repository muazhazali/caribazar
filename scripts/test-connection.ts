import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

// Import after env is loaded
import { getAllBazaars, getBazaarById } from '../lib/api/bazaars'
import { pb } from '../lib/pocketbase'

async function testConnection() {
  console.log('🧪 Testing PocketBase Connection')
  console.log('================================\n')
  console.log(`PocketBase URL: ${process.env.POCKETBASE_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL}\n`)

  try {
    // Test 1: Fetch all bazaars
    console.log('Test 1: Fetching all bazaars...')
    const bazaars = await getAllBazaars()
    console.log(`✅ Successfully fetched ${bazaars.length} bazaars`)
    if (bazaars.length > 0) {
      console.log(`   First bazaar: ${bazaars[0].name}`)
      console.log(`   Food types: ${bazaars[0].foodTypes.join(', ')}`)
      console.log(`   Rating: ${bazaars[0].rating}`)
      console.log(`   Is Open: ${bazaars[0].isOpen}`)
    }

    // Test 2: Fetch a specific bazaar
    if (bazaars.length > 0) {
      console.log(`\nTest 2: Fetching bazaar by ID (${bazaars[0].id})...`)
      const bazaar = await getBazaarById(bazaars[0].id)
      if (bazaar) {
        console.log(`✅ Successfully fetched: ${bazaar.name}`)
        console.log(`   Reviews: ${bazaar.reviews.length}`)
        console.log(`   Photos: ${bazaar.photos.length}`)
      } else {
        console.log('❌ Failed to fetch bazaar by ID')
      }
    }

    // Test 3: Check food_types collection
    console.log('\nTest 3: Checking food_types collection...')
    const foodTypes = await pb.collection('food_types').getFullList()
    console.log(`✅ Found ${foodTypes.length} food types`)
    console.log(`   Examples: ${foodTypes.slice(0, 5).map((ft: any) => ft.name).join(', ')}`)

    console.log('\n🎉 All tests passed!')
  } catch (error) {
    console.error('\n💥 Test failed:', error)
    process.exit(1)
  }
}

testConnection()
