import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import type { AgentBlueprintKind, OmarchyAgentBlueprint } from './agent.js';

export type AppVerificationCheck = {
  name: string;
  ok: boolean;
  detail: string;
};

export type AppVerificationReport = {
  schemaVersion: 1;
  appPath: string;
  ok: boolean;
  appName: string | null;
  kind: AgentBlueprintKind | null;
  checks: AppVerificationCheck[];
};

export type AppVerificationBatchReport = {
  schemaVersion: 1;
  ok: boolean;
  appCount: number;
  verifiedCount: number;
  reports: AppVerificationReport[];
};

export function verifyOmarchyApp(appPath: string): AppVerificationReport {
  const root = resolve(appPath);
  const checks: AppVerificationCheck[] = [];
  const packagePath = join(root, 'package.json');
  const blueprintPath = join(root, 'omarchy-blueprint.json');
  const themeCssPath = join(root, 'src/omarchy-theme.css');
  const mainPath = join(root, 'src/main.tsx');

  const packageJson = readJson<{ name?: string; scripts?: Record<string, string> }>(packagePath);
  const blueprint = readJson<OmarchyAgentBlueprint>(blueprintPath);
  const themeCss = readText(themeCssPath);
  const main = readText(mainPath);
  const hardcodedColors = findHardcodedColors(root);

  checks.push({
    name: 'package-json',
    ok: packageJson.ok && typeof packageJson.value.name === 'string',
    detail: packageJson.ok ? `package name: ${packageJson.value.name ?? '(missing)'}` : packageJson.error
  });
  checks.push({
    name: 'build-script',
    ok: packageJson.ok && typeof packageJson.value.scripts?.build === 'string',
    detail: packageJson.ok ? `build script: ${packageJson.value.scripts?.build ?? '(missing)'}` : packageJson.error
  });
  checks.push({
    name: 'theme-scripts',
    ok: packageJson.ok && hasThemeScripts(packageJson.value.scripts),
    detail: packageJson.ok ? themeScriptsDetail(packageJson.value.scripts) : packageJson.error
  });
  checks.push({
    name: 'blueprint',
    ok: blueprint.ok && blueprint.value.schemaVersion === 1 && blueprint.value.kit === 'omarchy-native-kit',
    detail: blueprint.ok ? `${blueprint.value.kind} blueprint for ${blueprint.value.appName}` : blueprint.error
  });
  checks.push({
    name: 'blueprint-name',
    ok: blueprint.ok && packageJson.ok && blueprint.value.appName === packageJson.value.name,
    detail: blueprintNameDetail(blueprint, packageJson)
  });
  checks.push({
    name: 'blueprint-files',
    ok: blueprint.ok && blueprint.value.files.every((file) => existsSync(join(root, file))),
    detail: blueprint.ok ? missingFiles(root, blueprint.value.files) : blueprint.error
  });
  checks.push({
    name: 'theme-css',
    ok: themeCss.ok && themeCss.value.includes('--omarchy-background') && themeCss.value.includes('--omarchy-accent'),
    detail: themeCss.ok ? 'contains core --omarchy-* variables' : themeCss.error
  });
  checks.push({
    name: 'theme-import-order',
    ok: main.ok && importsThemeBeforeStyles(main.value),
    detail: main.ok ? 'src/omarchy-theme.css is imported before src/styles.css' : main.error
  });
  checks.push({
    name: 'no-hardcoded-colors',
    ok: hardcodedColors.length === 0,
    detail:
      hardcodedColors.length === 0
        ? 'no raw hex colors found outside generated theme files'
        : `raw hex colors: ${hardcodedColors.slice(0, 6).join(', ')}`
  });

  return {
    schemaVersion: 1,
    appPath: root,
    ok: checks.every((check) => check.ok),
    appName: blueprint.ok ? blueprint.value.appName : packageJson.ok ? packageJson.value.name ?? null : null,
    kind: blueprint.ok ? blueprint.value.kind : null,
    checks
  };
}

export function verifyOmarchyApps(appPaths: string[]): AppVerificationBatchReport {
  const reports = appPaths.map((appPath) => verifyOmarchyApp(appPath));

  return {
    schemaVersion: 1,
    ok: reports.every((report) => report.ok),
    appCount: reports.length,
    verifiedCount: reports.filter((report) => report.ok).length,
    reports
  };
}

export function verifyOmarchyAppDirectory(rootPath: string): AppVerificationBatchReport {
  const root = resolve(rootPath);
  const appPaths = findBlueprints(root)
    .map((blueprintPath) => dirname(blueprintPath))
    .sort((a, b) => a.localeCompare(b));

  return verifyOmarchyApps(appPaths);
}

