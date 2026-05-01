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

test('agent json prints machine-readable design context', () => {
  const output = execFileSync(process.execPath, [...cli, 'agent', 'json', '--colors', fixture], {
    encoding: 'utf8'
  });
  const payload = JSON.parse(output);

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.kit, 'omarchy-native-kit');
  assert.ok(payload.cssVariables.some((item) => item.variable === '--omarchy-accent'));
});

test('agent prompt prints compact instructions for coding agents', () => {
  const output = execFileSync(process.execPath, [...cli, 'agent', 'prompt', '--colors', fixture], {
    encoding: 'utf8'
  });

  assert.match(output, /Design rules:/);
  assert.match(output, /--omarchy-accent: #7aa2f7/);
});

test('agent blueprint prints a structured app plan', () => {
  const output = execFileSync(
    process.execPath,
    [...cli, 'agent', 'blueprint', '--colors', fixture, '--app', 'Signal Desk', '--kind', 'studio'],
    { encoding: 'utf8' }
  );
  const payload = JSON.parse(output);

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.appName, 'Signal Desk');
  assert.equal(payload.kind, 'studio');
  assert.ok(payload.components.some((component) => component.name === 'ToolButton'));
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
