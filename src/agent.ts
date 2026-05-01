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
    blueprint: string;
    scaffold: string;
  };
};

export type AgentBlueprintKind = 'command-center' | 'dashboard' | 'studio';

export type AgentBlueprintRegion = {
  name: string;
  purpose: string;
  tokens: OmarchyTokenName[];
};

export type AgentBlueprintComponent = {
  name: string;
  purpose: string;
  tokens: OmarchyTokenName[];
  interactions: string[];
};

export type OmarchyAgentBlueprint = {
  schemaVersion: 1;
  kit: 'omarchy-native-kit';
  appName: string;
  kind: AgentBlueprintKind;
  themeName: string | null;
  files: string[];
  layoutRegions: AgentBlueprintRegion[];
  components: AgentBlueprintComponent[];
  acceptanceChecks: string[];
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
      blueprint: 'omarchy-native agent blueprint --app my-app --kind command-center',
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

export function toAgentBlueprint(theme: OmarchyTheme, options: { appName?: string; kind?: string } = {}): OmarchyAgentBlueprint {
  const kind = parseBlueprintKind(options.kind);
  const appName = cleanAppName(options.appName);
  const profile = blueprintProfiles[kind];

  return {
    schemaVersion: 1,
    kit: 'omarchy-native-kit',
    appName,
    kind,
    themeName: theme.name,
    files: [
      'src/omarchy-theme.css',
      'src/App.tsx',
      'src/styles.css',
      'src/main.tsx',
      'README.md'
    ],
    layoutRegions: profile.layoutRegions,
    components: profile.components,
    acceptanceChecks: [
      'Generated app imports src/omarchy-theme.css before app styles.',
      'Every visible color comes from a --omarchy-* CSS variable or color-mix using one.',
      'Every button, row, input, and command item has a visible :focus-visible state.',
      'Layout remains stable at 320px, 768px, and 1280px viewport widths.',
      'Primary content is usable on first load without a marketing interstitial.',
      'A .desktop launcher can be generated with omarchy-native app desktop.',
      'npm run build completes successfully.'
    ]
  };
}

export function toAgentBlueprintJson(theme: OmarchyTheme, options: { appName?: string; kind?: string } = {}): string {
  return `${JSON.stringify(toAgentBlueprint(theme, options), null, 2)}\n`;
}

function parseBlueprintKind(value: string | undefined): AgentBlueprintKind {
  if (value === 'dashboard' || value === 'studio' || value === 'command-center') return value;
  return 'command-center';
}

function cleanAppName(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed || 'omarchy-native-app';
}

const blueprintProfiles: Record<
  AgentBlueprintKind,
  Pick<OmarchyAgentBlueprint, 'layoutRegions' | 'components'>
> = {
  'command-center': {
    layoutRegions: [
      {
        name: 'topbar',
        purpose: 'App identity, active workspace, and one primary action.',
        tokens: ['surface', 'surfaceForeground', 'border', 'accent']
      },
      {
        name: 'command-list',
        purpose: 'Keyboard-first rows for high-frequency actions.',
        tokens: ['surface', 'surfaceRaised', 'border', 'accent', 'mutedForeground']
      },
      {
        name: 'inspector',
        purpose: 'Contextual details for the selected command or object.',
        tokens: ['background', 'surface', 'borderStrong', 'info']
      }
    ],
    components: [
      {
        name: 'CommandRow',
        purpose: 'A stable-height action row with shortcut, label, status, and focus ring.',
        tokens: ['surface', 'surfaceRaised', 'surfaceForeground', 'accent', 'border'],
        interactions: ['hover raises surface', 'focus outlines with accent', 'enter activates']
      },
      {
        name: 'StatusPill',
        purpose: 'Compact semantic status label for ready, warning, error, or info states.',
        tokens: ['success', 'warning', 'danger', 'info'],
        interactions: ['uses text color only', 'does not steal focus']
      },
      {
        name: 'Keycap',
        purpose: 'Readable keyboard shortcut indicator.',
        tokens: ['background', 'accent', 'borderStrong'],
        interactions: ['fixed width when possible', 'wraps long chords without resizing row height']
      }
    ]
  },
  dashboard: {
    layoutRegions: [
      {
        name: 'metric-strip',
        purpose: 'Dense glanceable numbers for current system or workflow state.',
        tokens: ['surface', 'surfaceForeground', 'border', 'success', 'warning']
      },
      {
        name: 'activity-table',
        purpose: 'Sortable rows for recent events, jobs, or records.',
        tokens: ['surface', 'surfaceRaised', 'border', 'mutedForeground']
      },
      {
        name: 'side-panel',
        purpose: 'Filters and focused details without leaving the dashboard.',
        tokens: ['background', 'surface', 'borderStrong', 'accent']
      }
    ],
    components: [
      {
        name: 'MetricTile',
        purpose: 'Small fixed-format tile with label, value, and semantic delta.',
        tokens: ['surface', 'surfaceForeground', 'mutedForeground', 'success', 'danger'],
        interactions: ['focusable when it drills down', 'keeps value from shifting neighboring tiles']
      },
      {
        name: 'DataRow',
        purpose: 'Scannable table row with selected and hover states.',
        tokens: ['surface', 'surfaceRaised', 'accent', 'border'],
        interactions: ['hover raises surface', 'selected row uses accent rail', 'enter opens details']
      },
      {
        name: 'FilterToggle',
        purpose: 'Binary dashboard filter with clear active state.',
        tokens: ['surface', 'accent', 'accentForeground', 'border'],
        interactions: ['space toggles', 'active state uses accent background']
      }
    ]
  },
  studio: {
    layoutRegions: [
      {
        name: 'tool-rail',
        purpose: 'Icon-first mode switching for creation tools.',
        tokens: ['surface', 'surfaceRaised', 'border', 'accent']
      },
      {
        name: 'canvas',
        purpose: 'Primary creative work area with a quiet background.',
        tokens: ['background', 'border', 'shadow']
      },
      {
        name: 'properties-panel',
        purpose: 'Controls for the selected object or generation pass.',
        tokens: ['surface', 'surfaceForeground', 'borderStrong', 'info']
      }
    ],
    components: [
      {
        name: 'ToolButton',
        purpose: 'Square icon button with tooltip text and selected state.',
        tokens: ['surface', 'surfaceRaised', 'accent', 'accentForeground'],
        interactions: ['selected state uses accent', 'focus outlines with accent', 'tooltip appears on hover']
      },
      {
        name: 'CanvasFrame',
        purpose: 'Full-bleed or dominant work area without decorative card nesting.',
        tokens: ['background', 'border', 'shadow'],
        interactions: ['preserves aspect ratio', 'does not shift when selection changes']
      },
      {
        name: 'PropertyControl',
        purpose: 'Label, input, slider, or toggle for editing selected state.',
        tokens: ['surface', 'foreground', 'mutedForeground', 'accent', 'border'],
        interactions: ['tab order follows visual order', 'value changes are visible immediately']
      }
    ]
  }
};

function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
