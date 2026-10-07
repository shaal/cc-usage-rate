import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import vm from 'node:vm';
import { isUsagePageUrl } from '../src/utils/usagePage';
import { parseSessionTimer, parseWeeklyResetTime } from '../src/utils/usageDataExtractor';

// Representative markup using labels and reset formats observed on Claude on
// 2026-10-07. All usage values are synthetic; no account data is captured here.
const usageRows = (legacy = false) => `
  <section id="session-row">
    <div><p>Current session</p><p id="session-reset">${legacy ? 'Resets in 1 hr' : 'Resets at 2:00 PM'}</p></div>
    <div><p id="session-usage">59% used</p></div>
    <div role="progressbar" aria-label="Current session" aria-valuenow="59"></div>
  </section>
  <section id="weekly-row">
    <div><p>${legacy ? 'All models' : 'This week'}</p><p>Resets ${legacy ? 'Wed' : 'Wednesday'} 9:00 AM</p></div>
    <div><p id="weekly-usage">7% used</p></div>
    <div role="progressbar" aria-label="This week" aria-valuenow="7"></div>
  </section>
  <section id="fable-row">
    <p>Fable this week</p><p>Separate weekly limit for Fable · Resets Wednesday 9:00 AM</p><p>0% used</p>
  </section>
  <section><h3>This week’s usage by product</h3><p>Claude Code</p><p>100%</p><p>Chats</p><p>0%</p></section>`;

const usagePanel = (legacy = false) => `
  <div role="dialog" aria-label="Settings" id="usage-panel" class="flex flex-row">
    <nav>Settings <button>Usage</button></nav>
    <div><h2>Your usage</h2><p>Fresh week. 7% of your weekly limit used.</p>${usageRows(legacy)}</div>
  </div>`;

const sessionIndicator = '#session-row [data-indicator-type="session"] .claude-usage-circular-indicator';
const weeklyIndicator = '#weekly-row [data-indicator-type="weekly"] .claude-usage-circular-indicator';

test.describe('Usage URL and reset parsing', () => {
  test('accepts legacy and hash routes and rejects unrelated pages', () => {
    for (const href of [
      'https://claude.ai/settings/usage',
      'https://claude.ai/settings/usage/?foo=bar',
      'https://claude.ai/new#settings/usage',
      'https://claude.ai/chat/example#settings/usage',
      'https://claude.ai/new#/settings/usage',
    ]) expect(isUsagePageUrl(href), href).toBe(true);

    for (const href of [
      'https://claude.ai/new',
      'https://claude.ai/new#settings/billing',
      'https://claude.ai/settings/usage-history',
      'https://example.com/claude.ai/settings/usage',
      'https://claude.ai.example.com/new#settings/usage',
      'not a URL',
    ]) expect(isUsagePageUrl(href), href).toBe(false);
  });

  test('converts session clock resets, including midnight, noon, and 24-hour time', () => {
    const cases: [string, Date, number][] = [
      ['Resets at 2:00 PM', new Date(2026, 9, 7, 13, 0), 60],
      ['Resets at 2:00 AM', new Date(2026, 9, 7, 23, 0), 180],
      ['Resets at 12:00 AM', new Date(2026, 9, 7, 23, 30), 30],
      ['Resets at 12:00 PM', new Date(2026, 9, 7, 11, 30), 30],
      ['Resets at 14:00', new Date(2026, 9, 7, 13, 0), 60],
      ['Resets at 2:00 PM', new Date(2026, 9, 7, 14, 0), 0],
      ['Resets in 1 hr 44 min', new Date(2026, 9, 7, 13, 0), 104],
    ];
    for (const [text, now, remainingMinutes] of cases) {
      expect(parseSessionTimer(text, undefined, now)).toMatchObject({ isValid: true, remainingMinutes });
    }
    expect(parseSessionTimer('Resets at 25:00', undefined, new Date(2026, 9, 7, 13, 0))?.isValid).toBe(false);
    expect(parseSessionTimer('Resets at 12:00 PM', undefined, new Date(2026, 9, 7, 13, 0))?.isValid).toBe(false);
  });

  test('retains relative weekly resets and accepts full weekday names', () => {
    expect(parseWeeklyResetTime('Resets Wednesday 9:00 AM')).toMatchObject({
      isValid: true, resetDay: 'Wednesday', resetHour: 9, resetMinute: 0,
    });
    expect(parseWeeklyResetTime('Resets in 7 hr 31 min')).toMatchObject({
      isValid: true, remainingMinutes: 451,
    });
  });

  test('ships a classic content script on every Claude route', async () => {
    const manifest = JSON.parse(await readFile(resolve('dist/manifest.json'), 'utf8'));
    expect(manifest.content_scripts[0].matches).toEqual(['https://claude.ai/*']);
    const script = await readFile(resolve('dist/content.js'), 'utf8');
    expect(() => new vm.Script(script)).not.toThrow();
  });
});

