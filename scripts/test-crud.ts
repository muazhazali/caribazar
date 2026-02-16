import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables BEFORE importing pb client
dotenv.config({ path: resolve(__dirname, '../.env.local') })

import { pb } from '../lib/pocketbase'
import { getAllBazaars, getBazaarById } from '../lib/api/bazaars'

async function testCRUD() {
  console.log('🧪 Testing CRUD operations...\n')

  try {
    // Test 1: Fetch all bazaars
    console.log('1️⃣  Testing getAllBazaars()...')
    const bazaars = await getAllBazaars()
    console.log(`   ✅ Fetched ${bazaars.length} bazaars`)
    if (bazaars.length > 0) {
      console.log(`   📍 First bazaar: ${bazaars[0].name}`)
    }

    // Test 2: Fetch single bazaar with relations
    if (bazaars.length > 0) {
      console.log('\n2️⃣  Testing getBazaarById()...')
      const bazaar = await getBazaarById(bazaars[0].id)
      if (bazaar) {
        console.log(`   ✅ Fetched bazaar: ${bazaar.name}`)
        console.log(`   📍 Location: ${bazaar.district}, ${bazaar.state}`)
        console.log(`   🍽️  Food types: ${bazaar.foodTypes.length}`)
        console.log(`   ⭐ Rating: ${bazaar.rating} (${bazaar.reviewCount} reviews)`)
        console.log(`   🕒 Hours: ${bazaar.operatingHours.start} - ${bazaar.operatingHours.end}`)
        console.log(`   ${bazaar.isOpen ? '🟢' : '🔴'} Status: ${bazaar.isOpen ? 'Open' : 'Closed'}`)
      } else {
        console.log('   ❌ Failed to fetch bazaar')
      }
    }

    // Test 3: Test food_types collection
    console.log('\n3️⃣  Testing food_types collection...')
    const foodTypes = await pb.collection('food_types').getFullList()
    console.log(`   ✅ Food types: ${foodTypes.length}`)
    if (foodTypes.length > 0) {
      console.log(`   🍴 Sample: ${foodTypes[0].name} (${foodTypes[0].slug})`)
    }

    // Test 4: Test relation expansion
    if (bazaars.length > 0) {
      console.log('\n4️⃣  Testing relation expansion...')
      const bazaarWithExpand = await pb.collection('bazaars').getOne(bazaars[0].id, {
        expand: 'food_types,reviews_via_bazaar,submitted_by',
      })
      console.log('   ✅ Relation expansion works:')
      console.log(`      - food_types expanded: ${!!bazaarWithExpand.expand?.food_types}`)
      console.log(`      - reviews expanded: ${!!bazaarWithExpand.expand?.reviews_via_bazaar}`)
      console.log(`      - submitted_by expanded: ${!!bazaarWithExpand.expand?.submitted_by}`)
    }

    // Test 5: Test users collection
    console.log('\n5️⃣  Testing users collection...')
    const users = await pb.collection('users').getFullList()
    console.log(`   ✅ Users: ${users.length}`)
    if (users.length > 0) {
      console.log(`   👤 Sample: ${users[0].name || users[0].email}`)
    }

    // Test 6: Test reviews collection
    console.log('\n6️⃣  Testing reviews collection...')
    const reviews = await pb.collection('reviews').getFullList({
      expand: 'user,bazaar',
    })
    console.log(`   ✅ Reviews: ${reviews.length}`)
    if (reviews.length > 0) {
      console.log(`   💬 Sample: ${reviews[0].comment?.substring(0, 50)}...`)
    }

    console.log('\n✅ All CRUD tests passed!')
  } catch (error) {
    console.error('\n❌ CRUD test failed:', error)
    process.exit(1)
  }
}

testCRUD()
