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
| AppArmor Profile Workbench | `examples/apparmor-profile-workbench` | Studio app for inspecting AppArmor profile intents, denied operations, portal alternatives, local overrides, and rollback-safe confinement changes. |
| Shortcut Trainer | `examples/shortcut-trainer` | Command-center app for practicing keyboard chords and focus checks. |
| Focus Flight Recorder | `examples/focus-flight-recorder` | Studio app for capturing keyboard navigation paths and inspecting focus landings. |
| Window Rule Lab | `examples/window-rule-lab` | Studio app for drafting window/workspace rules before live config changes. |
| Config Diff Studio | `examples/config-diff-studio` | Studio app for staging reversible Omarchy config patch previews. |
| Session Restore Planner | `examples/session-restore-planner` | Dashboard app for modeling startup apps, workspaces, and restore order. |
| Portal Permission Center | `examples/portal-permission-center` | Studio app for reviewing portals, default handlers, and desktop integration permissions. |
| Backup Restore Console | `examples/backup-restore-console` | Dashboard app for checking backup coverage, restore points, and rollback readiness. |
| Camera Microphone Permission Lab | `examples/camera-microphone-permission-lab` | Studio app for inspecting camera and microphone portals, device selection, per-app grants, meeting profiles, and privacy fallback behavior. |
| Container Runtime Dashboard | `examples/container-runtime-dashboard` | Dashboard app for inspecting Podman and Docker services, socket exposure, image trust, volume mounts, and rollback-safe container runtime changes. |
| Notification Routing Board | `examples/notification-routing-board` | Dashboard app for designing notification routes, quiet hours, and escalation rules. |
| Power Profile Switchboard | `examples/power-profile-switchboard` | Dashboard app for tuning power profiles, brightness, idle behavior, and performance modes per workspace. |
| Proxy Environment Router | `examples/proxy-environment-router` | Studio app for inspecting proxy variables, per-app proxy routing, no-proxy gaps, PAC files, and rollback-safe proxy changes. |
| Privacy Indicator Monitor | `examples/privacy-indicator-monitor` | Studio app for inspecting camera, microphone, screen-capture, and location activity indicators, stale grants, and per-workspace privacy posture. |
| Audio Device Mixer | `examples/audio-device-mixer` | Dashboard app for routing microphones, speakers, per-app volume, and meeting presets. |
| Network Profile Mapper | `examples/network-profile-mapper` | Dashboard app for mapping trusted networks, VPN posture, DNS profiles, and workspace connectivity rules. |
| Display Layout Planner | `examples/display-layout-planner` | Dashboard app for planning monitor arrangements, scaling, color temperature, and workspace placement. |
| Input Method Studio | `examples/input-method-studio` | Studio app for configuring keyboards, pointer devices, layout variants, repeat rates, and workspace behavior. |
| Workspace Automation Builder | `examples/workspace-automation-builder` | Studio app for composing workspace triggers, app launch rules, hooks, and rollback-safe automation recipes. |
| Credential Session Vault | `examples/credential-session-vault` | Studio app for staging session secrets, SSH agents, keyring readiness, and workspace credential exposure. |
| Secret Service Inspector | `examples/secret-service-inspector` | Studio app for inspecting Secret Service providers, keyring unlock state, app access, stale secrets, and rollback-safe credential cleanup. |
| SSH Agent Session Monitor | `examples/ssh-agent-session-monitor` | Studio app for inspecting SSH agent sockets, loaded identities, forwarding exposure, lifetime policies, and rollback-safe key hygiene. |
| GPG Keyring Policy Lab | `examples/gpg-keyring-policy-lab` | Studio app for inspecting GPG agent sockets, smartcard state, signing key trust, cache TTLs, and rollback-safe cryptographic policy changes. |
| Pinentry Prompt Router | `examples/pinentry-prompt-router` | Studio app for inspecting pinentry variants, desktop prompt routing, TTY fallback behavior, passphrase cache boundaries, and rollback-safe prompt changes. |
| Hardware Token Manager | `examples/hardware-token-manager` | Studio app for inspecting FIDO2, PIV, and smartcard devices, enrollment state, touch policies, recovery paths, and rollback-safe token changes. |
| Backup Key Recovery Planner | `examples/backup-key-recovery-planner` | Studio app for inspecting recovery keys, backup tokens, emergency passphrases, escrow readiness, and rollback-safe recovery drills. |
| Emergency Access Runbook | `examples/emergency-access-runbook` | Studio app for inspecting break-glass accounts, offline runbooks, contact handoffs, time-boxed access grants, and rollback-safe emergency access rehearsals. |
| Incident Credential Rotator | `examples/incident-credential-rotator` | Studio app for inspecting compromised credential reports, rotation batches, service owners, secret age, rollback snapshots, and post-incident access cleanup. |
| Credential Leak Forensics | `examples/credential-leak-forensics` | Studio app for inspecting leaked secret fingerprints, exposure timelines, affected workspaces, scanner evidence, containment status, and cleanup verification. |
| Secret Lifecycle Governor | `examples/secret-lifecycle-governor` | Studio app for inspecting secret birth, owner attestations, rotation cadence, consumer drift, deletion readiness, and policy-safe lifecycle changes. |
| API Token Scope Auditor | `examples/api-token-scope-auditor` | Studio app for inspecting API token scopes, stale grants, owner intent, overbroad permissions, revocation windows, and rollback-safe scope reductions. |
| OAuth Consent Review Board | `examples/oauth-consent-review-board` | Studio app for inspecting OAuth grants, delegated scopes, stale app access, owner intent, revocation windows, and rollback-safe consent cleanup. |
| Clipboard History Curator | `examples/clipboard-history-curator` | Studio app for reviewing clipboard history, pinning safe snippets, redacting secrets, and routing copied content by workspace. |
| Desktop Entry Inspector | `examples/desktop-entry-inspector` | Studio app for auditing `.desktop` launchers, categories, icons, actions, startup hints, and app identity metadata across generated and installed Omarchy apps. |
| DNS Resolver Policy Lab | `examples/dns-resolver-policy-lab` | Studio app for inspecting resolver routing, split-horizon VPN domains, per-workspace DNS leaks, and rollback-safe DNS changes. |
| Package Update Coordinator | `examples/package-update-coordinator` | Dashboard app for planning package updates, pinning holds, comparing risky upgrades, and scheduling rollback-safe maintenance windows. |
| Journal Timeline Inspector | `examples/journal-timeline-inspector` | Studio app for inspecting system logs across boots, correlating service failures with updates, and saving annotated incident timelines. |
| Service Restart Orchestrator | `examples/service-restart-orchestrator` | Dashboard app for planning systemd user and system service restarts, previewing dependency impact, and scheduling safe restart batches. |
| Screen Capture Permission Lab | `examples/screen-capture-permission-lab` | Studio app for inspecting screenshot and screen-share portals, monitor selection, persistent grants, and per-app capture expectations. |
| Sandbox Policy Simulator | `examples/sandbox-policy-simulator` | Studio app for inspecting sandbox profiles, bind mounts, portal holes, network namespaces, and rollback-safe policy experiments. |
| Sensor Access Ledger | `examples/sensor-access-ledger` | Studio app for inspecting ambient light, accelerometer, Bluetooth, and location sensor access, app requests, stale grants, and privacy-safe fallback behavior. |
| Environment Variable Auditor | `examples/environment-variable-auditor` | Studio app for inspecting shell, desktop, and service environments, comparing mismatched variables, and staging clean export fixes. |
| Firewall Rule Planner | `examples/firewall-rule-planner` | Studio app for inspecting nftables and ufw intents, per-workspace network exposure, temporary holes, and rollback-safe firewall changes. |
| Flatpak Permission Auditor | `examples/flatpak-permission-auditor` | Studio app for inspecting Flatpak permissions, filesystem grants, portal use, override drift, and rollback-safe sandbox changes. |
| Locale Timezone Manager | `examples/locale-timezone-manager` | Dashboard app for comparing locale, timezone, keyboard, and clock settings across shells, desktop sessions, and services before applying changes. |
| Font Rendering Tuner | `examples/font-rendering-tuner` | Studio app for comparing font stacks, antialiasing, hinting, and scaling behavior across GTK, Qt, browser, and terminal surfaces. |
| Trust Zone Mapper | `examples/trust-zone-mapper` | Studio app for inspecting workspace trust zones, portal exposure, network posture, removable media, and rollback-safe isolation recipes. |
| VPN Profile Coordinator | `examples/vpn-profile-coordinator` | Studio app for inspecting VPN profiles, route ownership, kill-switch posture, workspace bindings, and rollback-safe tunnel changes. |
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

- `saml-assertion-trust-lab` - inspect SAML apps, assertion attributes, stale identity provider trust, certificate expiry, owner intent, and rollback-safe federation cleanup.

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
