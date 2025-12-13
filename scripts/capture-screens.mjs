import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("docs/design/refs");
fs.mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function shot(page, name) {
    await page.waitForTimeout(500);
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("✓", name);
}

async function login(page) {
    await page.goto(`${BASE}/login/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
}

async function run() {
    const browser = await chromium.launch();

    // --- Desktop pass ---
    const desktopCtx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1 });
    const page = await desktopCtx.newPage();

    // 01 — login
    await login(page);
    await shot(page, "01_login_desktop");

    // submit via demo creds
    await page.click('button:has-text("Use demo account")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Sign in")');
    await page.waitForURL("**/dashboard/**", { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(600);

    // 02 — dashboard
    await shot(page, "02_dashboard_desktop");

    // 13a — meeting (3 participants is the seeded default)
    await page.goto(`${BASE}/meeting/?roomId=demo`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await shot(page, "13a_meeting_3p_desktop");

    // 13b — 5 participants
    await page.click('button[aria-label="Add participant"]');
    await page.waitForTimeout(350);
    await page.click('button[aria-label="Add participant"]');
    await page.waitForTimeout(900);
    await shot(page, "13b_meeting_5p_desktop");

    // 13c — 7 participants
    await page.click('button[aria-label="Add participant"]');
    await page.waitForTimeout(350);
    await page.click('button[aria-label="Add participant"]');
    await page.waitForTimeout(900);
    await shot(page, "13c_meeting_7p_desktop");

    // 13d — screen-share
    await page.click('button[aria-label="Toggle screen share"]');
    await page.waitForTimeout(900);
    await shot(page, "13d_meeting_screenshare_desktop");

    await desktopCtx.close();

    // --- Dark mode pass (dashboard) ---
    const darkCtx = await browser.newContext({
        viewport: DESKTOP,
        deviceScaleFactor: 1,
        colorScheme: "dark",
    });
    const dPage = await darkCtx.newPage();
    await dPage.goto(`${BASE}/login/`);
    await dPage.waitForLoadState("networkidle");
    await dPage.waitForTimeout(800);
    await dPage.click('button:has-text("Use demo account")');
    await dPage.waitForTimeout(300);
    await dPage.click('button:has-text("Sign in")');
    await dPage.waitForURL("**/dashboard/**", { timeout: 10000 });
    await dPage.waitForLoadState("networkidle");
    await dPage.waitForTimeout(600);
    await shot(dPage, "02_dashboard_desktop_dark");
    await darkCtx.close();

    // --- Mobile pass ---
    const mobileCtx = await browser.newContext({ viewport: MOBILE, deviceScaleFactor: 2, isMobile: true });
    const mPage = await mobileCtx.newPage();

    await mPage.goto(`${BASE}/login/`);
    await mPage.waitForLoadState("networkidle");
    await mPage.waitForTimeout(800);
    await shot(mPage, "01_login_mobile");

    await mobileCtx.close();
    await browser.close();
    console.log("\nAll screenshots saved to docs/design/refs/");
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
