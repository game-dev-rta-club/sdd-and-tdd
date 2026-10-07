import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillRoot = resolve(root, 'skills/sdd-and-tdd');

test('the skill is standalone and uses the portable Agent Skills format', async () => {
  assert.deepEqual(await readdir(resolve(root, 'skills')), ['sdd-and-tdd']);
  assert.deepEqual((await readdir(skillRoot)).sort(), ['SKILL.md', 'agents']);
  const text = await readFile(resolve(skillRoot, 'SKILL.md'), 'utf8');
  const header = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(header, 'skill needs YAML frontmatter');
  assert.match(header[1], /^name: sdd-and-tdd$/m);
  assert.match(header[1], /^description: .+$/m);
  assert.match(header[1], /^license: MIT$/m);
  assert.doesNotMatch(text, /\/Users\/|current-project-knowledge|SuperHookGirl|Docs\/Specification|\.\/\.\.\//);
  for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const target = match[1];
    if (/^[a-z][a-z\d+.-]*:|^#/i.test(target)) continue;
    const within = relative(skillRoot, resolve(skillRoot, target.split('#')[0]));
    assert.ok(!within.startsWith('..') && !isAbsolute(within), `skill needs a sibling dependency: ${target}`);
  }
});

test('Codex metadata names the same skill and preserves automatic discovery', async () => {
  const text = await readFile(resolve(skillRoot, 'agents/openai.yaml'), 'utf8');
  const description = text.match(/short_description: "([^"\n]+)"/)[1];
  assert.ok(description.length >= 25 && description.length <= 64);
  assert.match(text, /default_prompt: "[^"\n]*\$sdd-and-tdd[^"\n]*"/);
  assert.match(text, /allow_implicit_invocation: true/);
});

test('release metadata is consistent and no runtime dependency is required', async () => {
  const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(manifest.license, 'MIT');
  assert.equal(manifest.private, true);
  assert.equal(manifest.bin, undefined);
  assert.equal(manifest.dependencies, undefined);
  const changelog = await readFile(resolve(root, 'CHANGELOG.md'), 'utf8');
  assert.ok(changelog.includes(`## ${manifest.version} —`));
});

test('relative documentation links and HTML images resolve within the repository', async () => {
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const filename = resolve(directory, entry.name);
      if (entry.isDirectory()) { await visit(filename); continue; }
      if (!entry.name.endsWith('.md')) continue;
      const text = await readFile(filename, 'utf8');
      const links = [
        ...text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g),
        ...text.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g),
      ];
      for (const match of links) {
        const target = match[1];
        if (/^[a-z][a-z\d+.-]*:|^#/i.test(target)) continue;
        const linked = resolve(dirname(filename), decodeURIComponent(target.split('#')[0]));
        const within = relative(root, linked);
        assert.ok(!within.startsWith('..') && !isAbsolute(within), `link escapes repository: ${target}`);
        assert.ok((await stat(linked)).isFile(), `missing linked file: ${target}`);
      }
    }
  }
  await visit(root);
});
