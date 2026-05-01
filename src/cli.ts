#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { mapSemanticPalette, parseColorsToml, toCssVariables } from './index.js';

function currentColorsPath(): string {
  return join(homedir(), '.config/omarchy/current/theme/colors.toml');
}

function loadTheme() {
  const path = currentColorsPath();
  if (!existsSync(path)) {
    throw new Error(`No Omarchy colors.toml found at ${path}`);
  }
  const raw = parseColorsToml(readFileSync(path, 'utf8'));
  return { path, raw, semantic: mapSemanticPalette(raw) };
}

function help() {
  console.log(`omarchy-native

Commands:
  theme json          Print current Omarchy semantic theme as JSON
  theme css [--out]   Print or write CSS variables
  doctor              Check Omarchy theme detection
`);
}

const args = process.argv.slice(2);

try {
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    help();
  } else if (args[0] === 'doctor') {
    const path = currentColorsPath();
    console.log(`colors.toml: ${path}`);
    console.log(`exists: ${existsSync(path) ? 'yes' : 'no'}`);
  } else if (args[0] === 'theme' && args[1] === 'json') {
    console.log(JSON.stringify(loadTheme(), null, 2));
  } else if (args[0] === 'theme' && args[1] === 'css') {
    const css = toCssVariables(loadTheme().semantic);
    const outIndex = args.indexOf('--out');
    if (outIndex !== -1 && args[outIndex + 1]) {
      writeFileSync(args[outIndex + 1], css);
    } else {
      process.stdout.write(css);
    }
  } else {
    help();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
