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
 *   active: ai | join | about
 *   layout: join            (optional — uses src/layout-join.html)
 *   -->
 *
 * Any element carrying data-todo="reason" is unfinished. The default build
 * drops it entirely and lists what it dropped, so a half-written block can
 * never reach the live site. `node build.js --draft` keeps those elements and
 * stamps a visible plaque on each, for review before the content lands.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PAGES = path.join(SRC, 'pages');

// Canonical origin. Every absolute URL in the built pages derives from this one
// line, so moving the site to another host is a one-value change.
const SITE = 'https://lisaivanchikova.github.io/intwin-site';

const DRAFT = process.argv.includes('--draft');
const year = 2026;
const layouts = new Map();

function readLayout(name) {
  const file = name ? `layout-${name}.html` : 'layout.html';
  if (!layouts.has(file)) {
    layouts.set(file, fs.readFileSync(path.join(SRC, file), 'utf8'));
  }
  return layouts.get(file);
}

/**
 * Finds the element that opens at `start` and returns the index just past its
 * closing tag, counting nested tags of the same name on the way.
 */
function elementEnd(html, start, tag) {
  const open = new RegExp(`<${tag}(?=[\\s>])`, 'gi');
  const close = new RegExp(`</${tag}\\s*>`, 'gi');
  let depth = 0;
  let i = start;
  while (i < html.length) {
    open.lastIndex = i;
    close.lastIndex = i;
    const o = open.exec(html);
    const c = close.exec(html);
    if (!c) return -1;
    if (o && o.index < c.index) {
      depth += 1;
      i = o.index + o[0].length;
    } else {
      depth -= 1;
      i = c.index + c[0].length;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Either stamps a plaque on every data-todo element (draft) or removes them
 * outright (release). Returns the reasons found either way, so the build log
 * always shows what is still outstanding.
 */
function handleTodos(html) {
  const reasons = [];
  const marker = /<([a-z][a-z0-9]*)\b[^>]*\bdata-todo="([^"]*)"[^>]*>/i;
  let out = html;
  let guard = 0;
  for (;;) {
    const m = marker.exec(out);
    if (!m || guard++ > 200) break;
    const tag = m[1];
    const reason = m[2];
    reasons.push(reason);
    const end = elementEnd(out, m.index, tag);
    if (end === -1) {
      console.error(`  ! unclosed <${tag}> around a data-todo — left as is`);
      break;
    }
    if (DRAFT) {
      const openEnd = m.index + m[0].length;
      const plaque = `<p class="todo"><b>Before launch:</b> ${reason}</p>`;
      out = out.slice(0, openEnd) + plaque +
            out.slice(openEnd, end).replace(/\bdata-todo="/, 'data-todo-seen="') +
            out.slice(end);
    } else {
      out = out.slice(0, m.index) + out.slice(end);
    }
  }
  return { html: out, reasons };
}

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

const outstanding = [];
const urls = [];
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
  const layout = readLayout((meta.layout || '').trim());
  const todo = handleTodos(body);
  const esc = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const canon = file === 'index.html' ? SITE + '/' : SITE + '/' + file;
  urls.push(canon);
  const out = layout
    .replaceAll('{{SITE}}', SITE)
    .replaceAll('{{CANON}}', canon)
    .replaceAll('{{TITLE}}', esc(meta.title))
    .replaceAll('{{DESC}}', esc(meta.desc))
    .replace('{{BODY}}', todo.html.trim())
    .replaceAll('{{YEAR}}', String(year))
    .replace('{{ACTIVE_AI}}', active === 'ai' ? ' class="active"' : '')
    .replace('{{ACTIVE_SERVICES}}', active === 'services' ? ' class="active"' : '')
    .replace('{{ACTIVE_SOLUTIONS}}', active === 'solutions' ? ' class="active"' : '')
    .replace('{{ACTIVE_JOIN}}', active === 'join' ? ' class="active"' : '')
    .replace('{{ACTIVE_ABOUT}}', active === 'about' ? ' class="active"' : '');

  const leftovers = out.match(/\{\{[A-Z_]+\}\}/g);
  if (leftovers) {
    console.error(`  ! ${file} left placeholders unfilled: ${leftovers.join(', ')}`);
  }

  fs.writeFileSync(path.join(ROOT, file), out);
  console.log(`  ✓ ${file}`);
  todo.reasons.forEach((r) => {
    outstanding.push(`${file}: ${r}`);
  });
  built += 1;
}

// Sitemap, regenerated on every build so it can never drift from the pages.
const today = new Date().toISOString().slice(0, 10);
const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
  .concat(urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`))
  .concat(['</urlset>', '']).join('\n');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log('  \u2713 sitemap.xml');

console.log(`\nBuilt ${built} page${built === 1 ? '' : 's'}${DRAFT ? ' (draft)' : ''}.`);
if (outstanding.length) {
  console.log(DRAFT
    ? `\n${outstanding.length} block(s) marked unfinished, plaqued for review:`
    : `\n${outstanding.length} block(s) still unfinished and left out of the build:`);
  outstanding.forEach((r) => console.log(`  · ${r}`));
}
