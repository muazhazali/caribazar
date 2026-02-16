import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables BEFORE importing pb client
dotenv.config({ path: resolve(__dirname, '../.env.local') })

import { pb } from '../lib/pocketbase'
import { getAllBazaars, searchBazaars, filterBazaars } from '../lib/api/bazaars'
import { createReport } from '../lib/api/reports'

async function testIntegration() {
  console.log('🧪 Running end-to-end integration test...\n')

  let createdUserId: string | null = null
  let createdReviewId: string | null = null
  let createdReportId: string | null = null

  try {
    // 1. User Registration
    console.log('1️⃣  User Registration')
    const testEmail = `integration-${Date.now()}@example.com`
    const testPassword = 'password123'

    const user = await pb.collection('users').create({
      email: testEmail,
      password: testPassword,
      passwordConfirm: testPassword,
      name: 'Integration Test User',
    })
    createdUserId = user.id
    console.log('   ✅ User registered')
    console.log(`   📧 Email: ${testEmail}`)

    // 2. User Login
    console.log('\n2️⃣  User Login')
    await pb.collection('users').authWithPassword(testEmail, testPassword)
    console.log('   ✅ User logged in')
    console.log(`   👤 User: ${pb.authStore.model?.name}`)

    // 3. Browse Bazaars
    console.log('\n3️⃣  Browse Bazaars')
    const bazaars = await getAllBazaars()
    console.log(`   ✅ Fetched ${bazaars.length} bazaars`)
    if (bazaars.length === 0) {
      throw new Error('No bazaars found. Run init-pocketbase first.')
    }

    // 4. Search Bazaars
    console.log('\n4️⃣  Search Bazaars')
    const searchResults = await searchBazaars('KL')
    console.log(`   ✅ Search returned ${searchResults.length} results`)

    // 5. Filter Bazaars
    console.log('\n5️⃣  Filter Bazaars')
    const filtered = await filterBazaars({
      foodTypes: ['nasi-lemak'],
      minRating: 4.0,
    })
    console.log(`   ✅ Filtered to ${filtered.length} bazaars`)

    // 6. Add to Favorites (Direct PocketBase API since Dexie is not available in Node)
    console.log('\n6️⃣  Add to Favorites')
    const favorite = await pb.collection('favorites').create({
      user: createdUserId,
      bazaar: bazaars[0].id,
    })
    console.log(`   ✅ Favorite added`)

    // Verify favorite exists
    const userFavs = await pb.collection('favorites').getFullList({
      filter: `user="${createdUserId}"`,
    })
    console.log(`   ✅ Favorites count: ${userFavs.length}`)
    if (userFavs.length === 0) {
      throw new Error('Favorite not added correctly')
    }

    // 7. Submit Review
    console.log('\n7️⃣  Submit Review')
    const review = await pb.collection('reviews').create({
      bazaar: bazaars[0].id,
      user: createdUserId,
      rating: 5,
      comment: 'Great experience! Integration test review.',
    })
    createdReviewId = review.id
    console.log('   ✅ Review submitted')
    console.log(`   ⭐ Rating: ${review.rating}`)

    // 8. Submit Report
    console.log('\n8️⃣  Submit Report')
    const report = await createReport(
      bazaars[0].id,
      'incorrect_info',
      'Address is outdated - integration test report'
    )
    if (!report) {
      throw new Error('Failed to create report')
    }
    createdReportId = report.id
    console.log('   ✅ Report submitted')
    console.log(`   📝 Reason: ${report.reason}`)

    // 9. Verify Review Shows in Bazaar
    console.log('\n9️⃣  Verify Review Integration')
    const bazaarWithReviews = await pb.collection('bazaars').getOne(bazaars[0].id, {
      expand: 'reviews_via_bazaar',
    })
    const reviewCount = bazaarWithReviews.expand?.reviews_via_bazaar?.length || 0
    console.log(`   ✅ Bazaar has ${reviewCount} reviews`)

    // 10. Verify Report
    console.log('\n🔟 Verify Report')
    const reports = await pb.collection('reports').getFullList({
      filter: `bazaar="${bazaars[0].id}"`,
    })
    console.log(`   ✅ Bazaar has ${reports.length} reports`)

    // Cleanup
    console.log('\n🧹 Cleanup...')

    // Save user auth before switching to admin
    const userAuth = pb.authStore.exportToCookie()

    // Authenticate as admin for cleanup (reports require admin to delete)
    await pb.admins.authWithPassword(
      process.env.POCKETBASE_SU_EMAIL!,
      process.env.POCKETBASE_SU_PASSWORD!
    )

    if (createdReportId) {
      await pb.collection('reports').delete(createdReportId)
      console.log('   ✅ Report deleted')
    }

    // Switch back to user auth for reviews/favorites
    pb.authStore.loadFromCookie(userAuth)

    if (createdReviewId) {
      await pb.collection('reviews').delete(createdReviewId)
      console.log('   ✅ Review deleted')
    }
    // Delete favorites
    const userFavorites = await pb.collection('favorites').getFullList({
      filter: `user="${createdUserId}"`,
    })
    for (const fav of userFavorites) {
      await pb.collection('favorites').delete(fav.id)
    }
    console.log('   ✅ Favorites deleted')

    if (createdUserId) {
      await pb.collection('users').delete(createdUserId)
      console.log('   ✅ User deleted')
    }

    console.log('\n🎉 End-to-end integration test passed!')
    console.log('\n📊 Test Summary:')
    console.log('   ✅ User registration & authentication')
    console.log('   ✅ Browse, search & filter bazaars')
    console.log('   ✅ Favorites management')
    console.log('   ✅ Review submission')
    console.log('   ✅ Report submission')
    console.log('   ✅ Data integrity & relations')
  } catch (error) {
    console.error('\n❌ Integration test failed:', error)

    // Attempt cleanup even if test failed
    console.log('\n🧹 Attempting cleanup...')
    try {
      // Authenticate as admin for cleanup
      await pb.admins.authWithPassword(
        process.env.POCKETBASE_SU_EMAIL!,
        process.env.POCKETBASE_SU_PASSWORD!
      )

      if (createdReportId) {
        await pb.collection('reports').delete(createdReportId)
      }
      if (createdReviewId) {
        await pb.collection('reviews').delete(createdReviewId)
      }
      if (createdUserId) {
        // Delete favorites first
        const userFavorites = await pb.collection('favorites').getFullList({
          filter: `user="${createdUserId}"`,
        })
        for (const fav of userFavorites) {
          await pb.collection('favorites').delete(fav.id)
        }
        await pb.collection('users').delete(createdUserId)
      }
      console.log('   ✅ Cleanup successful')
    } catch (cleanupError) {
      console.error('   ⚠️  Cleanup failed:', cleanupError)
    }

    process.exit(1)
  }
}

testIntegration()
