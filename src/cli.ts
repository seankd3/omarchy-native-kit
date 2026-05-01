#!/usr/bin/env node
import { chmodSync, cpSync, existsSync, mkdirSync, readFileSync, watchFile, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  OmarchyThemeError,
  createStarterTheme,
  defaultColorsPath,
  readOmarchyTheme,
  toAgentBlueprintJson,
  toAgentContextJson,
  toAgentPrompt,
  readAppCatalog,
  toAppCatalogJson,
  toAppCatalogText,
  toAppVerificationBatchJson,
  toAppVerificationBatchText,
  toAppVerificationJson,
  toAppVerificationText,
  toCssVariables,
  toDesktopEntry,
  toGtkCss,
  toThemeHookScript,
  toJsonTheme,
  toQtPalette,
  toShellExports,
  verifyOmarchyApps,
  verifyOmarchyApp
} from './index.js';

type ParsedArgs = {
  positionals: string[];
  flags: Map<string, string | boolean>;
};

const args = parseArgs(process.argv.slice(2));

try {
  run(args);
} catch (error) {
  if (error instanceof OmarchyThemeError) {
    console.error(error.message);
    for (const detail of error.details) console.error(`  - ${detail}`);
  } else {
    console.error(error instanceof Error ? error.message : String(error));
  }
  process.exitCode = 1;
}

function run(parsed: ParsedArgs): void {
  const [command, subcommand] = parsed.positionals;

  if (!command || command === '--help' || command === '-h') {
    help();
    return;
  }

  if (command === 'doctor') {
    doctor(parsed);
    return;
  }

  if (command === 'theme' && subcommand === 'json') {
    process.stdout.write(toJsonTheme(loadTheme(parsed)));
    return;
  }

  if (command === 'theme' && subcommand === 'css') {
    const css = toCssVariables(loadTheme(parsed).tokens);
    const out = stringFlag(parsed, 'out');
    if (out) {
      mkdirSync(dirname(resolve(out)), { recursive: true });
      writeFileSync(out, css);
    } else {
      process.stdout.write(css);
    }
    return;
  }

  if (command === 'theme' && subcommand === 'shell') {
    const shell = toShellExports(loadTheme(parsed).tokens, stringFlag(parsed, 'prefix') ?? 'OMARCHY');
    const out = stringFlag(parsed, 'out');
    if (out) {
      mkdirSync(dirname(resolve(out)), { recursive: true });
      writeFileSync(out, shell);
    } else {
      process.stdout.write(shell);
    }
    return;
  }

  if (command === 'theme' && subcommand === 'gtk') {
    const gtk = toGtkCss(loadTheme(parsed).tokens);
    const out = stringFlag(parsed, 'out');
    if (out) {
      mkdirSync(dirname(resolve(out)), { recursive: true });
      writeFileSync(out, gtk);
    } else {
      process.stdout.write(gtk);
    }
    return;
  }

  if (command === 'theme' && subcommand === 'qt') {
    const qt = toQtPalette(loadTheme(parsed).tokens);
    const out = stringFlag(parsed, 'out');
    if (out) {
      mkdirSync(dirname(resolve(out)), { recursive: true });
      writeFileSync(out, qt);
    } else {
      process.stdout.write(qt);
    }
    return;
  }

  if (command === 'theme' && subcommand === 'sync') {
    syncThemeCss(parsed);
    return;
  }

  if (command === 'theme' && subcommand === 'watch') {
    watchThemeCss(parsed);
    return;
  }

  if (command === 'agent' && subcommand === 'json') {
    process.stdout.write(toAgentContextJson(loadTheme(parsed)));
    return;
  }

  if (command === 'agent' && subcommand === 'prompt') {
    process.stdout.write(toAgentPrompt(loadTheme(parsed)));
    return;
  }

  if (command === 'agent' && subcommand === 'blueprint') {
    process.stdout.write(
      toAgentBlueprintJson(loadTheme(parsed), {
        appName: stringFlag(parsed, 'app'),
        kind: stringFlag(parsed, 'kind')
      })
    );
    return;
  }

  if (command === 'create') {
    create(parsed);
    return;
  }

  if (command === 'verify') {
    verify(parsed);
    return;
  }

  if (command === 'app' && subcommand === 'desktop') {
    desktop(parsed);
    return;
  }

  if (command === 'app' && subcommand === 'hook') {
    hook(parsed);
    return;
  }

  if (command === 'app' && subcommand === 'catalog') {
    catalog(parsed);
    return;
  }

  help();
  process.exitCode = 1;
}

