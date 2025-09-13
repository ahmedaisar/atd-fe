import { test, expect } from '@playwright/test'

// Simple smoke test to verify the app boots and renders the home header

test('homepage renders header and navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('link', { name: /agoda/i })).toBeVisible()

  // On mobile, the nav is hidden behind the hamburger menu; open it if present.
  const toggle = page.getByRole('button', { name: /toggle menu/i })
  if (await toggle.isVisible()) {
    await toggle.click()
  }

  await expect(page.getByRole('link', { name: /^Hotels$/i })).toBeVisible()
})
