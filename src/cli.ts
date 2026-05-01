#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
  toCssVariables,
  toJsonTheme
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

  help();
  process.exitCode = 1;
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
  if (!name) throw new Error('Missing app name. Usage: omarchy-native create <name> --template react-vite');

  const template = stringFlag(parsed, 'template') ?? 'react-vite';
  if (template !== 'react-vite') throw new Error(`Unsupported template "${template}". Available: react-vite.`);

  const target = resolve(name);
  if (existsSync(target)) throw new Error(`Target already exists: ${target}`);

  const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../templates/react-vite');
  cpSync(templateDir, target, { recursive: true });
  personalizePackageJson(join(target, 'package.json'), basename(target));
  writeFileSync(join(target, 'src/omarchy-theme.css'), toCssVariables(loadTheme(parsed, true).tokens));
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
  agent json [--colors <path>]          Print AI-agent design context as JSON
  agent prompt [--colors <path>]        Print a compact design prompt for agents
  agent blueprint [--app <name>]        Print a structured app build blueprint
  create <name> --template react-vite   Create a React/Vite starter app
`);
}