export function toAppVerificationJson(report: AppVerificationReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function toAppVerificationBatchJson(report: AppVerificationBatchReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function toAppVerificationText(report: AppVerificationReport): string {
  const lines = [
    `Omarchy app verification: ${report.ok ? 'ok' : 'failed'}`,
    `app: ${report.appName ?? '(unknown)'}`,
    `path: ${report.appPath}`,
    ...report.checks.map((check) => `${check.ok ? 'ok' : 'fail'} ${check.name}: ${check.detail}`)
  ];

  return `${lines.join('\n')}\n`;
}

export function toAppVerificationBatchText(report: AppVerificationBatchReport): string {
  const sections = report.reports.map((appReport) => toAppVerificationText(appReport).trimEnd());
  sections.push(
    [
      `Omarchy app verification summary: ${report.ok ? 'ok' : 'failed'}`,
      `verified: ${report.verifiedCount}/${report.appCount}`
    ].join('\n')
  );

  return `${sections.join('\n\n')}\n`;
}

function readJson<T>(path: string): { ok: true; value: T } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(readFileSync(path, 'utf8')) as T };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function readText(path: string): { ok: true; value: string } | { ok: false; error: string } {
  try {
    return { ok: true, value: readFileSync(path, 'utf8') };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function missingFiles(root: string, files: string[]): string {
  const missing = files.filter((file) => !existsSync(join(root, file)));
  return missing.length === 0 ? 'all blueprint files exist' : `missing: ${missing.join(', ')}`;
}

function importsThemeBeforeStyles(source: string): boolean {
  const themeIndex = source.indexOf("import './omarchy-theme.css'");
  const stylesIndex = source.indexOf("import './styles.css'");
  return themeIndex >= 0 && stylesIndex >= 0 && themeIndex < stylesIndex;
}

function hasThemeScripts(scripts: Record<string, string> | undefined): boolean {
  const css = scripts?.['theme:css'];
  const watch = scripts?.['theme:watch'];
  return (
    typeof css === 'string' &&
    css.includes('omarchy-native theme sync') &&
    css.includes('--out src/omarchy-theme.css') &&
    typeof watch === 'string' &&
    watch.includes('omarchy-native theme watch') &&
    watch.includes('--out src/omarchy-theme.css')
  );
}

function themeScriptsDetail(scripts: Record<string, string> | undefined): string {
  if (hasThemeScripts(scripts)) return 'theme:css and theme:watch refresh src/omarchy-theme.css';
  const missing = ['theme:css', 'theme:watch'].filter((script) => typeof scripts?.[script] !== 'string');
  if (missing.length > 0) return `missing scripts: ${missing.join(', ')}`;
  return 'theme scripts must use omarchy-native theme sync/watch --out src/omarchy-theme.css';
}

function blueprintNameDetail(
  blueprint: { ok: true; value: OmarchyAgentBlueprint } | { ok: false; error: string },
  packageJson: { ok: true; value: { name?: string; scripts?: Record<string, string> } } | { ok: false; error: string }
): string {
  if (!blueprint.ok) return blueprint.error;
  if (!packageJson.ok) return packageJson.error;
  return `blueprint appName ${blueprint.value.appName}; package name ${packageJson.value.name ?? '(missing)'}`;
}

function findHardcodedColors(root: string): string[] {
  const findings: string[] = [];
  walk(join(root, 'src'), (path) => {
    if (path.endsWith('omarchy-theme.css')) return;
    if (!/\.(css|tsx?|jsx?)$/.test(path)) return;

    const source = readText(path);
    if (!source.ok) return;
    const relativePath = path.slice(root.length + 1);
    const lines = source.value.split(/\r?\n/);
    lines.forEach((line, index) => {
      const matches = line.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
      for (const match of matches) findings.push(`${relativePath}:${index + 1}:${match}`);
    });
  });

  return findings;
}

function walk(path: string, visit: (path: string) => void): void {
  if (!existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry), visit);
    return;
  }

  if (stat.isFile()) visit(path);
}

function findBlueprints(root: string): string[] {
  const results: string[] = [];
  walkBlueprints(root, (path) => {
    if (basename(path) === 'omarchy-blueprint.json') results.push(path);
  });
  return results;
}

function walkBlueprints(path: string, visit: (path: string) => void): void {
  if (!existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isDirectory()) {
    if (basename(path) === 'node_modules' || basename(path) === 'dist') return;
    for (const entry of readdirSync(path)) walkBlueprints(join(path, entry), visit);
    return;
  }

  if (stat.isFile()) visit(path);
}
