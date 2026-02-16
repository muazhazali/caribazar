import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables BEFORE importing pb client
dotenv.config({ path: resolve(__dirname, '../.env.local') })

import { pb } from '../lib/pocketbase'
import { addToFavorites, removeFromFavorites, getFavoriteIds } from '../lib/favorites'
import { getAllBazaars } from '../lib/api/bazaars'

async function testFavorites() {
  console.log('🧪 Testing favorites sync...\n')

  let createdUserId: string | null = null

  try {
    // Setup: Create a test user and login
    console.log('0️⃣  Setting up test user...')
    const testEmail = `test-favorites-${Date.now()}@example.com`
    const testPassword = 'password123'

    const user = await pb.collection('users').create({
      email: testEmail,
      password: testPassword,
      passwordConfirm: testPassword,
      name: 'Test Favorites User',
    })
    createdUserId = user.id

    await pb.collection('users').authWithPassword(testEmail, testPassword)
    console.log('   ✅ Test user created and logged in')

    // Get a bazaar ID to test with
    console.log('\n1️⃣  Fetching a bazaar to test with...')
    const bazaars = await getAllBazaars()
    if (bazaars.length === 0) {
      throw new Error('No bazaars found. Run init-pocketbase first.')
    }
    const bazaarId = bazaars[0].id
    console.log(`   ✅ Using bazaar: ${bazaars[0].name}`)

    // Test 2: Add favorite
    console.log('\n2️⃣  Testing addToFavorites()...')
    await addToFavorites(bazaarId)
    console.log('   ✅ Added favorite (local + cloud)')

    // Test 3: Get favorites
    console.log('\n3️⃣  Testing getFavoriteIds()...')
    const favorites = await getFavoriteIds()
    console.log(`   ✅ Retrieved ${favorites.length} favorites`)
    if (!favorites.includes(bazaarId)) {
      throw new Error('Bazaar not found in favorites')
    }
    console.log('   ✅ Bazaar is in favorites list')

    // Test 4: Verify cloud sync
    console.log('\n4️⃣  Verifying cloud sync...')
    const cloudFavorites = await pb.collection('favorites').getFullList({
      filter: `user="${createdUserId}"`,
    })
    console.log(`   ✅ Cloud has ${cloudFavorites.length} favorites`)
    if (cloudFavorites.length === 0) {
      throw new Error('Cloud favorites not synced')
    }

    // Test 5: Remove favorite
    console.log('\n5️⃣  Testing removeFromFavorites()...')
    await removeFromFavorites(bazaarId)
    console.log('   ✅ Removed favorite (local + cloud)')

    // Test 6: Verify removal
    console.log('\n6️⃣  Verifying removal...')
    const favoritesAfter = await getFavoriteIds()
    console.log(`   ✅ Verified removal: ${favoritesAfter.length} favorites remaining`)
    if (favoritesAfter.includes(bazaarId)) {
      throw new Error('Bazaar still in favorites after removal')
    }

    // Clean up
    console.log('\n7️⃣  Cleaning up...')
    await pb.collection('users').delete(createdUserId!)
    console.log('   ✅ Cleanup successful')

    console.log('\n✅ All favorites tests passed!')
  } catch (error) {
    console.error('\n❌ Favorites test failed:', error)

    // Attempt cleanup even if test failed
    if (createdUserId) {
      try {
        // Delete any favorites first
        const userFavorites = await pb.collection('favorites').getFullList({
          filter: `user="${createdUserId}"`,
        })
        for (const fav of userFavorites) {
          await pb.collection('favorites').delete(fav.id)
        }
        await pb.collection('users').delete(createdUserId)
        console.log('   ✅ Cleanup successful')
      } catch (cleanupError) {
        console.error('   ⚠️  Cleanup failed:', cleanupError)
      }
    }

    process.exit(1)
  }
}

testFavorites()
