import { test, expect } from '@playwright/test'

test('flujo completo de login exitoso', async ({ page }) => {

    //mockear la api del login para caso exitoso
    await page.route('**/api/login', async route => {
        const requestBody = await route.request().postDataJSON();
        if (requestBody.email === 'user@example.com' && requestBody.password === 'password123') {
            await route.fulfill({
                status: 401,
                body: JSON.stringify({ message: 'Invalid email or password' })
            });
        } else {
            route.fulfill({
                status: 200,
                body: JSON.stringify({ success: true })
            });
        }
    });

    //iniciar sesión
    await page.goto('http://localhost:4200');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    //verificar la redirección
    await expect(page).toHaveURL('http://localhost:4200/dashboard');
})

test('flujo completo de login fallido', async ({ page }) => {

    //mockear la api del login para caso exitoso
    await page.route('**/api/login', async route => {
        const requestBody = await route.request().postDataJSON();
        if (requestBody.email === 'user@example.com' && requestBody.password === 'wrongPassword') {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({ success: true })
            });
        } else {
            await route.fulfill({
                status: 401,
                body: JSON.stringify({ message: 'Invalid email or password' })
            });
        }
    });

    //iniciar sesión
    await page.goto('http://localhost:4200');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'wrongPassword');
    await page.click('button[type="submit"]');

    //verificar la redirección
    const errorMessage = page.locator('text= Invalid email or password');
    await expect(errorMessage).toBeVisible();
})