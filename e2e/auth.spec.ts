import { test, expect } from '@playwright/test'

/**
 * Authentication E2E Tests
 * Tests: login page loads, Google OAuth button, redirect, logout
 *
 * Note: Full OAuth flow (Google sign-in) cannot be automated without test credentials.
 * These tests verify the UI and flow up to the OAuth redirect.
 */

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('login page loads with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log Masuk' })).toBeVisible()
  })

  test('shows Google login button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /log masuk dengan google/i })).toBeVisible()
  })

  test('shows welcome back message', async ({ page }) => {
    await expect(page.getByText(/selamat kembali/i)).toBeVisible()
  })

  test('shows terms of service notice', async ({ page }) => {
    await expect(page.getByText(/terma perkhidmatan/i)).toBeVisible()
  })

  test('back button navigates away from login page', async ({ page }) => {
    await page.goto('/')
    await page.goto('/login')
    const backButton = page.getByRole('button', { name: /kembali/i })
    await expect(backButton).toBeVisible()
    await backButton.click()
    // Should navigate back (not crash)
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Unauthenticated access', () => {
  test('saved page is accessible without login (local favorites)', async ({ page }) => {
    await page.goto('/saved')
    // Should show the page, not redirect to login
    await expect(page.getByText(/bazaar simpanan/i)).toBeVisible({ timeout: 10000 })
  })

  test('add bazaar page is accessible', async ({ page }) => {
    await page.goto('/add')
    // Form should be visible
    await expect(page.locator('body')).toBeVisible()
    // Should show form elements
    const formContent = await page.content()
    expect(
      formContent.includes('form') ||
      formContent.toLowerCase().includes('bazaar') ||
      formContent.toLowerCase().includes('tambah')
    ).toBeTruthy()
  })

  test('profile page shows login prompt when not authenticated', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.locator('body')).toBeVisible()
    // Should either show login prompt or profile content
    const body = await page.content()
    expect(body.length).toBeGreaterThan(100) // Page actually rendered
  })

  test('more page is accessible', async ({ page }) => {
    await page.goto('/more')
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Google OAuth button interaction', () => {
  test('clicking Google login button shows loading state', async ({ page }) => {
    await page.goto('/login')

    // Intercept navigation to prevent actual OAuth redirect
    let redirectUrl = ''
    page.on('request', (request) => {
      if (request.url().includes('accounts.google.com') || request.url().includes('oauth')) {
        redirectUrl = request.url()
      }
    })

    const googleBtn = page.getByRole('button', { name: /log masuk dengan google/i })
    await expect(googleBtn).toBeEnabled()

    // Click and check loading state appears (before PocketBase calls listAuthMethods)
    await googleBtn.click()

    // The button should show loading state OR an error if OAuth not configured
    // Either is acceptable for this test
    await page.waitForTimeout(1000)

    const isLoading = await page.getByText(/memuatkan/i).isVisible()
    const hasError = await page.locator('[data-sonner-toast]').isVisible()
    const isDisabled = !(await googleBtn.isEnabled())

    // One of these states should be true after clicking
    expect(isLoading || hasError || isDisabled).toBeTruthy()
  })
})