function catalog(parsed: ParsedArgs): void {
  const [, , path = '.'] = parsed.positionals;
  const report = readAppCatalog(path);
  process.stdout.write(booleanFlag(parsed, 'json') ? toAppCatalogJson(report) : toAppCatalogText(report));
  if (report.appCount === 0 || report.verifiedCount !== report.appCount) process.exitCode = 1;
}

function hook(parsed: ParsedArgs): void {
  const [, , path = '.'] = parsed.positionals;
  const script = toThemeHookScript({
    appPath: path,
    cssPath: stringFlag(parsed, 'css'),
    binary: stringFlag(parsed, 'binary')
  });
  const out = stringFlag(parsed, 'out');
  if (out) {
    mkdirSync(dirname(resolve(out)), { recursive: true });
    writeFileSync(out, script);
    chmodSync(out, 0o755);
  } else {
    process.stdout.write(script);
  }
}

function desktop(parsed: ParsedArgs): void {
  const [, , path = '.'] = parsed.positionals;
  const entry = toDesktopEntry({
    appPath: path,
    name: stringFlag(parsed, 'name'),
    exec: stringFlag(parsed, 'exec'),
    icon: stringFlag(parsed, 'icon'),
    comment: stringFlag(parsed, 'comment'),
    terminal: booleanFlag(parsed, 'terminal'),
    categories: stringFlag(parsed, 'categories')?.split(',').map((item) => item.trim()).filter(Boolean)
  });
  const out = stringFlag(parsed, 'out');
  if (out) {
    mkdirSync(dirname(resolve(out)), { recursive: true });
    writeFileSync(out, entry);
  } else {
    process.stdout.write(entry);
  }
}

function verify(parsed: ParsedArgs): void {
  const paths = parsed.positionals.slice(1);
  if (paths.length <= 1) {
    const report = verifyOmarchyApp(paths[0] ?? '.');
    process.stdout.write(booleanFlag(parsed, 'json') ? toAppVerificationJson(report) : toAppVerificationText(report));
    if (!report.ok) process.exitCode = 1;
    return;
  }

  const report = verifyOmarchyApps(paths);
  process.stdout.write(
    booleanFlag(parsed, 'json') ? toAppVerificationBatchJson(report) : toAppVerificationBatchText(report)
  );
  if (!report.ok) process.exitCode = 1;
}

function syncThemeCss(parsed: ParsedArgs, quiet = false): void {
  const out = stringFlag(parsed, 'out');
  if (!out) throw new Error('Missing --out <file>. Usage: omarchy-native theme sync --out src/omarchy-theme.css');

  const css = toCssVariables(loadTheme(parsed).tokens);
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(out, css);
  if (!quiet) console.log(`Synced Omarchy theme CSS to ${out}.`);
}

function watchThemeCss(parsed: ParsedArgs): void {
  const colorsPath = stringFlag(parsed, 'colors') ?? defaultColorsPath();
  syncThemeCss(parsed);
  if (booleanFlag(parsed, 'once')) return;

  console.log(`Watching ${colorsPath} for theme changes.`);
  watchFile(colorsPath, { interval: numberFlag(parsed, 'interval', 750) }, () => {
    try {
      syncThemeCss(parsed, true);
      console.log(`Synced Omarchy theme CSS to ${stringFlag(parsed, 'out')}.`);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
    }
  });
}

function doctor(parsed: ParsedArgs): void {
  const paths = {
    colorsPath: stringFlag(parsed, 'colors') ?? defaultColorsPath()
  };
  console.log('Omarchy Native Kit doctor');
  console.log(`colors.toml: ${paths.colorsPath}`);
  console.log(`exists: ${existsSync(paths.colorsPath) ? 'yes' : 'no'}`);

  if (existsSync(paths.colorsPath)) {
    const theme = loadTheme(parsed);
    console.log(`theme name: ${theme.name ?? '(unknown)'}`);
    console.log(`raw colors: ${Object.keys(theme.raw).length}`);
    console.log(`tokens: ${Object.keys(theme.tokens).length}`);
    for (const warning of theme.warnings) console.log(`warning: ${warning}`);
  }
}

