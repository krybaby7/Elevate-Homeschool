import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage content model and CMS use the real data directory', async () => {
  const [homepage, cms] = await Promise.all([
    read('data/homepage.yml'),
    read('admin/config.yml'),
  ]);

  assert.match(homepage, /heading: "A high school built around your child\."/);
  assert.match(homepage, /We help every student work toward a strong GPA\./);
  assert.match(homepage, /primary_cta: "Book a private visit"/);
  assert.match(cms, /file: "data\/homepage\.yml"/);
  assert.doesNotMatch(cms, /file: "_data\//);
});

test('extra tuition routes redirect before the catch-all', async () => {
  const config = await read('netlify.toml');
  const shortRoute = config.indexOf('from = "/extra-tuition"');
  const htmlRoute = config.indexOf('from = "/extra-tuition.html"');
  const catchAll = config.indexOf('from = "/*"');

  assert.ok(shortRoute >= 0);
  assert.ok(htmlRoute >= 0);
  assert.ok(shortRoute < catchAll);
  assert.ok(htmlRoute < catchAll);
  assert.match(config, /status = 302[\s\S]*force = true/);
});

test('homepage exposes the approved concise structure and no extra tuition link', async () => {
  const html = await read('index.html');
  for (const id of ['hero', 'why-elevate', 'how-it-works', 'visit']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /A high school built around <span>your child\.<\/span>/);
  assert.match(html, /We help every student work toward a strong GPA\./);
  assert.match(html, /href="https:\/\/portal\.elevate-sharm\.com\/login"/);
  assert.match(html, /assets\/images\/Elevate%20Logo\.png/);
  assert.doesNotMatch(html, /href="(?:\.\/)?extra-tuition\.html"/);
  assert.doesNotMatch(html, /Tap the bubbles to learn more/i);
  assert.doesNotMatch(html, /85,000|1,715|September 2025|HarvardX/);
});

test('private visit form is statically detectable by Netlify', async () => {
  const html = await read('index.html');
  assert.match(html, /<form[^>]+name="campus-visit"[^>]+data-netlify="true"/);
  assert.match(html, /name="form-name" value="campus-visit"/);
  for (const name of ['parent-name', 'contact', 'student-grade', 'tuition-guide']) {
    assert.match(html, new RegExp(`name="${name}"`));
  }
});

test('bubble disclosures expose keyboard and assistive-technology hooks', async () => {
  const html = await read('index.html');
  assert.equal((html.match(/class="topic-bubble/g) || []).length, 4);
  assert.equal((html.match(/class="topic-bubble[^"]*"[^>]+aria-expanded="false"/g) || []).length, 4);
  assert.match(html, /id="topic-popover"[^>]+aria-hidden="true"/);
  assert.match(html, /aria-label="Close explanation"/);
});

test('homepage script includes disclosures, YAML fallback handling, and Netlify submission states', async () => {
  const script = await read('assets/js/main.js');
  assert.match(script, /createBubbleMotion/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(script, /event\.key === 'Escape'/);
  assert.match(script, /fetch\('data\/homepage\.yml'/);
  assert.match(script, /new URLSearchParams\(new FormData\(form\)\)/);
  assert.match(script, /We could not send your request/);
});

test('styles include the approved palette, motion composition, mobile layout, and reduced motion', async () => {
  const css = await read('assets/css/style.css');
  for (const token of ['--navy: #122a55', '--blue: #2f68df', '--coral: #ffb79b', '--aqua: #82dfe9', '--gold: #f0cb6a']) {
    assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(css, /translate:\s*var\(--bubble-x\) var\(--bubble-y\)/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.topic-bubble:focus-visible/);
});

test('header reuses the original Elevate logo from the footer', async () => {
  const html = await read('index.html');
  const css = await read('assets/css/style.css');
  assert.match(html, /<a class="brand"[^>]*aria-label="Elevate home"[^>]*>\s*<img class="header-logo" src="assets\/images\/Elevate%20Logo\.png" alt="">\s*<\/a>/);
  assert.doesNotMatch(html, /class="brand-mark"/);
  assert.match(css, /\.brand\s*\{[^}]*background:var\(--navy\);/);
  assert.match(css, /\.header-logo\s*\{[^}]*width:clamp\(86px,9vw,104px\);[^}]*height:auto;/);
});

test('homepage presents the Bridgeway partnership accessibly', async () => {
  const html = await read('index.html');
  assert.match(html, /class="partner-strip"/);
  assert.match(html, /href="https:\/\/homeschoolacademy\.com\/"/);
  assert.match(html, /src="assets\/images\/bridgeway-academy\.svg"/);
  assert.match(html, /alt="Bridgeway Academy"/);
  assert.match(html, />Academic partner</);

  const logo = await read('assets/images/bridgeway-academy.svg');
  assert.match(logo, /<svg[^>]+viewBox="0 0 175 45"/);
});
