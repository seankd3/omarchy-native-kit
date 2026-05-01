import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
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

test('theme gtk writes gtk css', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-gtk-'));
  try {
    const out = join(dir, 'gtk.css');
    const stdout = execFileSync(process.execPath, [...cli, 'theme', 'gtk', '--colors', fixture], {
      encoding: 'utf8'
    });
    execFileSync(process.execPath, [...cli, 'theme', 'gtk', '--colors', fixture, '--out', out]);

    assert.match(stdout, /@define-color omarchy_accent #7aa2f7;/);
    assert.match(readFileSync(out, 'utf8'), /button:hover, row:hover/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('theme qt writes qt palette ini', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-qt-'));
  try {
    const out = join(dir, 'qt.ini');
    const stdout = execFileSync(process.execPath, [...cli, 'theme', 'qt', '--colors', fixture], {
      encoding: 'utf8'
    });
    execFileSync(process.execPath, [...cli, 'theme', 'qt', '--colors', fixture, '--out', out]);

    assert.match(stdout, /\[Omarchy\]/);
    assert.match(stdout, /accent=#7aa2f7/);
    assert.match(readFileSync(out, 'utf8'), /Window=#101216/);
    assert.match(readFileSync(out, 'utf8'), /HighlightedText=#111827/);
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
    assert.ok(payload.checks.some((check) => check.name === 'theme-scripts' && check.ok));

    unlinkSync(join(target, 'src/omarchy-theme.css'));
    assert.throws(
      () => execFileSync(process.execPath, [...cli, 'verify', target], { encoding: 'utf8', stdio: 'pipe' }),
      /Command failed/
    );

    execFileSync(
      process.execPath,
      [...cli, 'theme', 'css', '--colors', fixture, '--out', join(target, 'src/omarchy-theme.css')]
    );
    writeFileSync(join(target, 'src/bad.css'), '.bad { color: #123456; }\n');
    assert.throws(
      () => execFileSync(process.execPath, [...cli, 'verify', target], { encoding: 'utf8', stdio: 'pipe' }),
      /Command failed/
    );

    unlinkSync(join(target, 'src/bad.css'));
    const packagePath = join(target, 'package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    packageJson.scripts['theme:css'] = 'vite';
    writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
    assert.throws(
      () => execFileSync(process.execPath, [...cli, 'verify', target], { encoding: 'utf8', stdio: 'pipe' }),
      /Command failed/
    );
    packageJson.scripts['theme:css'] = 'omarchy-native theme sync --out src/omarchy-theme.css';
    writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

    const blueprintPath = join(target, 'omarchy-blueprint.json');
    const blueprint = JSON.parse(readFileSync(blueprintPath, 'utf8'));
    blueprint.appName = 'wrong-name';
    writeFileSync(blueprintPath, `${JSON.stringify(blueprint, null, 2)}\n`);
    assert.throws(
      () => execFileSync(process.execPath, [...cli, 'verify', target], { encoding: 'utf8', stdio: 'pipe' }),
      /Command failed/
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('verify reports multiple app contract statuses', () => {
  const output = execFileSync(
    process.execPath,
    [...cli, 'verify', 'examples/signal-desk', 'examples/shortcut-trainer', '--json'],
    { encoding: 'utf8' }
  );
  const payload = JSON.parse(output);

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.ok, true);
  assert.equal(payload.appCount, 2);
  assert.equal(payload.verifiedCount, 2);
  assert.deepEqual(
    payload.reports.map((report) => report.appName),
    ['signal-desk', 'shortcut-trainer']
  );
});

test('verify can run an app build script', () => {
  const dir = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-verify-build-'));
  try {
    const target = join(dir, 'buildable');
    execFileSync(
      process.execPath,
      [...cli, 'create', target, '--template', 'react-vite', '--kind', 'command-center', '--colors', fixture]
    );
    const packagePath = join(target, 'package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    packageJson.scripts.build = 'node -e "console.log(\\"build ok\\")"';
    writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

    const output = execFileSync(process.execPath, [...cli, 'verify', target, '--build', '--json'], { encoding: 'utf8' });
    const payload = JSON.parse(output);

    assert.equal(payload.ok, true);
    assert.ok(payload.checks.some((check) => check.name === 'build' && check.ok));

    packageJson.scripts.build = 'node -e "process.exit(2)"';
    writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
    assert.throws(
      () => execFileSync(process.execPath, [...cli, 'verify', target, '--build'], { encoding: 'utf8', stdio: 'pipe' }),
      /Command failed/
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('verify all reports discovered app contract statuses', () => {
  const output = execFileSync(process.execPath, [...cli, 'verify', '--all', 'examples', '--json'], {
    encoding: 'utf8'
  });
  const payload = JSON.parse(output);

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.ok, true);
  assert.equal(payload.appCount, 35);
  assert.equal(payload.verifiedCount, 35);
  assert.ok(payload.reports.some((report) => report.appName === 'audio-device-mixer'));
  assert.ok(payload.reports.some((report) => report.appName === 'backup-restore-console'));
  assert.ok(payload.reports.some((report) => report.appName === 'clipboard-history-curator'));
  assert.ok(payload.reports.some((report) => report.appName === 'config-diff-studio'));
  assert.ok(payload.reports.some((report) => report.appName === 'credential-session-vault'));
  assert.ok(payload.reports.some((report) => report.appName === 'display-layout-planner'));
  assert.ok(payload.reports.some((report) => report.appName === 'environment-variable-auditor'));
  assert.ok(payload.reports.some((report) => report.appName === 'focus-flight-recorder'));
  assert.ok(payload.reports.some((report) => report.appName === 'input-method-studio'));
  assert.ok(payload.reports.some((report) => report.appName === 'journal-timeline-inspector'));
  assert.ok(payload.reports.some((report) => report.appName === 'locale-timezone-manager'));
  assert.ok(payload.reports.some((report) => report.appName === 'network-profile-mapper'));
  assert.ok(payload.reports.some((report) => report.appName === 'notification-routing-board'));
  assert.ok(payload.reports.some((report) => report.appName === 'package-update-coordinator'));
  assert.ok(payload.reports.some((report) => report.appName === 'power-profile-switchboard'));
  assert.ok(payload.reports.some((report) => report.appName === 'service-restart-orchestrator'));
  assert.ok(payload.reports.some((report) => report.appName === 'window-rule-lab'));
  assert.ok(payload.reports.some((report) => report.appName === 'workspace-automation-builder'));
  assert.ok(payload.reports.some((report) => report.appName === 'docs-reader'));
  assert.ok(payload.reports.some((report) => report.appName === 'portal-permission-center'));
  assert.ok(payload.reports.some((report) => report.appName === 'session-restore-planner'));
  assert.ok(payload.reports.some((report) => report.appName === 'shortcut-trainer'));
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

test('app catalog lists verified blueprint apps', () => {
  const output = execFileSync(process.execPath, [...cli, 'app', 'catalog', 'examples', '--json'], {
    encoding: 'utf8'
  });
  const payload = JSON.parse(output);

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.appCount, 35);
  assert.equal(payload.verifiedCount, 35);
  assert.ok(payload.apps.some((app) => app.name === 'app-health-monitor' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'audio-device-mixer' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'backup-restore-console' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'clipboard-history-curator' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'aur-packager' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'config-diff-studio' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'credential-session-vault' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'display-layout-planner' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'docs-reader' && app.kind === 'command-center' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'environment-variable-auditor' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'focus-flight-recorder' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'hook-station' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'input-method-studio' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'journal-timeline-inspector' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'locale-timezone-manager' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'native-gallery' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'network-profile-mapper' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'notification-routing-board' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'ops-deck' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'package-update-coordinator' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'power-profile-switchboard' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'portal-permission-center' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'prompt-foundry' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'release-console' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'service-restart-orchestrator' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'session-restore-planner' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'shortcut-trainer' && app.kind === 'command-center' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'theme-migration-lab' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'window-rule-lab' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'workspace-automation-builder' && app.kind === 'studio' && app.verified));
  assert.ok(payload.apps.some((app) => app.name === 'workspace-radar' && app.kind === 'dashboard' && app.verified));
  assert.ok(payload.apps.every((app) => app.acceptanceChecks === 8));
});
