# Omarchy Native Kit

Scaffolding and theme utilities for apps that should feel native to [Omarchy](https://omarchy.org): theme-aware, keyboard-first, and aligned with the user's current Omarchy palette.

This repo ships a small TypeScript library, a CLI, a React/Vite starter template, agent contracts, app verification, app cataloging, launcher generation, parser fixtures, and dogfood apps.

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
omarchy-native app catalog ./examples
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
omarchy-native verify ./app-one ./app-two
omarchy-native verify --all ./examples
omarchy-native verify --all ./examples --build
omarchy-native verify ./my-app --json
```

The verifier checks package metadata, theme refresh scripts, blueprint identity, the blueprint contract, required blueprint files, generated theme CSS, theme/style import order, and obvious hard-coded hex colors outside generated theme files. Pass `--build` when you also want verification to run `npm run build` for every target app.

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

Catalog a directory of Omarchy-native apps:

```bash
omarchy-native app catalog ./examples
omarchy-native app catalog ./examples --json
```

The catalog scans for `omarchy-blueprint.json`, verifies each app contract, and reports app name, kind, path, file count, and acceptance check count.

The first dogfood output is committed under `examples/hello-omarchy-native`.
`examples/accessibility-contrast-auditor` is a studio dogfood app for inspecting contrast, focus rings, reduced-motion behavior, font scaling, and pointer target sizes across Omarchy-native app surfaces.
`examples/agent-context-lab` is a richer dogfood app that turns the agent context contract into a compact Omarchy-native build workspace.
`examples/signal-desk` is a dashboard dogfood app generated from an agent blueprint.
`examples/theme-forge` is a studio dogfood app for inspecting semantic tokens and export targets.
`examples/hook-station` is a studio dogfood app for reviewing safe theme sync hook scripts before export.
`examples/workspace-radar` is a dashboard dogfood app for scanning workspaces, windows, and keybindings.
`examples/prompt-foundry` is a studio dogfood app for composing Omarchy-native app-building prompts.
`examples/native-gallery` is a studio dogfood app for browsing verified apps and copying blueprint recipes.
`examples/release-console` is a dashboard dogfood app for release dry-runs, catalog snapshots, and publish prep.
`examples/aur-packager` is a studio dogfood app for staging Arch/AUR package metadata and validation.
`examples/theme-migration-lab` is a studio dogfood app for comparing theme changes before rollout.
`examples/ops-deck` is a dashboard dogfood app for daily catalog, release, and rollout operations.
`examples/docs-reader` is a command-center dogfood app for browsing local docs, commands, and blueprints.
`examples/app-health-monitor` is a dashboard dogfood app for verifier results and blueprint drift.
`examples/shortcut-trainer` is a command-center dogfood app for practicing keyboard chords and focus checks.
`examples/focus-flight-recorder` is a studio dogfood app for capturing keyboard navigation paths and focus landings.
`examples/window-rule-lab` is a studio dogfood app for drafting window/workspace rules before live config changes.
`examples/config-diff-studio` is a studio dogfood app for staging reversible Omarchy config patch previews.
`examples/session-restore-planner` is a dashboard dogfood app for modeling startup apps, workspaces, and restore order.
`examples/portal-permission-center` is a studio dogfood app for reviewing portals, default handlers, and desktop integration permissions.
`examples/backup-restore-console` is a dashboard dogfood app for checking backup coverage, restore points, and rollback readiness.
`examples/notification-routing-board` is a dashboard dogfood app for designing notification routes, quiet hours, and escalation rules.
`examples/power-profile-switchboard` is a dashboard dogfood app for tuning power profiles, brightness, idle behavior, and performance modes per workspace.
`examples/audio-device-mixer` is a dashboard dogfood app for routing microphones, speakers, per-app volume, and meeting presets.
`examples/network-profile-mapper` is a dashboard dogfood app for mapping trusted networks, VPN posture, DNS profiles, and workspace connectivity rules.
`examples/display-layout-planner` is a dashboard dogfood app for planning monitor arrangements, scaling, color temperature, and workspace placement.
`examples/input-method-studio` is a studio dogfood app for configuring keyboards, pointer devices, layout variants, repeat rates, and workspace behavior.
`examples/workspace-automation-builder` is a studio dogfood app for composing workspace triggers, app launch rules, hooks, and rollback-safe recipes.
`examples/credential-session-vault` is a studio dogfood app for staging session secrets, SSH agents, keyring readiness, and workspace credential exposure.
`examples/clipboard-history-curator` is a studio dogfood app for reviewing clipboard history, redacting secrets, pinning snippets, and routing copied content.
`examples/desktop-entry-inspector` is a studio dogfood app for auditing `.desktop` launchers, categories, icons, actions, startup hints, and app identity metadata across generated and installed Omarchy apps.
`examples/package-update-coordinator` is a dashboard dogfood app for planning package updates, pinning holds, comparing risky upgrades, and scheduling rollback-safe maintenance windows.
`examples/journal-timeline-inspector` is a studio dogfood app for inspecting logs across boots, correlating service failures with updates, and saving annotated incident timelines.
`examples/service-restart-orchestrator` is a dashboard dogfood app for planning systemd user and system service restarts, previewing dependency impact, and scheduling safe restart batches.
`examples/environment-variable-auditor` is a studio dogfood app for inspecting shell, desktop, and service environments, comparing mismatched variables, and staging clean export fixes.
`examples/locale-timezone-manager` is a dashboard dogfood app for comparing locale, timezone, keyboard, and clock settings across shells, desktop sessions, and services before applying changes.
`examples/font-rendering-tuner` is a studio dogfood app for comparing font stacks, antialiasing, hinting, and scaling behavior across GTK, Qt, browser, and terminal surfaces.
`examples/cursor-pointer-theme-studio` is a studio dogfood app for comparing cursor themes, pointer sizes, acceleration, and touchpad behavior across compositor, GTK, Qt, and browser surfaces.
`examples/icon-theme-coordinator` is a studio dogfood app for comparing icon themes, symbolic icon coverage, launcher glyphs, and file-manager fallbacks across GTK, Qt, browser, and shell surfaces.
`examples/mime-defaults-workbench` is a studio dogfood app for auditing MIME defaults, opener precedence, portal handoffs, browser handlers, and rollback-safe association changes.
`examples/portal-file-picker-lab` is a studio dogfood app for inspecting file chooser portals, recent-file exposure, sandbox handoffs, and per-app document access expectations.

## Development

```bash
npm run build
npm run typecheck
npm test
npm run catalog:examples
npm run verify:examples
npm run verify:examples:build
```

Tests use Node's built-in test runner and fixtures under `tests/fixtures`.
`verify:examples` runs the fast contract gate. `verify:examples:build` also runs every dogfood app build and is the stronger pre-release handoff check.
`docs/ci.workflow.yml` contains a ready-to-install GitHub Actions workflow for typecheck, test, and package dry-run verification.
`docs/ecosystem.md` maps the current kit, examples, build loop, and next app ideas.
`docs/release-checklist.md` covers pre-publish verification.

## Repository Layout

- `src/theme.ts` - theme discovery, parser, validation, and semantic token mapping
- `src/color.ts` - hex validation, blending, contrast, and readable foreground helpers
- `src/emitters.ts` - CSS, JSON, shell, GTK, and Qt emitters
- `src/agent.ts` - machine-readable and prompt-ready agent context
- `src/catalog.ts` - blueprint-backed app catalog generation
- `src/cli.ts` - `doctor`, theme emitters/sync/watch, agent context commands, `create`, `verify`, and app helper commands
- `src/desktop.ts` - `.desktop` launcher entry generation
- `src/hooks.ts` - opt-in theme hook script generation
- `src/verify.ts` - app contract verification for generated Omarchy-native apps
- `templates/react-vite` - starter app template
- `examples/hello-omarchy-native` - generated dogfood app
- `examples/accessibility-contrast-auditor`, `examples/agent-context-lab`, `examples/signal-desk`, `examples/theme-forge`, `examples/shortcut-trainer`, `examples/focus-flight-recorder`, `examples/window-rule-lab`, `examples/config-diff-studio`, `examples/session-restore-planner`, `examples/portal-permission-center`, `examples/backup-restore-console`, `examples/notification-routing-board`, `examples/power-profile-switchboard`, `examples/audio-device-mixer`, `examples/network-profile-mapper`, `examples/display-layout-planner`, `examples/input-method-studio`, `examples/workspace-automation-builder`, `examples/credential-session-vault`, `examples/clipboard-history-curator`, `examples/desktop-entry-inspector`, `examples/package-update-coordinator`, `examples/journal-timeline-inspector`, `examples/service-restart-orchestrator`, `examples/environment-variable-auditor`, `examples/locale-timezone-manager`, `examples/font-rendering-tuner`, `examples/cursor-pointer-theme-studio`, `examples/icon-theme-coordinator`, `examples/mime-defaults-workbench`, `examples/portal-file-picker-lab` - richer dogfood apps
- `docs/` - preserved research, product, architecture, and implementation notes

## Current Scope

This MVP covers CSS, JSON, shell, GTK, and Qt token output, live theme syncing, agent context, app blueprints, React/Vite scaffolding, generated app verification, `.desktop` launcher generation, opt-in hook script generation, and dogfood apps. Future work can add visual regression checks, npm publishing, and AUR packaging.
