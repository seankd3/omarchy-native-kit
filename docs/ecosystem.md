# Omarchy Native Ecosystem Map

This repo is the seed of a small Omarchy-native app ecosystem: a theme runtime, an agent contract, app blueprints, a verifier, and dogfood apps that prove the loop.

## What Exists

| Surface | Path | Purpose |
| --- | --- | --- |
| Theme runtime | `src/theme.ts`, `src/color.ts`, `src/emitters.ts` | Read Omarchy colors, map semantic tokens, emit CSS/JSON/shell/GTK/Qt output. |
| Agent contract | `src/agent.ts` | Give coding agents JSON, prompts, and app blueprints. |
| App verifier | `src/verify.ts` | Audit generated apps before handoff. |
| App catalog | `src/catalog.ts` | Discover blueprint-backed apps and summarize verification status. |
| Hook generator | `src/hooks.ts` | Generate opt-in theme sync scripts without mutating Omarchy config. |
| React/Vite template | `templates/react-vite` | Small starter for theme-aware apps. |
| Accessibility Contrast Auditor | `examples/accessibility-contrast-auditor` | Studio app for inspecting contrast, focus rings, reduced-motion behavior, font scaling, and pointer target sizes across Omarchy-native app surfaces. |
| Hello app | `examples/hello-omarchy-native` | Minimal command-surface starter output. |
| Agent Context Lab | `examples/agent-context-lab` | Studio-style app for inspecting agent context. |
| Signal Desk | `examples/signal-desk` | Dashboard app built from a blueprint. |
| Theme Forge | `examples/theme-forge` | Studio app for inspecting tokens and export targets. |
| Hook Station | `examples/hook-station` | Studio app for reviewing safe theme sync hook scripts. |
| Workspace Radar | `examples/workspace-radar` | Dashboard app for scanning workspaces, windows, and keybindings. |
| Prompt Foundry | `examples/prompt-foundry` | Studio app for composing Omarchy-native app-building prompts. |
| Native Gallery | `examples/native-gallery` | Studio app for browsing verified apps and copying blueprint recipes. |
| Release Console | `examples/release-console` | Dashboard app for release dry-runs, catalog snapshots, and publish prep. |
| AUR Packager | `examples/aur-packager` | Studio app for staging Arch/AUR package metadata and validation. |
| Theme Migration Lab | `examples/theme-migration-lab` | Studio app for comparing theme changes before rollout. |
| Ops Deck | `examples/ops-deck` | Dashboard app for daily catalog, release, and rollout operations. |
| Docs Reader | `examples/docs-reader` | Command-center app for browsing local docs, commands, and blueprints. |
| App Health Monitor | `examples/app-health-monitor` | Dashboard app for verifier results and blueprint drift. |
| Shortcut Trainer | `examples/shortcut-trainer` | Command-center app for practicing keyboard chords and focus checks. |
| Focus Flight Recorder | `examples/focus-flight-recorder` | Studio app for capturing keyboard navigation paths and inspecting focus landings. |
| Window Rule Lab | `examples/window-rule-lab` | Studio app for drafting window/workspace rules before live config changes. |
| Config Diff Studio | `examples/config-diff-studio` | Studio app for staging reversible Omarchy config patch previews. |
| Session Restore Planner | `examples/session-restore-planner` | Dashboard app for modeling startup apps, workspaces, and restore order. |
| Portal Permission Center | `examples/portal-permission-center` | Studio app for reviewing portals, default handlers, and desktop integration permissions. |
| Backup Restore Console | `examples/backup-restore-console` | Dashboard app for checking backup coverage, restore points, and rollback readiness. |
| Camera Microphone Permission Lab | `examples/camera-microphone-permission-lab` | Studio app for inspecting camera and microphone portals, device selection, per-app grants, meeting profiles, and privacy fallback behavior. |
| Notification Routing Board | `examples/notification-routing-board` | Dashboard app for designing notification routes, quiet hours, and escalation rules. |
| Power Profile Switchboard | `examples/power-profile-switchboard` | Dashboard app for tuning power profiles, brightness, idle behavior, and performance modes per workspace. |
| Audio Device Mixer | `examples/audio-device-mixer` | Dashboard app for routing microphones, speakers, per-app volume, and meeting presets. |
| Network Profile Mapper | `examples/network-profile-mapper` | Dashboard app for mapping trusted networks, VPN posture, DNS profiles, and workspace connectivity rules. |
| Display Layout Planner | `examples/display-layout-planner` | Dashboard app for planning monitor arrangements, scaling, color temperature, and workspace placement. |
| Input Method Studio | `examples/input-method-studio` | Studio app for configuring keyboards, pointer devices, layout variants, repeat rates, and workspace behavior. |
| Workspace Automation Builder | `examples/workspace-automation-builder` | Studio app for composing workspace triggers, app launch rules, hooks, and rollback-safe automation recipes. |
| Credential Session Vault | `examples/credential-session-vault` | Studio app for staging session secrets, SSH agents, keyring readiness, and workspace credential exposure. |
| Clipboard History Curator | `examples/clipboard-history-curator` | Studio app for reviewing clipboard history, pinning safe snippets, redacting secrets, and routing copied content by workspace. |
| Desktop Entry Inspector | `examples/desktop-entry-inspector` | Studio app for auditing `.desktop` launchers, categories, icons, actions, startup hints, and app identity metadata across generated and installed Omarchy apps. |
| Package Update Coordinator | `examples/package-update-coordinator` | Dashboard app for planning package updates, pinning holds, comparing risky upgrades, and scheduling rollback-safe maintenance windows. |
| Journal Timeline Inspector | `examples/journal-timeline-inspector` | Studio app for inspecting system logs across boots, correlating service failures with updates, and saving annotated incident timelines. |
| Service Restart Orchestrator | `examples/service-restart-orchestrator` | Dashboard app for planning systemd user and system service restarts, previewing dependency impact, and scheduling safe restart batches. |
| Screen Capture Permission Lab | `examples/screen-capture-permission-lab` | Studio app for inspecting screenshot and screen-share portals, monitor selection, persistent grants, and per-app capture expectations. |
| Environment Variable Auditor | `examples/environment-variable-auditor` | Studio app for inspecting shell, desktop, and service environments, comparing mismatched variables, and staging clean export fixes. |
| Locale Timezone Manager | `examples/locale-timezone-manager` | Dashboard app for comparing locale, timezone, keyboard, and clock settings across shells, desktop sessions, and services before applying changes. |
| Font Rendering Tuner | `examples/font-rendering-tuner` | Studio app for comparing font stacks, antialiasing, hinting, and scaling behavior across GTK, Qt, browser, and terminal surfaces. |
| Cursor Pointer Theme Studio | `examples/cursor-pointer-theme-studio` | Studio app for comparing cursor themes, pointer sizes, acceleration, and touchpad behavior across compositor, GTK, Qt, and browser surfaces. |
| Icon Theme Coordinator | `examples/icon-theme-coordinator` | Studio app for comparing icon themes, symbolic icon coverage, launcher glyphs, and file-manager fallbacks across GTK, Qt, browser, and shell surfaces. |
| MIME Defaults Workbench | `examples/mime-defaults-workbench` | Studio app for auditing MIME defaults, opener precedence, portal handoffs, browser handlers, and rollback-safe association changes. |
| Portal File Picker Lab | `examples/portal-file-picker-lab` | Studio app for inspecting file chooser portals, recent-file exposure, sandbox handoffs, and per-app document access expectations. |

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

