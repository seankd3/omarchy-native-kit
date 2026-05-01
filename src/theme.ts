import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { blend, normalizeHex, readableForeground, type HexColor } from './color.js';

export type RawOmarchyPalette = Record<string, HexColor>;

export type OmarchyTokenName =
  | 'background'
  | 'foreground'
  | 'mutedForeground'
  | 'surface'
  | 'surfaceForeground'
  | 'surfaceRaised'
  | 'surfaceRaisedForeground'
  | 'border'
  | 'borderStrong'
  | 'accent'
  | 'accentForeground'
  | 'danger'
  | 'dangerForeground'
  | 'success'
  | 'successForeground'
  | 'warning'
  | 'warningForeground'
  | 'info'
  | 'infoForeground'
  | 'shadow';

export type SemanticOmarchyTokens = Record<OmarchyTokenName, HexColor>;

export type OmarchyTheme = {
  schemaVersion: 1;
  name: string | null;
  source: {
    colorsPath: string;
    themeNamePath: string | null;
  };
  raw: RawOmarchyPalette;
  tokens: SemanticOmarchyTokens;
  warnings: string[];
};

export type ReadThemeOptions = {
  themeDir?: string;
  colorsPath?: string;
  themeNamePath?: string | null;
};

export class OmarchyThemeError extends Error {
  constructor(
    message: string,
    public readonly code: 'THEME_NOT_FOUND' | 'THEME_PARSE_ERROR' | 'THEME_VALIDATION_ERROR',
    public readonly details: string[] = []
  ) {
    super(message);
    this.name = 'OmarchyThemeError';
  }
}

export const starterRawPalette: RawOmarchyPalette = {
  background: '#101216',
  foreground: '#e7eaf0',
  accent: '#7aa2f7',
  color0: '#151820',
  color1: '#f7768e',
  color2: '#9ece6a',
  color3: '#e0af68',
  color4: '#7aa2f7',
  color5: '#bb9af7',
  color6: '#7dcfff',
  color7: '#c0caf5',
  color8: '#414868',
  color9: '#ff899d',
  color10: '#a9dc76',
  color11: '#faba4a',
  color12: '#8db0ff',
  color13: '#c7a9ff',
  color14: '#8bdfff',
  color15: '#d5d6db'
};

export function createStarterTheme(colorsPath = '(starter palette)'): OmarchyTheme {
  return {
    schemaVersion: 1,
    name: 'starter',
    source: {
      colorsPath,
      themeNamePath: null
    },
    raw: starterRawPalette,
    tokens: mapSemanticTokens(starterRawPalette),
    warnings: ['Using bundled starter palette because no Omarchy theme was found.']
  };
}

export function defaultThemeDir(): string {
  return join(homedir(), '.config/omarchy/current/theme');
}

export function defaultColorsPath(): string {
  return join(defaultThemeDir(), 'colors.toml');
}

export function defaultThemeNamePath(): string {
  return join(defaultThemeDir(), 'theme.name');
}

export function resolveThemePaths(options: ReadThemeOptions = {}): { colorsPath: string; themeNamePath: string | null } {
  const colorsPath = options.colorsPath ?? join(options.themeDir ?? defaultThemeDir(), 'colors.toml');
  const themeNamePath =
    options.themeNamePath === undefined
      ? options.themeDir
        ? join(options.themeDir, 'theme.name')
        : defaultThemeNamePath()
      : options.themeNamePath;

  return { colorsPath, themeNamePath };
}

export function readOmarchyTheme(options: ReadThemeOptions = {}): OmarchyTheme {
  const paths = resolveThemePaths(options);
  if (!existsSync(paths.colorsPath)) {
    throw new OmarchyThemeError(
      `No Omarchy colors.toml found at ${paths.colorsPath}. Run inside Omarchy or pass a test path override.`,
      'THEME_NOT_FOUND'
    );
  }

  const raw = parseColorsToml(readFileSync(paths.colorsPath, 'utf8'), paths.colorsPath);
  const validation = validateRawPalette(raw);
  const name =
    paths.themeNamePath && existsSync(paths.themeNamePath)
      ? readFileSync(paths.themeNamePath, 'utf8').trim() || null
      : null;

  return {
    schemaVersion: 1,
    name,
    source: paths,
    raw,
    tokens: mapSemanticTokens(raw),
    warnings: validation.warnings
  };
}

