# Omarchy Native Kit Launch Roadmap

> Build apps that feel born inside Omarchy — theme-native, keyboard-first, agent-readable.

## North Star

Omarchy Native Kit should become the default way humans and agents scaffold Omarchy-native applications.

The kit wins if:

- Omarchy users can create a beautiful theme-aware local app in minutes.
- App authors can consume the user's active Omarchy theme without hardcoding colors.
- Coding agents can read a stable contract and generate apps that pass verification.
- The ecosystem has examples, docs, marketing copy, screenshots, and a clear contribution path.

## Core Positioning

**One-liner:** Make any local app feel like it was born inside Omarchy.

**Promise:** Stop hardcoding dark mode. Let the desktop theme the app.

**Audience:**

1. Omarchy users building personal tools.
2. Linux/Hyprland app authors who want better desktop integration.
3. Coding agents that need deterministic UI/theme rules.
4. Theme authors and distro/community contributors.

## Product Pillars

### 1. Theme Runtime

Stable library and CLI for reading Omarchy theme data and emitting usable artifacts.

Must be excellent:

- `omarchy-native theme json`
- `omarchy-native theme css`
- `omarchy-native theme shell`
- `omarchy-native theme gtk`
- `omarchy-native theme qt`
- predictable semantic token schema
- contrast-safe foreground choices
- fixtures for real Omarchy themes

### 2. App Scaffolder

A developer can run one command and get a working app.

Must be excellent:

- `omarchy-native create my-app --template react-vite --kind dashboard`
- clean app shell
- theme sync script
- command palette / keyboard-first layout
- README generated with exact commands
- verifier passes immediately

### 3. Agent Contract

Agents should not guess. The kit should tell them how to build native-feeling apps.

Must be excellent:

- `omarchy-native agent json`
- `omarchy-native agent prompt`
- `omarchy-native agent blueprint --app <name> --kind <kind>`
- acceptance checks agents can run
- anti-patterns: hardcoded colors, low contrast, mouse-only UI, theme mutation

### 4. Verifier + Catalog

The kit should prove an app follows the covenant.

Must be excellent:

- `omarchy-native verify <app>`
- `omarchy-native verify --all examples`
- `omarchy-native app catalog examples`
- checks for token usage, generated CSS, package metadata, launcher metadata, docs
- machine-readable output for agents and CI

### 5. Ecosystem Examples

Examples should not be toy sludge. They should demonstrate useful Omarchy desktop tools.

Priority examples:

1. Native Gallery — browse verified Omarchy-native apps.
2. Theme Forge — inspect/export active theme tokens.
3. Workspace Radar — workspace/window/keybinding dashboard.
4. App Health Monitor — verifier dashboard for examples.
5. Desktop Entry Inspector — audit app launcher metadata.
6. Secret Service Inspector — credential/keyring safety surface.

## Build Phases

### Phase A — Package Hardening

Goal: make the current package trustworthy enough for external users.

Tasks:

- Ensure `npm test` and `npm run build` pass cleanly.
- Remove or finish partial dirty example work.
- Confirm `files` includes everything needed for npm package users.
- Add `npm pack --dry-run` verification to release checklist.
- Add CLI smoke tests for `doctor`, `theme json`, `agent json`, `create`, and `verify`.
- Commit in small atoms.

Exit criteria:

- Clean tree.
- Full tests pass.
- Release checklist says package can be dry-run packed.

### Phase B — First Public Release Candidate

Goal: create a usable `0.1.0`.

Tasks:

- Decide package name and binary name.
- Update README quickstart for outside users.
- Add screenshots/GIF capture plan.
- Add `docs/getting-started.md`.
- Add `docs/agent-guide.md`.
- Add `docs/theme-token-schema.md`.
- Tag release candidate locally.

Exit criteria:

- New user can create and verify an app from README alone.
- Agent can build from `agent prompt` without reading the whole repo.

### Phase C — Website + Demo Assets

Goal: make the project explainable and shareable.

Tasks:

- Create landing page copy.
- Capture screenshots of 3 example apps under current Omarchy theme.
- Record short demo: switch theme, app follows.
- Add comparison: hardcoded app vs Omarchy-native app.
- Publish GitHub Pages or simple docs site.

Exit criteria:

- Link can be shared publicly and understood in 30 seconds.

### Phase D — Community Launch

Goal: get real users, not vanity stars only.

Tasks:

- Write launch post for Omarchy/Hyprland/Linux communities.
- Write agent-builder post: “How to make coding agents generate native-feeling Omarchy apps.”
- Open good first issues.
- Add contribution guide for new templates/examples.
- Ask early users to try scaffolding one app and report friction.

Exit criteria:

- At least 3 outside users try it.
- At least 1 issue/PR from outside Sean/Keryx loop.

### Phase E — Ecosystem Expansion

Goal: make this a small standard.

Tasks:

- Add Tauri template.
- Add GTK/libadwaita example.
- Add Qt/PySide example.
- Add AUR packaging path.
- Add app gallery index.
- Add plugin hooks for agents/Forge-style workflows.

Exit criteria:

- Kit supports web, native shell, and agent-generated apps with same token contract.

## Marketing Angles

### For Omarchy users

“Your apps should change when your theme changes.”

### For app builders

“Ship one app that respects every Omarchy theme.”

### For agent builders

“Give agents a design contract they can actually follow.”

### For Linux hackers

“A tiny bridge between desktop theming and local-first apps.”

## Public Launch Checklist

- [ ] Repo clean and pushed.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm pack --dry-run` reviewed.
- [ ] README quickstart tested from fresh temp dir.
- [ ] At least 3 polished screenshots.
- [ ] 60-second demo GIF/video.
- [ ] `docs/getting-started.md` exists.
- [ ] `docs/agent-guide.md` exists.
- [ ] `docs/theme-token-schema.md` exists.
- [ ] GitHub topics set: `omarchy`, `hyprland`, `linux`, `themes`, `design-tokens`, `agents`.
- [ ] Issues seeded: starter template, Tauri template, GTK example, docs polish.

## Daily Progress Policy

Until first public release, daily code progress should prefer `omarchy-native-kit` unless another project has an urgent blocker.

Daily acceptable commits:

- one verifier check
- one CLI smoke test
- one docs page
- one example polish pass
- one release checklist improvement
- one template fix
- one agent-contract improvement

Unacceptable commits:

- timestamp churn
- giant mixed example dumps
- unverified generated code
- marketing copy that overpromises beyond working code

## First Three Soldiers

1. **Package hardener** — make build/test/pack dry-run clean and documented.
2. **Getting-started writer** — create docs a new user can follow from zero.
3. **Demo gardener** — polish Native Gallery + Theme Forge screenshots for launch.

## Theology Of The Work

Good tools help people make good things with less friction. Beauty and order are not decoration; they are signs of care. This project should serve users and agents by making the truthful path easier than the sloppy path.