function create(parsed: ParsedArgs): void {
  const [, name] = parsed.positionals;
  if (!name) throw new Error('Missing app name. Usage: omarchy-native create <name> --template react-vite [--kind dashboard]');

  const template = stringFlag(parsed, 'template') ?? 'react-vite';
  if (template !== 'react-vite') throw new Error(`Unsupported template "${template}". Available: react-vite.`);

  const target = resolve(name);
  if (existsSync(target)) throw new Error(`Target already exists: ${target}`);

  const theme = loadTheme(parsed, true);
  const appName = basename(target);
  const kind = stringFlag(parsed, 'kind');
  const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../templates/react-vite');
  cpSync(templateDir, target, { recursive: true });
  personalizePackageJson(join(target, 'package.json'), appName);
  writeFileSync(join(target, 'src/omarchy-theme.css'), toCssVariables(theme.tokens));
  writeFileSync(join(target, 'omarchy-blueprint.json'), toAgentBlueprintJson(theme, { appName, kind }));
  console.log(`Created ${name} from ${template}.`);
  console.log(`Next: cd ${name} && npm install && npm run dev`);
}

function personalizePackageJson(path: string, appName: string): void {
  const packageJson = JSON.parse(readFileSync(path, 'utf8')) as { name?: string };
  packageJson.name = slugifyPackageName(appName);
  writeFileSync(path, `${JSON.stringify(packageJson, null, 2)}\n`);
}

function slugifyPackageName(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'omarchy-native-app'
  );
}

function loadTheme(parsed: ParsedArgs, allowFallback = false) {
  const colorsPath = stringFlag(parsed, 'colors');
  const themeDir = stringFlag(parsed, 'theme-dir');
  try {
    return readOmarchyTheme({ colorsPath, themeDir });
  } catch (error) {
    if (!allowFallback) throw error;
    return createStarterTheme();
  }
}

function stringFlag(parsed: ParsedArgs, name: string): string | undefined {
  const value = parsed.flags.get(name);
  return typeof value === 'string' ? value : undefined;
}

function booleanFlag(parsed: ParsedArgs, name: string): boolean {
  return parsed.flags.get(name) === true;
}

function numberFlag(parsed: ParsedArgs, name: string, fallback: number): number {
  const value = stringFlag(parsed, name);
  if (!value) return fallback;
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function parseArgs(rawArgs: string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags = new Map<string, string | boolean>();

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg.startsWith('--')) {
      const [name, inlineValue] = arg.slice(2).split('=', 2);
      if (inlineValue !== undefined) {
        flags.set(name, inlineValue);
      } else if (rawArgs[index + 1] && !rawArgs[index + 1].startsWith('--')) {
        flags.set(name, rawArgs[index + 1]);
        index += 1;
      } else {
        flags.set(name, true);
      }
    } else {
      positionals.push(arg);
    }
  }

  return { positionals, flags };
}

function help(): void {
  console.log(`omarchy-native

Commands:
  doctor [--colors <path>]              Check Omarchy theme detection
  theme json [--colors <path>]          Print current Omarchy theme as JSON
  theme css [--out <file>]              Print or write CSS variables
  theme shell [--out <file>]            Print or write shell exports
  theme gtk [--out <file>]              Print or write GTK CSS
  theme qt [--out <file>]               Print or write Qt palette INI
  theme sync --out <file>               Write current theme CSS once
  theme watch --out <file>              Keep generated theme CSS in sync
  agent json [--colors <path>]          Print AI-agent design context as JSON
  agent prompt [--colors <path>]        Print a compact design prompt for agents
  agent blueprint [--app <name>]        Print a structured app build blueprint
  create <name> --template react-vite   Create a React/Vite starter app
    [--kind command-center|dashboard|studio] writes omarchy-blueprint.json
  verify [paths...] [--json]            Verify Omarchy-native app contracts
  app desktop [path] [--out <file>]     Generate a .desktop launcher entry
  app hook [path] [--out <file>]        Generate a safe theme sync hook script
  app catalog [path] [--json]           Catalog Omarchy-native apps by blueprint
`);
}
