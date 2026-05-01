# Omarchy Native Kit

Scaffolding and theme utilities for apps that should feel native to [Omarchy](https://omarchy.org): theme-aware, keyboard-first, and aligned with the user's current Omarchy palette.

This repo now ships a small TypeScript library, a CLI, a React/Vite starter template, parser fixtures, and a generated dogfood app.

## Install

```bash
npm install
npm run build
```

Use the local CLI while developing:

```bash
node dist/cli.js doctor
node dist/cli.js theme json
node dist/cli.js theme css --out ./omarchy-theme.css
node dist/cli.js create my-app --template react-vite
```

After package installation, the binary name is:

```bash
omarchy-native doctor
```

## Commands

```bash
omarchy-native doctor
omarchy-native theme json
omarchy-native theme css --out src/omarchy-theme.css
omarchy-native agent json
omarchy-native agent prompt
omarchy-native create hello-omarchy-native --template react-vite
```

All theme commands read inside `~/.config/omarchy/current/theme` by default, primarily `colors.toml` and optionally `theme.name` if present in that directory. For tests or deterministic generation, pass `--colors <path>` or `--theme-dir <path>`.

The CLI only reads Omarchy's current theme path. It does not write to `~/.config/omarchy` or `~/.local/share/omarchy`.

## Library

```ts
import {
  readOmarchyTheme,
  mapSemanticTokens,
  toCssVariables,
  toJsonTheme
} from 'omarchy-native-kit';

const theme = readOmarchyTheme();
const css = toCssVariables(theme.tokens);
const json = toJsonTheme(theme);
```

The stable token payload uses `schemaVersion: 1` and exposes semantic roles:

- background, foreground, mutedForeground
- surface, surfaceForeground, surfaceRaised, surfaceRaisedForeground
- border, borderStrong, shadow
- accent, danger, success, warning, info plus contrast-safe foregrounds for each

The color helpers validate six-digit hex colors, compute WCAG-style contrast ratios, blend colors, and choose readable foregrounds when an Omarchy palette has low contrast.

## Agent Context

Omarchy Native Kit includes an agent-facing contract so coding assistants can build on the user's active Omarchy palette without scraping README prose.

```bash
omarchy-native agent json
omarchy-native agent prompt
```

`agent json` emits `schemaVersion: 1`, CSS variable mappings, suggested token uses, design rules, component patterns, and canonical kit commands. `agent prompt` emits the same guidance as a compact natural-language brief for coding agents.

## React/Vite Template

The starter lives in `templates/react-vite`.

```bash
node dist/cli.js create examples/hello-omarchy-native --template react-vite --colors tests/fixtures/colors.basic.toml
```

Generated apps import `src/omarchy-theme.css` before `src/styles.css` and use variables such as:

```css
--omarchy-background
--omarchy-foreground
--omarchy-surface
--omarchy-accent
```

The first dogfood output is committed under `examples/hello-omarchy-native`.

## Development

```bash
npm run build
npm run typecheck
npm test
```

Tests use Node's built-in test runner and fixtures under `tests/fixtures`.

## Repository Layout

- `src/theme.ts` - theme discovery, parser, validation, and semantic token mapping
- `src/color.ts` - hex validation, blending, contrast, and readable foreground helpers
- `src/emitters.ts` - CSS and JSON emitters
- `src/agent.ts` - machine-readable and prompt-ready agent context
- `src/cli.ts` - `doctor`, `theme json`, `theme css`, `agent json`, `agent prompt`, and `create`
- `templates/react-vite` - starter app template
- `examples/hello-omarchy-native` - generated dogfood app
- `docs/` - preserved research, product, architecture, and implementation notes

## Current Scope

This MVP covers CSS and JSON token output plus a React/Vite starter. Future work can add file watching, hook installation, shell exports, GTK/Qt emitters, and richer app primitives.
