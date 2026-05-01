import type { OmarchyTheme, SemanticOmarchyTokens } from './theme.js';

export function toCssVariables(tokens: SemanticOmarchyTokens, selector = ':root'): string {
  const lines = Object.entries(tokens).map(([key, value]) => `  --omarchy-${kebab(key)}: ${value};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

export function toJsonTheme(theme: OmarchyTheme): string {
  return `${JSON.stringify(theme, null, 2)}\n`;
}

function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
