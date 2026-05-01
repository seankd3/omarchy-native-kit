import type { OmarchyTheme, OmarchyTokenName } from './theme.js';

export type AgentCssVariable = {
  token: OmarchyTokenName;
  variable: string;
  value: string;
  useFor: string[];
};

export type OmarchyAgentContext = {
  schemaVersion: 1;
  kit: 'omarchy-native-kit';
  purpose: string;
  theme: {
    name: string | null;
    source: OmarchyTheme['source'];
    warnings: string[];
  };
  cssVariables: AgentCssVariable[];
  designRules: string[];
  componentPatterns: string[];
  commands: {
    syncCss: string;
    printJson: string;
    scaffold: string;
  };
};

const tokenUsage: Record<OmarchyTokenName, string[]> = {
  background: ['app background', 'full-window shells'],
  foreground: ['primary text', 'high-emphasis icons'],
  mutedForeground: ['secondary text', 'metadata', 'disabled text'],
  surface: ['panels', 'menus', 'input backgrounds'],
  surfaceForeground: ['text placed on surface'],
  surfaceRaised: ['hover states', 'active rows', 'elevated panels'],
  surfaceRaisedForeground: ['text placed on raised surfaces'],
  border: ['hairline separators', 'panel outlines'],
  borderStrong: ['focus-adjacent outlines', 'keyboard shortcut keycaps'],
  accent: ['primary actions', 'focus rings', 'selected items'],
  accentForeground: ['text on accent backgrounds'],
  danger: ['destructive actions', 'errors'],
  dangerForeground: ['text on danger backgrounds'],
  success: ['success states', 'ready indicators'],
  successForeground: ['text on success backgrounds'],
  warning: ['caution states', 'pending indicators'],
  warningForeground: ['text on warning backgrounds'],
  info: ['informational states', 'links when accent is already used'],
  infoForeground: ['text on info backgrounds'],
  shadow: ['window shadows', 'depth effects']
};

export function toAgentContext(theme: OmarchyTheme): OmarchyAgentContext {
  return {
    schemaVersion: 1,
    kit: 'omarchy-native-kit',
    purpose:
      'Give coding agents a compact, machine-readable contract for building Omarchy-native interfaces that inherit the user theme.',
    theme: {
      name: theme.name,
      source: theme.source,
      warnings: theme.warnings
    },
    cssVariables: Object.entries(theme.tokens).map(([token, value]) => ({
      token: token as OmarchyTokenName,
      variable: `--omarchy-${kebab(token)}`,
      value,
      useFor: tokenUsage[token as OmarchyTokenName]
    })),
    designRules: [
      'Use the generated --omarchy-* variables instead of hard-coded app colors.',
      'Build keyboard-first command surfaces with visible focus states and stable layout dimensions.',
      'Prefer dense, quiet, utility-focused screens over marketing-style hero pages for tools.',
      'Use semantic status colors only for their named meaning: danger, success, warning, and info.',
      'Keep rounded corners small, avoid nested cards, and let borders plus spacing define structure.',
      'Verify foreground/background pairs with the provided contrast-safe foreground variables.'
    ],
    componentPatterns: [
      'Command palette rows: surface background, raised surface on hover, accent focus ring, kbd using borderStrong.',
      'Status pill: transparent background, semantic foreground, one-word state label.',
      'Panel: surface background, border outline, no decorative gradient or nested card shell.',
      'Toolbar: icon buttons, accent only for selected or primary controls.'
    ],
    commands: {
      syncCss: 'omarchy-native theme css --out src/omarchy-theme.css',
      printJson: 'omarchy-native theme json',
      scaffold: 'omarchy-native create my-app --template react-vite'
    }
  };
}

export function toAgentContextJson(theme: OmarchyTheme): string {
  return `${JSON.stringify(toAgentContext(theme), null, 2)}\n`;
}

export function toAgentPrompt(theme: OmarchyTheme): string {
  const context = toAgentContext(theme);
  const variables = context.cssVariables.map((item) => `- ${item.variable}: ${item.value}`).join('\n');
  const rules = context.designRules.map((rule) => `- ${rule}`).join('\n');
  const patterns = context.componentPatterns.map((pattern) => `- ${pattern}`).join('\n');

  return `You are building an Omarchy-native interface.

Theme: ${context.theme.name ?? 'unknown'}

Use these CSS variables:
${variables}

Design rules:
${rules}

Reusable patterns:
${patterns}

Before finishing, verify keyboard focus states, responsive layout stability, and text contrast.
`;
}

function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
