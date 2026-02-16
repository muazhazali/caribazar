import dotenv from 'dotenv'
import { resolve } from 'path'
import PocketBase from 'pocketbase'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pb-bazar.muaz.app'
const pb = new PocketBase(PB_URL)

async function testSimple() {
  console.log(`Testing connection to: ${PB_URL}\n`)

  try {
    // Test 1: Simple fetch without filters
    console.log('Test 1: Fetching bazaars (no filter)...')
    const bazaars = await pb.collection('bazaars').getList(1, 10)
    console.log(`✅ Found ${bazaars.items.length} bazaars (total: ${bazaars.totalItems})`)

    if (bazaars.items.length > 0) {
      console.log(`   First: ${(bazaars.items[0] as any).name}`)
    }

    // Test 2: Fetch food types
    console.log('\nTest 2: Fetching food types...')
    const foodTypes = await pb.collection('food_types').getList(1, 10)
    console.log(`✅ Found ${foodTypes.items.length} food types (total: ${foodTypes.totalItems})`)

    console.log('\n🎉 Connection successful!')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error('URL:', error.url)
    console.error('Status:', error.status)
  }
}

testSimple()
