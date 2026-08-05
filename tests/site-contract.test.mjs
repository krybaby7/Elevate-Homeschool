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
