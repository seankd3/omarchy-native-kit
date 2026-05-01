export type RawOmarchyPalette = Record<string, string>;

export type SemanticOmarchyPalette = {
  background: string;
  foreground: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  accent: string;
  danger: string;
  success: string;
  warning: string;
  info: string;
};

export function parseColorsToml(input: string): RawOmarchyPalette {
  const palette: RawOmarchyPalette = {};

  for (const line of input.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z0-9_]+)\s*=\s*"(#[0-9A-Fa-f]{6})"\s*$/);
    if (match) palette[match[1]] = match[2];
  }

  return palette;
}

export function mapSemanticPalette(raw: RawOmarchyPalette): SemanticOmarchyPalette {
  const background = raw.background ?? '#111111';
  const foreground = raw.foreground ?? '#eeeeee';
  return {
    background,
    foreground,
    surface: raw.color0 ?? background,
    surfaceRaised: raw.color8 ?? raw.color0 ?? background,
    border: raw.color8 ?? raw.accent ?? foreground,
    accent: raw.accent ?? raw.color4 ?? foreground,
    danger: raw.color1 ?? '#ff5555',
    success: raw.color2 ?? '#50fa7b',
    warning: raw.color3 ?? raw.color11 ?? '#f1fa8c',
    info: raw.color6 ?? raw.color4 ?? raw.accent ?? '#8be9fd'
  };
}

export function toCssVariables(tokens: SemanticOmarchyPalette): string {
  const lines = Object.entries(tokens).map(([key, value]) => `  --omarchy-${kebab(key)}: ${value};`);
  return `:root {\n${lines.join('\n')}\n}\n`;
}

function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
