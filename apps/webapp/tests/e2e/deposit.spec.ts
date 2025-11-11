import { test, expect } from '@playwright/test';

test.describe('Deposit & Mint Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('@smoke Connect wallet and navigate', async ({ page }) => {
    // Check homepage loads
    await expect(page).toHaveTitle(/Wexel/);

    // Navigate to pools
    await page.click('text=Пулы');
    await expect(page).toHaveURL(/\/pools/);

    // Check pools are displayed
    const poolCards = page.locator('[data-testid="pool-card"]');
    await expect(poolCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('View pool details', async ({ page }) => {
    await page.goto('/pools');

    // Wait for pools to load
    await page.waitForSelector('[data-testid="pool-card"]', { timeout: 10000 });

    // Click first pool
    const firstPool = page.locator('[data-testid="pool-card"]').first();
    await firstPool.click();

    // Verify pool details are visible
    await expect(page.locator('text=APY')).toBeVisible();
    await expect(page.locator('text=Срок')).toBeVisible();
  });

  test('Navigate to marketplace', async ({ page }) => {
    await page.goto('/marketplace');

    // Check marketplace loads
    await expect(page.locator('h1')).toContainText(/Маркетплейс|Marketplace/);

    // Check filters are present
    await expect(page.locator('[data-testid="filter-panel"]')).toBeVisible({ timeout: 5000 });
  });

  test('Admin login page accessible', async ({ page }) => {
    await page.goto('/admin/login');

    // Check login form
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Wallet page loads', async ({ page }) => {
    await page.goto('/wallet');

    // Check wallet connect options
    await expect(page.locator('text=Подключить')).toBeVisible({ timeout: 5000 });
  });

  test('Dashboard redirects without wallet', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to home or show connect prompt
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url === '/' || url.includes('/wallet')).toBeTruthy();
  });

  test('@smoke Navigation menu works', async ({ page }) => {
    await page.goto('/');

    // Test main navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check navigation links
    await expect(page.locator('a[href="/pools"]')).toBeVisible();
    await expect(page.locator('a[href="/marketplace"]')).toBeVisible();
  });

  test('Responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile menu button
    const mobileMenu = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    }
  });

  test('Footer links present', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('Oracle prices page', async ({ page }) => {
    await page.goto('/oracles');

    // Check page loads
    await expect(page.locator('h1')).toContainText(/Oracle|Оракулы/);
  });
});
