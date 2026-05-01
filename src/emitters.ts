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

function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function constant(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}
