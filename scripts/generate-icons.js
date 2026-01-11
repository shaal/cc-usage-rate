#!/usr/bin/env node
/**
 * Icon Generator Script
 * Converts SVG icons to PNG format for Chrome extension
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ICON_SIZES = [16, 32, 48, 128];
const ICONS_DIR = join(__dirname, '..', 'public', 'icons');

async function convertSvgToPng(size) {
  const svgPath = join(ICONS_DIR, `icon${size}.svg`);
  const pngPath = join(ICONS_DIR, `icon${size}.png`);

  if (!existsSync(svgPath)) {
    console.error(`SVG file not found: ${svgPath}`);
    return false;
  }

  try {
    const svgBuffer = readFileSync(svgPath);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    console.log(`Created: icon${size}.png`);
    return true;
  } catch (error) {
    console.error(`Error converting icon${size}.svg:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Converting SVG icons to PNG...\n');

  for (const size of ICON_SIZES) {
    await convertSvgToPng(size);
  }

  console.log('\nIcon generation complete!');
}

main().catch(console.error);