5. Export shell variables when scripts need theme tokens:

   ```bash
   omarchy-native theme shell --out omarchy-theme.env
   ```

6. Generate GTK CSS when a native surface needs it:

   ```bash
   omarchy-native theme gtk --out gtk.css
   ```

7. Generate Qt palette output when a Qt surface needs it:

   ```bash
   omarchy-native theme qt --out qt.ini
   ```

8. Build the app using only `--omarchy-*` variables.

9. Verify before handoff:

   ```bash
   omarchy-native verify ./signal-desk
   npm run build
   ```

10. Generate a launcher entry:

   ```bash
   omarchy-native app desktop ./signal-desk --out signal-desk.desktop
   ```

11. Generate an opt-in theme hook script:

   ```bash
   omarchy-native app hook ./signal-desk --out theme-set
   ```

12. Catalog the local app set:

   ```bash
   omarchy-native app catalog ./examples
   ```

## App Ideas To Build Next

- `privacy-indicator-monitor` - inspect camera, microphone, screen-capture, and location activity indicators, stale grants, and per-workspace privacy posture.

## Kit Refinements To Unlock More Apps

- Add Playwright visual checks for generated apps.
- Publish npm package and install docs.
- Add an AUR packaging path once the CLI stabilizes.

## Definition Of A Good Omarchy-Native App

- Reads generated Omarchy tokens instead of hard-coding colors.
- Starts on the actual tool surface, not a marketing screen.
- Works by keyboard, with visible focus states.
- Has stable responsive layouts at small, medium, and large widths.
- Ships an `omarchy-blueprint.json` contract.
- Passes `omarchy-native verify`.
- Can generate a `.desktop` launcher without mutating user config.
- Can generate an opt-in theme sync hook script without mutating user config.
