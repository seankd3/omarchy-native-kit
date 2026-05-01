# Omarchy Native App Research

Date: 2026-04-30

## Sources checked

- `basecamp/omarchy` GitHub repository, dev branch
- Omarchy manual theme section
- Omarchy theme scripts and templates:
  - `bin/omarchy-theme-set`
  - `bin/omarchy-theme-current`
  - `bin/omarchy-hook`
  - `default/themed/*.tpl`
  - `themes/*/colors.toml`
- GitHub issues / PRs around theming, app integrations, GTK, Waybar, Gum, WezTerm, Calibre, Helix

## What Omarchy already does well

Omarchy is not just a config bundle. It has a coherent theming pipeline:

1. User chooses a theme through the Omarchy menu.
2. `omarchy-theme-set <theme>` copies official/user theme files into `~/.config/omarchy/current/theme`.
3. Missing `colors.toml` can be derived from legacy Alacritty theme data.
4. `omarchy-theme-set-templates` renders templates under `default/themed/*.tpl` using current colors.
5. Omarchy restarts or nudges components: Waybar, SwayOSD, terminals, Hyprland, btop, OpenCode, Mako.
6. App-specific integrations update GNOME, browser, VS Code, Obsidian, keyboard lighting.
7. `omarchy-hook theme-set "$THEME_NAME"` lets user automation run after theme switches.

That hook is gold. This project should build around it, not fight it.

## Current theme model

A theme provides `colors.toml` with keys like:

- `accent`
- `cursor`
- `foreground`
- `background`
- `selection_foreground`
- `selection_background`
- `color0` through `color15`

This is close to terminal/base16 color vocabulary. It is enough for terminals and many simple widgets, but apps need semantic roles.

## Community signals

### 1. People want more apps to be themed

Open or recent work exists for:

- Gum dynamic theming (#4467): Omarchy scripts use Gum, but Gum's default pink feels alien.
- Calibre theme integration (#4829): maps `colors.toml` into Qt palette roles and handles restart weirdness.
- WezTerm native support (#4836): another terminal wants template-based dynamic theming.
- Helix terminal-colors integration (#5517): desire for editor/tool consistency.
- GTK theming (#2379, #2944, #5245): visual inconsistency between GTK3/GTK4/libadwaita apps.
- Waybar per-theme config (#1086): custom themes want more than just color variables.

Pattern: every integration solves the same problems by hand — parse colors, map semantics, write app-specific config, restart/reload safely.

### 2. The color system is under pressure

PR #4541 proposes a richer Base24-inspired color system because the current palette is not semantically expressive enough for broad app UI.

PR #4724 centralizes CSS color definitions and fixes import ordering so custom themes can override default styling reliably.

Implication: a third-party app kit should not hard-code current color assumptions too tightly. It should support today's `colors.toml`, but expose semantic tokens and allow future color schema adapters.

### 3. Native-feeling means more than colors

Manual says themes style desktop, terminal, btop, notifications, top bar, launcher, lock screen, browser/VS Code/Obsidian integrations. Community complaints involve app launchers, GTK, hardware acceleration, window behavior, and app restarts.

For Omarchy users, "native" means:

- respects active theme instantly;
- behaves well under Hyprland/Wayland;
- has correct app-id/window class;
- launches from Walker/menu cleanly;
- uses keyboard shortcuts naturally;
- looks good at high DPI;
- does not require manually editing upstream-managed `~/.local/share/omarchy`;
- survives `omarchy-update`.

## Gaps this project can fill

### Gap A: No official developer-facing theme SDK

There are scripts for Omarchy itself, but not a stable public library for app authors. App authors need a small API:

```ts
const theme = await getOmarchyTheme()
const css = toCssVariables(theme)
```

### Gap B: No semantic token bridge

Apps need roles like `surface`, `surfaceRaised`, `border`, `muted`, `danger`, `success`, `warning`, `focusRing`, not just `color4`.

### Gap C: No repeatable hook story

`omarchy-hook theme-set` exists, but app projects need a safe convention for registering per-app theme sync commands without clobbering the user's hook file.

### Gap D: No app template for Omarchy-native local tools

Sean builds lots of local dashboards/tools. Omarchy community likely does too. A template should create:

- app shell;
- theme provider;
- generated CSS;
- `.desktop` file;
- install/uninstall scripts;
- hook registration;
- README explaining Omarchy behavior.

### Gap E: No packaging recommendations

A popular OSS tool needs good DX: npm package first, then AUR/PKGBUILD later.

## Opinionated conclusion

The community does **not** need another theme pack first. It needs a developer kit that makes Omarchy's theming pipeline consumable by app authors.

Best first product: **`omarchy-native` CLI + TypeScript theme runtime + React/Vite starter template**.

Why this first:

- fastest for local apps and dashboards;
- useful before committing to Tauri/Electron/GTK specifics;
- can emit generic JSON/CSS that any stack can consume;
- respects Omarchy's existing hook/template architecture;
- small enough to ship quickly and invite contributors.
