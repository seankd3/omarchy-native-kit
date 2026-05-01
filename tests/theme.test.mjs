import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  blend,
  contrastRatio,
  mapSemanticTokens,
  parseColorsToml,
  readOmarchyTheme,
  toAgentContext,
  toAgentPrompt,
  toCssVariables,
  toJsonTheme
} from '../dist/index.js';

test('parses Omarchy colors.toml fixtures', () => {
  const input = readFileSync('tests/fixtures/colors.basic.toml', 'utf8');
  const raw = parseColorsToml(input);

  assert.equal(raw.background, '#101216');
  assert.equal(raw.color15, '#d5d6db');
});

test('supports sections, single quotes, and inline comments', () => {
  const input = readFileSync('tests/fixtures/colors.sections.toml', 'utf8');
  const raw = parseColorsToml(input);

  assert.equal(raw.background, '#ffffff');
  assert.equal(raw.foreground, '#111111');
});

test('reports invalid hex colors with friendly details', () => {
  assert.throws(
    () => parseColorsToml('background = "#fff"\n'),
    (error) => {
      assert.equal(error.code, 'THEME_PARSE_ERROR');
      assert.match(error.details[0], /invalid color/);
      return true;
    }
  );
});

test('maps semantic tokens with readable foregrounds', () => {
  const tokens = mapSemanticTokens({
    background: '#ffffff',
    foreground: '#eeeeee',
    accent: '#f5f5f5'
  });

  assert.equal(tokens.foreground, '#111827');
  assert.ok(contrastRatio(tokens.accent, tokens.accentForeground) >= 4.5);
});

test('blends colors deterministically', () => {
  assert.equal(blend('#ffffff', '#000000', 0.5), '#808080');
});

test('reads theme with path overrides', () => {
  const root = mkdtempSync(join(tmpdir(), 'omarchy-native-kit-'));
  const dir = join(root, 'theme');
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'colors.toml'), readFileSync('tests/fixtures/colors.basic.toml'));
    writeFileSync(join(dir, 'theme.name'), 'Test Theme\n');

    const theme = readOmarchyTheme({ themeDir: dir });
    assert.equal(theme.name, 'Test Theme');
    assert.equal(theme.tokens.accent, '#7aa2f7');
    assert.equal(theme.source.colorsPath, join(dir, 'colors.toml'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('emits CSS and JSON schemas', () => {
  const theme = readOmarchyTheme({ colorsPath: 'tests/fixtures/colors.basic.toml', themeNamePath: null });
  const css = toCssVariables(theme.tokens);
  const json = JSON.parse(toJsonTheme(theme));

  assert.match(css, /--omarchy-background: #101216;/);
  assert.equal(json.schemaVersion, 1);
  assert.equal(json.tokens.accent, '#7aa2f7');
});

test('emits agent context for coding assistants', () => {
  const theme = readOmarchyTheme({ colorsPath: 'tests/fixtures/colors.basic.toml', themeNamePath: null });
  const context = toAgentContext(theme);
  const prompt = toAgentPrompt(theme);

  assert.equal(context.schemaVersion, 1);
  assert.equal(context.kit, 'omarchy-native-kit');
  assert.ok(context.cssVariables.some((item) => item.variable === '--omarchy-accent' && item.value === '#7aa2f7'));
  assert.ok(context.designRules.some((rule) => rule.includes('--omarchy-*')));
  assert.match(prompt, /You are building an Omarchy-native interface/);
  assert.match(prompt, /--omarchy-background: #101216/);
});