export function parseColorsToml(input: string, sourceName = 'colors.toml'): RawOmarchyPalette {
  const palette: RawOmarchyPalette = {};
  const errors: string[] = [];

  input.split(/\r?\n/).forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = stripComment(line).trim();
    if (!trimmed || /^\[[\w.-]+\]$/.test(trimmed)) return;

    const match = trimmed.match(/^([A-Za-z0-9_-]+)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s]+))\s*$/);
    if (!match) {
      errors.push(`${sourceName}:${lineNumber} could not parse "${line.trim()}". Expected key = "#rrggbb".`);
      return;
    }

    const key = match[1];
    const value = match[2] ?? match[3] ?? match[4];
    try {
      palette[key] = normalizeHex(value);
    } catch {
      errors.push(`${sourceName}:${lineNumber} has invalid color for "${key}": ${value}`);
    }
  });

  if (errors.length > 0) {
    throw new OmarchyThemeError('Could not parse Omarchy colors.toml.', 'THEME_PARSE_ERROR', errors);
  }

  if (Object.keys(palette).length === 0) {
    throw new OmarchyThemeError(
      'Omarchy colors.toml did not contain any hex color assignments.',
      'THEME_VALIDATION_ERROR'
    );
  }

  return palette;
}

export function validateRawPalette(raw: RawOmarchyPalette): { warnings: string[] } {
  const warnings: string[] = [];
  for (const key of ['background', 'foreground']) {
    if (!raw[key]) warnings.push(`Missing "${key}", using a derived fallback.`);
  }

  const ansiCount = Array.from({ length: 16 }, (_, index) => `color${index}`).filter((key) => raw[key]).length;
  if (ansiCount < 8) warnings.push(`Only found ${ansiCount} ANSI colors; semantic accents may use fallbacks.`);

  return { warnings };
}

export function mapSemanticTokens(raw: RawOmarchyPalette): SemanticOmarchyTokens {
  const background = raw.background ?? raw.color0 ?? '#111111';
  const foreground = readableForeground(background, raw.foreground ?? raw.color15);
  const surface = raw.color0 ?? blend(foreground, background, 0.08);
  const surfaceRaised = raw.color8 ?? blend(foreground, background, 0.14);
  const accent = raw.accent ?? raw.color4 ?? raw.color6 ?? foreground;
  const danger = raw.color1 ?? '#ff5555';
  const success = raw.color2 ?? '#50fa7b';
  const warning = raw.color3 ?? raw.color11 ?? '#f1fa8c';
  const info = raw.color6 ?? raw.color4 ?? accent;

  return {
    background: normalizeHex(background),
    foreground,
    mutedForeground: blend(foreground, background, 0.72),
    surface: normalizeHex(surface),
    surfaceForeground: readableForeground(surface, foreground),
    surfaceRaised: normalizeHex(surfaceRaised),
    surfaceRaisedForeground: readableForeground(surfaceRaised, foreground),
    border: blend(foreground, background, 0.24),
    borderStrong: blend(foreground, background, 0.38),
    accent: normalizeHex(accent),
    accentForeground: readableForeground(accent, foreground),
    danger: normalizeHex(danger),
    dangerForeground: readableForeground(danger, foreground),
    success: normalizeHex(success),
    successForeground: readableForeground(success, foreground),
    warning: normalizeHex(warning),
    warningForeground: readableForeground(warning, foreground),
    info: normalizeHex(info),
    infoForeground: readableForeground(info, foreground),
    shadow: '#000000'
  };
}

function stripComment(line: string): string {
  let quote: '"' | "'" | null = null;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if ((character === '"' || character === "'") && line[index - 1] !== '\\') {
      quote = quote === character ? null : quote ?? character;
    }
    if (character === '#' && quote === null) return line.slice(0, index);
  }

  return line;
}
