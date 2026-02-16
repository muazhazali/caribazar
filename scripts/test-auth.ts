import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables BEFORE importing pb client
dotenv.config({ path: resolve(__dirname, '../.env.local') })

import { pb } from '../lib/pocketbase'

async function testAuth() {
  console.log('🧪 Testing authentication...\n')

  let createdUserId: string | null = null

  try {
    // Test 1: User registration
    console.log('1️⃣  Testing user registration...')
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'password123'

    const user = await pb.collection('users').create({
      email: testEmail,
      password: testPassword,
      passwordConfirm: testPassword,
      name: 'Test User',
    })
    createdUserId = user.id
    console.log('   ✅ User registration works')
    console.log(`   📧 Email: ${testEmail}`)
    console.log(`   👤 Name: ${user.name}`)

    // Test 2: User login
    console.log('\n2️⃣  Testing user login...')
    const auth = await pb.collection('users').authWithPassword(testEmail, testPassword)
    console.log('   ✅ User login works')
    console.log(`   👤 User: ${auth.record.name}`)
    console.log(`   🎫 Token: ${auth.token.substring(0, 20)}...`)

    // Test 3: Check authenticated state
    console.log('\n3️⃣  Testing authenticated state...')
    console.log(`   ✅ Is authenticated: ${pb.authStore.isValid}`)
    console.log(`   👤 Current user: ${pb.authStore.model?.name}`)

    // Test 4: Logout
    console.log('\n4️⃣  Testing logout...')
    pb.authStore.clear()
    console.log(`   ✅ Logged out successfully`)
    console.log(`   ✅ Is authenticated: ${pb.authStore.isValid}`)

    // Clean up
    console.log('\n5️⃣  Cleaning up...')
    // Need to re-authenticate to delete the user
    await pb.collection('users').authWithPassword(testEmail, testPassword)
    await pb.collection('users').delete(createdUserId!)
    console.log('   ✅ User cleanup successful')

    console.log('\n✅ All authentication tests passed!')
  } catch (error) {
    console.error('\n❌ Auth test failed:', error)

    // Attempt cleanup even if test failed
    if (createdUserId) {
      try {
        await pb.collection('users').delete(createdUserId)
        console.log('   ✅ Cleanup successful')
      } catch (cleanupError) {
        console.error('   ⚠️  Cleanup failed:', cleanupError)
      }
    }

    process.exit(1)
  }
}

testAuth()
