# Getting Started

Omarchy Native Kit helps apps consume the user's Omarchy theme as semantic tokens instead of baking private colors into each interface.

## Ten-Minute Trial

Run this on any Linux machine with Node.js. The fixture palette makes the output deterministic, even outside Omarchy.

```bash
git clone https://github.com/Sean-Kenneth-Doherty/omarchy-native-kit.git
cd omarchy-native-kit
npm install
npm run build
node dist/cli.js doctor --colors tests/fixtures/colors.basic.toml
node dist/cli.js agent prompt --colors tests/fixtures/colors.basic.toml
node dist/cli.js create /tmp/omarchy-smoke --template react-vite --kind dashboard --colors tests/fixtures/colors.basic.toml
node dist/cli.js verify /tmp/omarchy-smoke
node dist/cli.js app desktop /tmp/omarchy-smoke --out /tmp/omarchy-smoke.desktop
```

On Omarchy, omit `--colors`. The CLI reads `~/.config/omarchy/current/theme/colors.toml` and never writes to Omarchy config unless you explicitly direct output there.

## What Good Output Looks Like

- App styles use `--omarchy-*` variables.
- Semantic roles are used for intent: `accent`, `danger`, `success`, `warning`, and `info`.
- Foreground tokens such as `--omarchy-accent-foreground` are used on semantic backgrounds.
- The interface starts on the useful tool surface, works by keyboard, and has visible focus states.
- `omarchy-native verify <app>` passes before handoff.

## Native Integration Trial

Generate an experimental darktable theme as a plain CSS artifact:

```bash
node dist/cli.js integrate darktable --colors tests/fixtures/colors.basic.toml --out /tmp/omarchy-darktable.css
```

Review the file, then copy it into darktable's user theme directory only if you want to test it. Rollback is selecting another darktable theme or deleting the generated CSS file.
