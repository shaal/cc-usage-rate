import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Tooltip Feature Verification Tests
 *
 * These tests verify that the enhanced hover tooltips work correctly
 * on the circular indicators, displaying rich content including:
 * - Explanation of what the percentage means
 * - Context on efficiency status
 * - Guidance on pacing
 */

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Tooltip Explanations Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test page
    const testPagePath = path.join(__dirname, 'tooltip-test.html');
    await page.goto(`file://${testPagePath}`);

    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500); // Allow scripts to initialize
  });

  test('should display tooltip on hover over green (under usage) indicator', async ({ page }) => {
    // Get the green indicator
    const greenIndicator = page.locator('#indicator-green');
    await expect(greenIndicator).toBeVisible();

    // Hover over the indicator
    await greenIndicator.hover();

    // Wait for tooltip to appear
    await page.waitForTimeout(200);

    // Check that tooltip is visible
    const tooltip = page.locator('.claude-usage-tooltip--visible');
    await expect(tooltip).toBeVisible();

    // Verify tooltip content
    await expect(tooltip.locator('.claude-usage-tooltip__title')).toContainText('Session Efficiency');
    await expect(tooltip.locator('.claude-usage-tooltip__section-title').first()).toContainText('What does this mean?');
    await expect(tooltip.locator('.claude-usage-tooltip__status--under')).toBeVisible();
    await expect(tooltip.locator('.claude-usage-tooltip__guidance')).toContainText('room to use Claude more');
  });

  test('should display tooltip on hover over yellow (on-track) indicator', async ({ page }) => {
    // Get the yellow indicator
    const yellowIndicator = page.locator('#indicator-yellow');
    await expect(yellowIndicator).toBeVisible();

    // Hover over the indicator
    await yellowIndicator.hover();

    // Wait for tooltip to appear
    await page.waitForTimeout(200);

    // Check that tooltip is visible
    const tooltip = page.locator('.claude-usage-tooltip--visible');
    await expect(tooltip).toBeVisible();

    // Verify tooltip content
    await expect(tooltip.locator('.claude-usage-tooltip__title')).toContainText('Session Efficiency');
    await expect(tooltip.locator('.claude-usage-tooltip__status--on-track')).toBeVisible();
    await expect(tooltip.locator('.claude-usage-tooltip__guidance')).toContainText('well-balanced');
  });

  test('should display tooltip on hover over red (over usage) indicator', async ({ page }) => {
    // Get the red indicator
    const redIndicator = page.locator('#indicator-red');
    await expect(redIndicator).toBeVisible();

    // Hover over the indicator
    await redIndicator.hover();

    // Wait for tooltip to appear
    await page.waitForTimeout(200);

    // Check that tooltip is visible
    const tooltip = page.locator('.claude-usage-tooltip--visible');
    await expect(tooltip).toBeVisible();

    // Verify tooltip content - should show weekly efficiency info
    await expect(tooltip.locator('.claude-usage-tooltip__title')).toContainText('Weekly Efficiency');
    await expect(tooltip.locator('.claude-usage-tooltip__status--over')).toBeVisible();
    await expect(tooltip.locator('.claude-usage-tooltip__guidance')).toContainText('Consider spreading usage');

    // Should include time until reset for weekly
    await expect(tooltip).toContainText('Time until reset');
  });

  test('should hide tooltip when mouse leaves indicator', async ({ page }) => {
    // Hover over indicator to show tooltip
    const greenIndicator = page.locator('#indicator-green');
    await greenIndicator.hover();
    await page.waitForTimeout(200);

    // Verify tooltip is visible
    const tooltip = page.locator('.claude-usage-tooltip--visible');
    await expect(tooltip).toBeVisible();

    // Move mouse away from indicator
    await page.mouse.move(0, 0);

    // Wait for tooltip hide animation
    await page.waitForTimeout(400);

    // Verify tooltip is no longer visible
    await expect(page.locator('.claude-usage-tooltip--visible')).not.toBeVisible();
  });

  test('tooltip should contain required sections', async ({ page }) => {
    const greenIndicator = page.locator('#indicator-green');
    await greenIndicator.hover();
    await page.waitForTimeout(200);

    const tooltip = page.locator('.claude-usage-tooltip--visible');

    // Should have title
    await expect(tooltip.locator('.claude-usage-tooltip__title')).toBeVisible();

    // Should have at least two sections (What does this mean? and Current Status)
    const sections = tooltip.locator('.claude-usage-tooltip__section');
    await expect(sections).toHaveCount(2);

    // Should have status badge
    await expect(tooltip.locator('.claude-usage-tooltip__status')).toBeVisible();

    // Should have guidance
    await expect(tooltip.locator('.claude-usage-tooltip__guidance')).toBeVisible();
  });

  test('tooltip should show current status with actual, expected, and difference values', async ({ page }) => {
    const greenIndicator = page.locator('#indicator-green');
    await greenIndicator.hover();
    await page.waitForTimeout(200);

    const tooltip = page.locator('.claude-usage-tooltip--visible');

    // Should contain actual usage
    await expect(tooltip).toContainText('Actual usage:');

    // Should contain expected usage
    await expect(tooltip).toContainText('Expected usage:');

    // Should contain difference
    await expect(tooltip).toContainText('Difference:');
  });

  test('indicator should be focusable for keyboard accessibility', async ({ page }) => {
    const greenIndicator = page.locator('#indicator-green');

    // Check that indicator has tabindex for keyboard navigation
    await expect(greenIndicator).toHaveAttribute('tabindex', '0');

    // Focus the indicator
    await greenIndicator.focus();

    // Should be focused
    await expect(greenIndicator).toBeFocused();
  });

  test('all three indicator colors should be present', async ({ page }) => {
    // Verify all three color variants are present
    await expect(page.locator('[data-color="green"]')).toBeVisible();
    await expect(page.locator('[data-color="yellow"]')).toBeVisible();
    await expect(page.locator('[data-color="red"]')).toBeVisible();
  });
});
