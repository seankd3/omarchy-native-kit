import type { OmarchyTheme, SemanticOmarchyTokens } from './theme.js';

export function toCssVariables(tokens: SemanticOmarchyTokens, selector = ':root'): string {
  const lines = Object.entries(tokens).map(([key, value]) => `  --omarchy-${kebab(key)}: ${value};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

export function toJsonTheme(theme: OmarchyTheme): string {
  return `${JSON.stringify(theme, null, 2)}\n`;
}

export function toShellExports(tokens: SemanticOmarchyTokens, prefix = 'OMARCHY'): string {
  const lines = Object.entries(tokens).map(([key, value]) => {
    const name = `${prefix}_${constant(key)}`;
    return `export ${name}=${shellQuote(value)}`;
  });
  return `${lines.join('\n')}\n`;
}

export function toGtkCss(tokens: SemanticOmarchyTokens): string {
  const colorLines = Object.entries(tokens).map(([key, value]) => `@define-color omarchy_${snake(key)} ${value};`);
  const widgetLines = [
    '',
    '* {',
    '  color: @omarchy_foreground;',
    '  background-color: @omarchy_background;',
    '}',
    '',
    'window, popover, menu {',
    '  background-color: @omarchy_background;',
    '  color: @omarchy_foreground;',
    '}',
    '',
    'button, entry, list, row, toolbar, headerbar {',
    '  background-color: @omarchy_surface;',
    '  color: @omarchy_surface_foreground;',
    '  border-color: @omarchy_border;',
    '}',
    '',
    'button:hover, row:hover {',
    '  background-color: @omarchy_surface_raised;',
    '}',
    '',
    'button:focus, entry:focus, row:selected {',
    '  outline-color: @omarchy_accent;',
    '  border-color: @omarchy_accent;',
    '}'
  ];

  return `${colorLines.join('\n')}\n${widgetLines.join('\n')}\n`;
}

export function toQtPalette(tokens: SemanticOmarchyTokens): string {
  const semanticLines = Object.entries(tokens).map(([key, value]) => `${key}=${value}`);
  const palette = {
    Window: tokens.background,
    WindowText: tokens.foreground,
    Base: tokens.background,
    AlternateBase: tokens.surface,
    ToolTipBase: tokens.surfaceRaised,
    ToolTipText: tokens.surfaceRaisedForeground,
    Text: tokens.foreground,
    Button: tokens.surface,
    ButtonText: tokens.surfaceForeground,
    BrightText: tokens.dangerForeground,
    Link: tokens.info,
    Highlight: tokens.accent,
    HighlightedText: tokens.accentForeground,
    PlaceholderText: tokens.mutedForeground
  };
  const paletteLines = Object.entries(palette).map(([key, value]) => `${key}=${value}`);

  return `[Omarchy]\n${semanticLines.join('\n')}\n\n[QPalette]\n${paletteLines.join('\n')}\n`;
}

function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function snake(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function constant(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}
