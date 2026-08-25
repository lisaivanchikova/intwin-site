#!/usr/bin/env node
/**
 * Intwin Partners — static site build.
 *
 *   node build.js
 *
 * Reads src/layout.html and every src/pages/*.html, and writes plain HTML
 * files to the repo root so GitHub Pages can serve them with no toolchain.
 *
 * Each page starts with a meta block:
 *
 *   <!--meta
 *   title: Page title
 *   desc: Meta description
 *   active: ai | partners | about
 *   -->
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PAGES = path.join(SRC, 'pages');

const layout = fs.readFileSync(path.join(SRC, 'layout.html'), 'utf8');
const year = 2026;

function parseMeta(raw) {
  const m = raw.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i === -1) return;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim();
    if (key) meta[key] = val;
  });
  return { meta, body: raw.slice(m[0].length) };
}

const files = fs.readdirSync(PAGES).filter((f) => f.endsWith('.html')).sort();
let built = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(PAGES, file), 'utf8');
  const { meta, body } = parseMeta(raw);

  if (!meta.title || !meta.desc) {
    console.error(`  ! ${file} is missing title or desc — skipped`);
    continue;
  }

  const active = (meta.active || '').trim();
  const esc = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const out = layout
    .replaceAll('{{TITLE}}', esc(meta.title))
    .replaceAll('{{DESC}}', esc(meta.desc))
    .replace('{{BODY}}', body.trim())
    .replaceAll('{{YEAR}}', String(year))
    .replace('{{ACTIVE_AI}}', active === 'ai' ? ' class="active"' : '')
    .replace('{{ACTIVE_SERVICES}}', active === 'services' ? ' class="active"' : '')
    .replace('{{ACTIVE_SOLUTIONS}}', active === 'solutions' ? ' class="active"' : '')
    .replace('{{ACTIVE_PARTNERS}}', active === 'partners' ? ' class="active"' : '')
    .replace('{{ACTIVE_ABOUT}}', active === 'about' ? ' class="active"' : '');

  const leftovers = out.match(/\{\{[A-Z_]+\}\}/g);
  if (leftovers) {
    console.error(`  ! ${file} left placeholders unfilled: ${leftovers.join(', ')}`);
  }

  fs.writeFileSync(path.join(ROOT, file), out);
  console.log(`  ✓ ${file}`);
  built += 1;
}

console.log(`\nBuilt ${built} page${built === 1 ? '' : 's'}.`);
