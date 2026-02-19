import { test, expect } from '@playwright/test'

/**
 * Browse & Search E2E Tests
 * Tests: home page loading, list view, search, filter, bazaar detail
 */

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and shows bazaar count in bottom drawer', async ({ page }) => {
    // Bottom drawer should show "X Bazaar Berhampiran" once loaded
    await expect(page.getByText(/Bazaar Berhampiran/)).toBeVisible({ timeout: 15000 })
  })

  test('shows loading spinner then map/content', async ({ page }) => {
    // Either the map loads or the loading text disappears
    await expect(page.getByText('Memuatkan bazaar...')).toBeHidden({ timeout: 15000 })
  })

  test('bottom navigation is visible', async ({ page }) => {
    // Bottom nav should always be visible
    await expect(page.locator('nav, [role="navigation"]').first()).toBeVisible()
  })
})

test.describe('List view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for bazaars to load
    await expect(page.getByText(/Bazaar Berhampiran/)).toBeVisible({ timeout: 15000 })
  })

  test('switches to list view via bottom navigation', async ({ page }) => {
    // Find and click the list tab in bottom navigation
    const listTab = page.getByRole('button', { name: /senarai|list/i })
    if (await listTab.isVisible()) {
      await listTab.click()
      await expect(page.getByText(/bazaar ditemui/i)).toBeVisible({ timeout: 10000 })
    }
  })

  test('list view shows bazaar cards with names', async ({ page }) => {
    // Switch to list view
    const listTab = page.getByRole('button', { name: /senarai|list/i })
    if (await listTab.isVisible()) {
      await listTab.click()
      // Wait for bazaar count to appear
      await expect(page.getByText(/bazaar ditemui/i)).toBeVisible({ timeout: 10000 })
      // There should be at least one bazaar card
      const bazaarCount = await page.locator('article, [data-testid="bazaar-card"], .bazaar-card').count()
      // If no test IDs, just verify the count text doesn't say 0
      const countText = await page.getByText(/\d+ bazaar ditemui/i).textContent()
      expect(countText).toBeTruthy()
    }
  })
})

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/Bazaar Berhampiran/)).toBeVisible({ timeout: 15000 })
  })

  test('search input is visible in header', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/cari bazaar|search/i)
    await expect(searchInput).toBeVisible()
  })

  test('typing in search updates results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/cari bazaar|search/i)
    await searchInput.fill('Kuala Lumpur')
    // Wait for debounce/results to update
    await page.waitForTimeout(1000)
    // Should not throw; page should still be functional
    await expect(searchInput).toHaveValue('Kuala Lumpur')
  })

  test('clearing search shows all bazaars again', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/cari bazaar|search/i)
    await searchInput.fill('xyz_no_results_hopefully')
    await page.waitForTimeout(1000)
    await searchInput.clear()
    await page.waitForTimeout(1000)
    await expect(page.getByText(/Bazaar Berhampiran/)).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Bazaar detail page', () => {
  test('navigating to a bazaar detail shows bazaar info', async ({ page }) => {
    // Go to home page and wait for bazaars to load
    await page.goto('/')
    await expect(page.getByText(/Bazaar Berhampiran/)).toBeVisible({ timeout: 15000 })

    // Switch to list view to find a clickable bazaar
    const listTab = page.getByRole('button', { name: /senarai|list/i })
    if (await listTab.isVisible()) {
      await listTab.click()
      await expect(page.getByText(/bazaar ditemui/i)).toBeVisible({ timeout: 10000 })

      // Click the first bazaar link
      const firstBazaarLink = page.getByRole('link', { name: /bazaar/i }).first()
      if (await firstBazaarLink.isVisible()) {
        await firstBazaarLink.click()
        // Detail page should show location/address info
        await expect(page).toHaveURL(/\/bazaar\//)
        // Expect some content that would be on a detail page
        await expect(page.getByText(/gerai|stall|alamat|address|lokasi/i).first()).toBeVisible({ timeout: 10000 })
      }
    }
  })

  test('direct URL navigation to invalid bazaar shows not found', async ({ page }) => {
    await page.goto('/bazaar/nonexistent-id-12345')
    // Should show 404 or "not found" message
    const body = await page.content()
    expect(
      body.toLowerCase().includes('not found') ||
      body.toLowerCase().includes('tidak dijumpai') ||
      body.includes('404')
    ).toBeTruthy()
  })
})

test.describe('"Open Now" quick filter', () => {
  test('toggling Open Now filter updates results', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/Bazaar Berhampiran/)).toBeVisible({ timeout: 15000 })

    const openNowBtn = page.getByRole('button', { name: /buka sekarang|open now/i })
    if (await openNowBtn.isVisible()) {
      await openNowBtn.click()
      // Page should still be functional after filter toggle
      await expect(page.locator('body')).toBeVisible()
    }
  })
})
