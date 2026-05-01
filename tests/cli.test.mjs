import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, statSync, unlinkSync } from 'node:fs';
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

test('theme sync and watch once write output files', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-theme-sync-'));
  try {
    const syncOut = join(dir, 'sync.css');
    const watchOut = join(dir, 'watch.css');

    execFileSync(process.execPath, [...cli, 'theme', 'sync', '--colors', fixture, '--out', syncOut]);
    execFileSync(process.execPath, [...cli, 'theme', 'watch', '--once', '--colors', fixture, '--out', watchOut]);

    assert.match(readFileSync(syncOut, 'utf8'), /--omarchy-background: #101216;/);
    assert.match(readFileSync(watchOut, 'utf8'), /--omarchy-accent: #7aa2f7;/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('theme shell writes shell exports', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-shell-'));
  try {
    const out = join(dir, 'theme.env');
    const stdout = execFileSync(process.execPath, [...cli, 'theme', 'shell', '--colors', fixture], {
      encoding: 'utf8'
    });
    execFileSync(process.execPath, [...cli, 'theme', 'shell', '--colors', fixture, '--prefix', 'APP', '--out', out]);

    assert.match(stdout, /export OMARCHY_BACKGROUND='#101216'/);
    assert.match(readFileSync(out, 'utf8'), /export APP_ACCENT='#7aa2f7'/);
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

test('create generates react-vite app with blueprint contract', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-create-'));
  try {
    const target = join(dir, 'hello');
    execFileSync(
      process.execPath,
      [...cli, 'create', target, '--template', 'react-vite', '--kind', 'dashboard', '--colors', fixture],
      {
        encoding: 'utf8'
      }
    );
    const blueprint = JSON.parse(readFileSync(join(target, 'omarchy-blueprint.json'), 'utf8'));

    assert.match(readFileSync(join(target, 'package.json'), 'utf8'), /"name": "hello"/);
    assert.match(readFileSync(join(target, 'src/omarchy-theme.css'), 'utf8'), /--omarchy-background/);
    assert.equal(blueprint.appName, 'hello');
    assert.equal(blueprint.kind, 'dashboard');
    assert.ok(blueprint.acceptanceChecks.some((check) => check.includes('npm run build')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('verify reports generated app contract status', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-verify-'));
  try {
    const target = join(dir, 'hello');
    execFileSync(
      process.execPath,
      [...cli, 'create', target, '--template', 'react-vite', '--kind', 'command-center', '--colors', fixture]
    );

    const output = execFileSync(process.execPath, [...cli, 'verify', target, '--json'], { encoding: 'utf8' });
    const payload = JSON.parse(output);
    assert.equal(payload.ok, true);
    assert.equal(payload.kind, 'command-center');

    unlinkSync(join(target, 'src/omarchy-theme.css'));
    assert.throws(
      () => execFileSync(process.execPath, [...cli, 'verify', target], { encoding: 'utf8', stdio: 'pipe' }),
      /Command failed/
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('app desktop writes launcher entry', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-desktop-'));
  try {
    const target = join(dir, 'hello');
    const out = join(dir, 'hello.desktop');
    execFileSync(
      process.execPath,
      [...cli, 'create', target, '--template', 'react-vite', '--kind', 'studio', '--colors', fixture]
    );
    execFileSync(process.execPath, [...cli, 'app', 'desktop', target, '--out', out, '--name', 'Hello Native']);

    const desktop = readFileSync(out, 'utf8');
    assert.match(desktop, /^\[Desktop Entry\]/);
    assert.match(desktop, /Name=Hello Native/);
    assert.match(desktop, /Exec=npm --prefix/);
    assert.match(desktop, /Categories=Utility;/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('app hook writes executable theme sync script', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-hook-'));
  try {
    const target = join(dir, 'hello');
    const out = join(dir, 'theme-set');
    execFileSync(
      process.execPath,
      [...cli, 'create', target, '--template', 'react-vite', '--kind', 'studio', '--colors', fixture]
    );
    execFileSync(process.execPath, [...cli, 'app', 'hook', target, '--out', out, '--binary', 'node dist/cli.js']);

    const hook = readFileSync(out, 'utf8');
    assert.match(hook, /^#!\/usr\/bin\/env sh/);
    assert.match(hook, /theme sync --out/);
    assert.match(hook, /omarchy-theme.css/);
    assert.equal(statSync(out).mode & 0o111, 0o111);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
