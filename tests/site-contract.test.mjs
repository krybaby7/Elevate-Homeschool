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
