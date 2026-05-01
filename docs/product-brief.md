# Product Brief: Omarchy Native Kit

## One-liner

Make any local app feel like it was born inside Omarchy.

## Target users

1. Omarchy power users building personal dashboards, launchers, tools, and automations.
2. Open-source app authors who want their app to look good on Omarchy without learning every config detail.
3. Theme authors who want apps to consume their colors consistently.
4. Omarchy contributors tired of every app integration reinventing parsing/restart/glue logic.

## Core promise

If a user switches from Tokyo Night to Osaka Jade, apps built with this kit should follow automatically — no hard-coded colors, no manual CSS edits, no upstream config hacks.

## MVP scope

- Detect Omarchy install and current theme.
- Parse `colors.toml` without external system dependencies.
- Produce semantic tokens.
- Emit CSS variables and JSON.
- Provide a tiny CLI.
- Provide React/Vite template.
- Provide docs for hook integration.

## Non-goals for MVP

- Full GTK/libadwaita framework.
- Full Qt palette support.
- Tauri packaging.
- AUR packaging.
- Replacing Omarchy theme scripts.
- Modifying `~/.local/share/omarchy`.

## Design values

- **Theme-first:** app styling derives from user theme.
- **Omarchy-safe:** write only to app files or safe user config locations.
- **Composable:** emit CSS/JSON so any framework can use it.
- **Keyboard-first:** templates assume command palette and fast navigation.
- **Small:** no giant Electron opinion unless the user opts in.
- **Contributor-friendly:** clear token schema, fixtures, tests.

## Naming candidates

Best: **Omarchy Native Kit** / npm package `omarchy-native`.

Alternates:

- `omarchy-appkit`
- `omarchy-ui`
- `native-to-omarchy`
- `omarchykit`

Recommendation: keep repo as `omarchy-native-kit`, package binary as `omarchy-native`.

## Roadmap

### Phase 0: Research + spec

- Document current Omarchy theming pipeline.
- Define token schema v0.
- Create scaffold repo.

### Phase 1: Theme runtime + CLI

- `getCurrentTheme()`
- `parseColorsToml()`
- `mapToSemanticTokens()`
- `toCssVariables()`
- `toJson()`
- CLI commands: `theme json`, `theme css`, `doctor`

### Phase 2: Starter template

- React/Vite template using generated CSS.
- App shell components.
- `.desktop` generation docs/script.
- theme sync npm scripts.

### Phase 3: Hook manager

- Safe per-app hook registry under `~/.config/omarchy/apps/`.
- One user hook delegates to registered app hooks.
- Avoid clobbering existing `~/.config/omarchy/hooks/theme-set`.

### Phase 4: Native shells

- Tauri template.
- GTK CSS emitter.
- Qt palette emitter.

### Phase 5: Distribution

- npm package.
- docs site.
- example apps.
- AUR package.
