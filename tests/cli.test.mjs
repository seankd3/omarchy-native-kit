import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

const cli = ['dist/cli.js'];
const fixture = 'tests/fixtures/colors.basic.toml';

test('theme json prints stable token payload', () => {
  const output = execFileSync(process.execPath, [...cli, 'theme', 'json', '--colors', fixture], {
    encoding: 'utf8'
  });
  const payload = JSON.parse(output);

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.tokens.background, '#101216');
});

test('theme css writes output file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-cli-'));
  try {
    const out = join(dir, 'omarchy.css');
    execFileSync(process.execPath, [...cli, 'theme', 'css', '--colors', fixture, '--out', out]);

    assert.match(readFileSync(out, 'utf8'), /--omarchy-accent: #7aa2f7;/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('create generates react-vite app', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-create-'));
  try {
    const target = join(dir, 'hello');
    execFileSync(process.execPath, [...cli, 'create', target, '--template', 'react-vite', '--colors', fixture], {
      encoding: 'utf8'
    });

    assert.match(readFileSync(join(target, 'package.json'), 'utf8'), /"name": "hello"/);
    assert.match(readFileSync(join(target, 'src/omarchy-theme.css'), 'utf8'), /--omarchy-background/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
