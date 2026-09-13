import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
    ['/', /Bangyen Pham/],
    ['/lights-out', /Lights Out/],
    ['/slant', /Slant/],
    ['/zsharp', /ZSharp/],
    ['/oligopoly', /Oligopoly/],
] as const;

for (const [route, title] of routes) {
    test(`${route} loads with metadata`, async ({ page }) => {
        await page.goto(route);
        await expect(page).toHaveTitle(title);
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
            'content',
            /.+/,
        );
    });
}

test('home has no automatically detectable accessibility violations', async ({
    page,
}) => {
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
});

test('theme selection survives a reload', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /switch to .* mode/i });
    await toggle.click();
    const selectedTheme = await page.locator('html').getAttribute('data-theme');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        selectedTheme ?? 'light',
    );
});

test('lights out supports keyboard interaction', async ({ page }) => {
    await page.goto('/lights-out');
    const firstCell = page.locator('[data-pos="0,0"]');
    await firstCell.focus();
    await page.keyboard.press('Enter');
    await expect(firstCell).toBeFocused();
});
