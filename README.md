# Omarchy Native Kit

A framework/scaffolding project for building apps that feel native to [Omarchy](https://omarchy.org): theme-aware, Hyprland-friendly, keyboard-first, and aesthetically aligned with the user's current Omarchy theme instead of hard-coding colors.

## Why this should exist

Omarchy has a strong visual identity, but third-party apps and local tools usually miss it. Current Omarchy theming is excellent for first-party components — terminal, Waybar, Walker, Mako, Hyprlock, btop, browser, VS Code, Obsidian — but every new app author has to rediscover:

- where the current theme lives;
- how `colors.toml` maps to UI roles;
- how to react to `omarchy-hook theme-set`;
- how to make GTK/Qt/web/Tauri apps look coherent;
- how to package a small local app so it launches like an Omarchy citizen.

This project aims to become the missing developer kit.

## Product shape

### 1. Theme runtime

A small library + CLI that reads the current Omarchy theme and emits native app tokens.

Inputs:

- `~/.config/omarchy/current/theme/colors.toml`
- `~/.config/omarchy/current/theme.name`
- light/dark markers when present
- optional app overrides under `~/.config/omarchy/apps/<app-id>/`

Outputs:

- CSS custom properties for web/Tauri/Electron apps
- JSON tokens for any runtime
- shell exports for TUI scripts
- future: GTK CSS, Qt palette helpers, Tailwind preset

### 2. App scaffold

A generator for apps that should feel Omarchy-native from minute one:

- Vite/Tauri-style web app template
- keyboard-first layout primitives
- theme token loading
- Hyprland window/app-id conventions
- `.desktop` file generation
- theme-change hook installation
- sane typography using the active Omarchy font where discoverable

### 3. Design system

Opinionated primitives that match the Omarchy vibe without copying one theme:

- panels, command menus, cards, status pills, forms
- terminal-adjacent spacing and borders
- background/accent/foreground derived from Omarchy colors
- accessible contrast checks and fallbacks

## First command sketches

```bash
# Print current Omarchy theme as JSON
omarchy-native theme json

# Generate CSS variables for an app
omarchy-native theme css --out ./src/omarchy-theme.css

# Watch theme changes and regenerate outputs
omarchy-native theme watch --css ./src/omarchy-theme.css

# Create a starter app
omarchy-native create my-app --template react-vite

# Install a theme-set hook for an app
omarchy-native hook install --app my-app --cmd 'npm run theme:sync'
```

## Repository layout

- `src/theme.ts` — current theme discovery and token mapping
- `src/cli.ts` — CLI entrypoint sketch
- `docs/research.md` — research notes from Omarchy repo/manual/community signals
- `docs/product-brief.md` — what the community likely needs
- `docs/architecture.md` — proposed technical architecture
- `docs/implementation-plan.md` — first build plan
- `templates/react-vite/` — starter template placeholder

## Status

Seed project. Research and architecture first; implementation next.
