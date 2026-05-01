# Omarchy Native Ecosystem Map

This repo is the seed of a small Omarchy-native app ecosystem: a theme runtime, an agent contract, app blueprints, a verifier, and dogfood apps that prove the loop.

## What Exists

| Surface | Path | Purpose |
| --- | --- | --- |
| Theme runtime | `src/theme.ts`, `src/color.ts`, `src/emitters.ts` | Read Omarchy colors, map semantic tokens, emit CSS/JSON. |
| Agent contract | `src/agent.ts` | Give coding agents JSON, prompts, and app blueprints. |
| App verifier | `src/verify.ts` | Audit generated apps before handoff. |
| React/Vite template | `templates/react-vite` | Small starter for theme-aware apps. |
| Hello app | `examples/hello-omarchy-native` | Minimal command-surface starter output. |
| Agent Context Lab | `examples/agent-context-lab` | Studio-style app for inspecting agent context. |
| Signal Desk | `examples/signal-desk` | Dashboard app built from a blueprint. |
| Theme Forge | `examples/theme-forge` | Studio app for inspecting tokens and export targets. |

## Build Loop

1. Generate context:

   ```bash
   omarchy-native agent json
   omarchy-native agent prompt
   ```

2. Pick a blueprint:

   ```bash
   omarchy-native agent blueprint --app signal-desk --kind dashboard
   ```

3. Scaffold:

   ```bash
   omarchy-native create signal-desk --template react-vite --kind dashboard
   ```

4. Keep theme CSS synced while building:

   ```bash
   omarchy-native theme watch --out src/omarchy-theme.css
   ```

5. Build the app using only `--omarchy-*` variables.

6. Verify before handoff:

   ```bash
   omarchy-native verify ./signal-desk
   npm run build
   ```

7. Generate a launcher entry:

   ```bash
   omarchy-native app desktop ./signal-desk --out signal-desk.desktop
   ```

## App Ideas To Build Next

- `hook-station` - manage safe per-app theme sync hooks without clobbering user scripts.
- `workspace-radar` - dashboard for windows, keybindings, and active Omarchy workspaces.
- `prompt-foundry` - generate app briefs from Omarchy theme, blueprint kind, and target workflow.
- `native-gallery` - browse community Omarchy-native apps and copy blueprint recipes.

## Kit Refinements To Unlock More Apps

- Add GTK and Qt emitters beside CSS/JSON.
- Add Playwright visual checks for generated apps.
- Publish npm package and install docs.
- Add safe hook installation for app-level theme refresh.
- Add an AUR packaging path once the CLI stabilizes.

## Definition Of A Good Omarchy-Native App

- Reads generated Omarchy tokens instead of hard-coding colors.
- Starts on the actual tool surface, not a marketing screen.
- Works by keyboard, with visible focus states.
- Has stable responsive layouts at small, medium, and large widths.
- Ships an `omarchy-blueprint.json` contract.
- Passes `omarchy-native verify`.
- Can generate a `.desktop` launcher without mutating user config.