test.describe('Built extension on usage settings', () => {
  let context: BrowserContext;
  let profileDirectory: string;
  let page: Page;

  test.beforeEach(async () => {
    profileDirectory = await mkdtemp(join(tmpdir(), 'cc-usage-rate-test-'));
    const extensionPath = resolve('dist');
    context = await chromium.launchPersistentContext(profileDirectory, {
      channel: 'chromium',
      headless: true,
      timezoneId: 'America/New_York',
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });
    page = await context.newPage();
    await context.route('https://claude.ai/**', route => route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><head><title>Usage fixture</title></head><body><main id="app">New chat</main></body></html>',
    }));
  });

  test.afterEach(async () => {
    await context?.close();
    await rm(profileDirectory, { recursive: true, force: true });
  });

  async function mountPanel(legacy = false): Promise<void> {
    // A page-world fake clock does not affect extension content scripts in
    // Chrome's isolated world. Use a real clock reset one hour from now.
    const resetTime = await page.evaluate(() => new Date(Date.now() + 3600000)
      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    const html = usagePanel(legacy).replace('Resets at 2:00 PM', `Resets at ${resetTime}`);
    await page.locator('#app').evaluate((app, markup) => { app.innerHTML = markup; }, html);
  }

  async function expectCorrectIndicators(): Promise<void> {
    await expect(page.locator(sessionIndicator)).toBeVisible();
    await expect(page.locator(weeklyIndicator)).toBeVisible();
    await expect(page.locator(sessionIndicator)).toHaveAttribute('data-percentage', '-21');
    const expectedWeeklyDelta = await page.evaluate(() => {
      const now = new Date();
      const start = new Date(now);
      start.setHours(9, 0, 0, 0);
      start.setDate(start.getDate() - ((start.getDay() + 4) % 7));
      if (start > now) start.setDate(start.getDate() - 7);
      return 7 - (now.getTime() - start.getTime()) / (7 * 24 * 3600000) * 100;
    });
    await expect.poll(async () => Number(await page.locator(weeklyIndicator).getAttribute('data-percentage')))
      .toBeCloseTo(expectedWeeklyDelta, 1);
    await expect(page.locator('[data-indicator-type]')).toHaveCount(2);
    await expect(page.locator('#session-row [data-indicator-type="weekly"]')).toHaveCount(0);
    await expect(page.locator('#fable-row [data-indicator-type]')).toHaveCount(0);
  }

  test('initializes on the new URL and uses the correct rows despite the settings shell', async () => {
    await page.goto('https://claude.ai/new#settings/usage');
    await mountPanel();
    await expectCorrectIndicators();
    await page.locator(sessionIndicator).hover();
    await expect(page.locator('.claude-usage-tooltip--visible')).toContainText('Session Efficiency');
  });

  test('keeps legacy standalone usage settings working', async () => {
    await page.goto('https://claude.ai/settings/usage');
    await mountPanel(true);
    await expectCorrectIndicators();
  });

  test('follows opening, closing, and reopening Usage within a chat without duplicate gauges', async () => {
    await page.goto('https://claude.ai/chat/example');
    await mountPanel();
    await expect(page.locator('[data-indicator-type]')).toHaveCount(0);
    await page.evaluate(() => { location.hash = 'settings/usage'; });
    await expectCorrectIndicators();
    await page.evaluate(() => { location.hash = 'settings/billing'; });
    await expect(page.locator('[data-indicator-type]')).toHaveCount(0);
    await page.evaluate(() => { location.hash = 'settings/usage'; });
    await expectCorrectIndicators();
  });

  test('follows history API navigation even without a DOM commit', async () => {
    await page.goto('https://claude.ai/new');
    await mountPanel();
    await page.evaluate(() => { history.pushState({}, '', '#settings/usage'); });
    await expectCorrectIndicators();
    await page.evaluate(() => { history.replaceState({}, '', '#settings/general'); });
    await expect(page.locator('[data-indicator-type]')).toHaveCount(0);
  });

  test('cancels initialization when Usage closes before its data loads', async () => {
    await page.goto('https://claude.ai/new#settings/usage');
    await expect(page.locator('#claude-usage-tracker-styles')).toHaveCount(1);
    await page.evaluate(() => { location.hash = 'settings/billing'; });
    await expect(page.locator('#claude-usage-tracker-styles')).toHaveCount(0);
    await mountPanel();
    await expect(page.locator('[data-indicator-type]')).toHaveCount(0);
    await page.evaluate(() => { location.hash = 'settings/usage'; });
    await expectCorrectIndicators();
  });

  test('restores indicators after React replaces the dialog and tracks percentage updates', async () => {
    await page.goto('https://claude.ai/new#settings/usage');
    await mountPanel();
    await expectCorrectIndicators();
    await mountPanel();
    await expectCorrectIndicators();
    await page.locator('#session-usage').evaluate(el => { el.firstChild!.nodeValue = '69% used'; });
    await expect(page.locator(sessionIndicator)).toHaveAttribute('data-percentage', '-11');
  });

  test('scopes detection to the visible dialog and supports fractional usage values', async () => {
    await page.goto('https://claude.ai/new#settings/usage');
    await mountPanel();
    await page.locator('#app').evaluate(app => {
      app.insertAdjacentHTML('afterbegin', '<div hidden><p>Current session</p><p>Resets in 4 hr</p><p>99% used</p><p>All models</p><p>Resets Thu 9:00 AM</p><p>98% used</p></div>');
    });
    await expectCorrectIndicators();
    await page.locator('#session-usage').evaluate(el => { el.firstChild!.nodeValue = '59.5 % used'; });
    await expect(page.locator(sessionIndicator)).toHaveAttribute('data-percentage', '-20.5');
  });

  test('never substitutes a model-specific limit for a missing main weekly row', async () => {
    await page.goto('https://claude.ai/new#settings/usage');
    await mountPanel();
    await page.locator('#weekly-row').evaluate(el => el.remove());
    await expect(page.locator(sessionIndicator)).toBeVisible();
    await expect(page.locator('[data-indicator-type="weekly"]')).toHaveCount(0);
  });
});
