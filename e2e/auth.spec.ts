import { test, expect } from '@playwright/test'

test('redirects unauthenticated user from dashboard to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('signup form renders and links to login', async ({ page }) => {
  await page.goto('/signup')
  await expect(page.locator('h1')).toHaveText('Create your account')
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
  await expect(page.getByRole('main').locator('a[href="/login"]')).toBeVisible()
})

test('login form renders and links to signup', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('h1')).toHaveText('Log in')
  await expect(page.locator('a[href="/signup"]')).toBeVisible()
})
