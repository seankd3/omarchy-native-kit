# Omarchy Native Kit

Scaffolding and theme utilities for apps that should feel native to [Omarchy](https://omarchy.org): theme-aware, keyboard-first, and aligned with the user's current Omarchy palette.

This repo ships a small TypeScript library, a CLI, a React/Vite starter template, agent contracts, app verification, launcher generation, parser fixtures, and dogfood apps.

## Install

```bash
npm install
npm run build
```

Use the local CLI while developing:

```bash
node dist/cli.js doctor
node dist/cli.js theme json
node dist/cli.js theme sync --out ./omarchy-theme.css
node dist/cli.js create my-app --template react-vite --kind dashboard
node dist/cli.js verify my-app
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
omarchy-native theme shell --out omarchy-theme.env
omarchy-native theme gtk --out gtk.css
omarchy-native theme qt --out qt.ini
omarchy-native theme sync --out src/omarchy-theme.css
omarchy-native theme watch --out src/omarchy-theme.css
omarchy-native agent json
omarchy-native agent prompt
omarchy-native agent blueprint --app signal-desk --kind dashboard
omarchy-native create hello-omarchy-native --template react-vite --kind dashboard
omarchy-native verify ./hello-omarchy-native
omarchy-native app desktop ./hello-omarchy-native --out hello-omarchy-native.desktop
omarchy-native app hook ./hello-omarchy-native --out theme-set
```

All theme commands read inside `~/.config/omarchy/current/theme` by default, primarily `colors.toml` and optionally `theme.name` if present in that directory. For tests or deterministic generation, pass `--colors <path>` or `--theme-dir <path>`.

The CLI only reads Omarchy's current theme path. It does not write to `~/.config/omarchy` or `~/.local/share/omarchy`.

Use `theme sync` for a one-shot refresh and `theme watch` while developing an app:

```bash
omarchy-native theme sync --out src/omarchy-theme.css
omarchy-native theme watch --out src/omarchy-theme.css
```

Use `theme shell` when scripts need environment variables:

```bash
omarchy-native theme shell
omarchy-native theme shell --prefix APP --out omarchy-theme.env
```

Use `theme gtk` for GTK/libadwaita-adjacent CSS experiments:

```bash
omarchy-native theme gtk
omarchy-native theme gtk --out gtk.css
```

Use `theme qt` for Qt/PySide palette experiments:

```bash
omarchy-native theme qt
omarchy-native theme qt --out qt.ini
```

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
omarchy-native agent blueprint --app signal-desk --kind dashboard
```

`agent json` emits `schemaVersion: 1`, CSS variable mappings, suggested token uses, design rules, component patterns, and canonical kit commands. `agent prompt` emits the same guidance as a compact natural-language brief for coding agents.
`agent blueprint` emits a structured app plan with files, layout regions, component recipes, token roles, and acceptance checks. Supported blueprint kinds are `command-center`, `dashboard`, and `studio`.

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

Generated apps also include `omarchy-blueprint.json`, so coding agents can keep the target layout, component recipes, token roles, and acceptance checks in the app repo while they build.

Verify an app contract after generation or agent edits:

```bash
omarchy-native verify ./my-app
omarchy-native verify ./my-app --json
```

The verifier checks package metadata, the blueprint contract, required blueprint files, generated theme CSS, and theme/style import order.

Generate a launcher entry without installing it:

```bash
omarchy-native app desktop ./my-app --out my-app.desktop
```

The generated `.desktop` file defaults to running the app preview with `npm --prefix <app> run preview -- --host 127.0.0.1`. Pass `--exec`, `--icon`, `--name`, or `--categories Utility,Graphics` to customize it.

Generate a theme sync hook script without installing it:

```bash
omarchy-native app hook ./my-app --out theme-set
```

The hook script runs `omarchy-native theme sync --out <app>/src/omarchy-theme.css`. Review it, then wire it into your preferred Omarchy hook workflow manually.

The first dogfood output is committed under `examples/hello-omarchy-native`.
`examples/agent-context-lab` is a richer dogfood app that turns the agent context contract into a compact Omarchy-native build workspace.
`examples/signal-desk` is a dashboard dogfood app generated from an agent blueprint.
`examples/theme-forge` is a studio dogfood app for inspecting semantic tokens and export targets.

## Development

```bash
npm run build
npm run typecheck
npm test
npm run verify:examples
```

Tests use Node's built-in test runner and fixtures under `tests/fixtures`.
`docs/ci.workflow.yml` contains a ready-to-install GitHub Actions workflow for typecheck, test, and package dry-run verification.
`docs/ecosystem.md` maps the current kit, examples, build loop, and next app ideas.
`docs/release-checklist.md` covers pre-publish verification.

## Repository Layout

- `src/theme.ts` - theme discovery, parser, validation, and semantic token mapping
- `src/color.ts` - hex validation, blending, contrast, and readable foreground helpers
- `src/emitters.ts` - CSS, JSON, shell, GTK, and Qt emitters
- `src/agent.ts` - machine-readable and prompt-ready agent context
- `src/cli.ts` - `doctor`, `theme json`, `theme css`, `agent json`, `agent prompt`, `agent blueprint`, `create`, and `verify`
- `src/desktop.ts` - `.desktop` launcher entry generation
- `src/hooks.ts` - opt-in theme hook script generation
- `src/verify.ts` - app contract verification for generated Omarchy-native apps
- `templates/react-vite` - starter app template
- `examples/hello-omarchy-native` - generated dogfood app
- `examples/agent-context-lab`, `examples/signal-desk`, `examples/theme-forge` - richer dogfood apps
- `docs/` - preserved research, product, architecture, and implementation notes

## Current Scope

This MVP covers CSS, JSON, shell, GTK, and Qt token output, live theme syncing, agent context, app blueprints, React/Vite scaffolding, generated app verification, `.desktop` launcher generation, opt-in hook script generation, and dogfood apps. Future work can add visual regression checks, npm publishing, and AUR packaging.
