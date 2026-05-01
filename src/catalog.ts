import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import type { AgentBlueprintKind, OmarchyAgentBlueprint } from './agent.js';
import { verifyOmarchyApp } from './verify.js';

export type AppCatalogEntry = {
  name: string;
  path: string;
  kind: AgentBlueprintKind;
  themeName: string | null;
  verified: boolean;
  files: number;
  acceptanceChecks: number;
};

export type AppCatalog = {
  schemaVersion: 1;
  root: string;
  appCount: number;
  verifiedCount: number;
  apps: AppCatalogEntry[];
};

export function readAppCatalog(rootPath: string): AppCatalog {
  const root = resolve(rootPath);
  const apps = findBlueprints(root)
    .map((blueprintPath) => toCatalogEntry(root, blueprintPath))
    .filter((entry): entry is AppCatalogEntry => entry !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    schemaVersion: 1,
    root,
    appCount: apps.length,
    verifiedCount: apps.filter((app) => app.verified).length,
    apps
  };
}

export function toAppCatalogJson(catalog: AppCatalog): string {
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

export function toAppCatalogText(catalog: AppCatalog): string {
  const lines = [
    `Omarchy app catalog: ${catalog.appCount} app${catalog.appCount === 1 ? '' : 's'}`,
    `root: ${catalog.root}`,
    `verified: ${catalog.verifiedCount}/${catalog.appCount}`,
    ...catalog.apps.map(
      (app) =>
        `${app.verified ? 'ok' : 'fail'} ${app.name} (${app.kind}) ${app.path} - ${app.files} files, ${app.acceptanceChecks} checks`
    )
  ];

  return `${lines.join('\n')}\n`;
}

function toCatalogEntry(root: string, blueprintPath: string): AppCatalogEntry | null {
  try {
    const appPath = resolve(blueprintPath, '..');
    const blueprint = JSON.parse(readFileSync(blueprintPath, 'utf8')) as OmarchyAgentBlueprint;
    const report = verifyOmarchyApp(appPath);
    return {
      name: blueprint.appName || basename(appPath),
      path: relative(root, appPath) || '.',
      kind: blueprint.kind,
      themeName: blueprint.themeName,
      verified: report.ok,
      files: blueprint.files.length,
      acceptanceChecks: blueprint.acceptanceChecks.length
    };
  } catch {
    return null;
  }
}

function findBlueprints(root: string): string[] {
  const results: string[] = [];
  walk(root, (path) => {
    if (basename(path) === 'omarchy-blueprint.json') results.push(path);
  });
  return results;
}

function walk(path: string, visit: (path: string) => void): void {
  if (!existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isDirectory()) {
    if (basename(path) === 'node_modules' || basename(path) === 'dist') return;
    for (const entry of readdirSync(path)) walk(join(path, entry), visit);
    return;
  }

  if (stat.isFile()) visit(path);
}
