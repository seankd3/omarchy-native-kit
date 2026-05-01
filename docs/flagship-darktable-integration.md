# Flagship Integration Idea: Omarchy-Native Darktable

## Thesis

Applications should not live as private styling kingdoms. They should inherit and conform to the user's system style so the whole computer feels cohesive, intentional, and beautiful.

Darktable is a strong flagship target because it is:

- serious creative software, not a toy;
- used by real photographers;
- visually demanding;
- local-first and Linux-friendly;
- theme-heavy enough to prove the value of Omarchy Native Kit;
- painful when its styling feels disconnected from the desktop.

A successful Darktable integration would demonstrate the deeper promise of Omarchy Native Kit: not just scaffold new apps, but help existing high-value applications become better citizens of the user's desktop.

## Product Vision

Create a path for Darktable to fully embrace the active Omarchy theme:

- palette follows the user's current Omarchy theme;
- typography, spacing, borders, focus rings, and surfaces feel native;
- photo-editing contrast remains technically safe and neutral;
- UI chrome conforms to the desktop without compromising image judgment;
- theme updates can be regenerated automatically or on demand;
- integration is documented well enough for other apps to copy.

## Important Constraint

Photo editing tools cannot blindly inherit every decorative theme choice. The image canvas and color-critical inspection surfaces need neutral, predictable backgrounds. The right model is:

- **System-native shell:** panels, controls, menus, dialogs, borders, focus, launchers.
- **Color-critical workspace:** carefully constrained neutral backgrounds and contrast-safe overlays.

This protects photographers from making bad edits because the surrounding UI distorts perception.

## Possible Implementation Tracks

### Track A: No-fork Theme Generator

Generate a Darktable theme file from Omarchy tokens without forking Darktable.

Potential command:

```bash
omarchy-native integrate darktable --out ~/.config/darktable/themes/omarchy.css
```

Benefits:

- easiest to ship;
- low maintenance;
- works with upstream Darktable;
- validates the integration concept quickly.

Risks:

- limited by Darktable's theming surface;
- may not reach full native feeling;
- theme format may change.

### Track B: Omarchy Native Kit Integration Adapter

Create a reusable adapter layer for existing apps with custom theme formats.

Potential commands:

```bash
omarchy-native integrate list
omarchy-native integrate darktable preview
omarchy-native integrate darktable install
omarchy-native integrate darktable watch
```

Benefits:

- generalizes beyond Darktable;
- helps create an ecosystem of app integrations;
- gives agents a stable integration contract.

Risks:

- requires careful app-specific mappings;
- avoid pretending every app can be themed perfectly.

### Track C: Darktable Fork / Patch Series

Fork Darktable only if upstream theming APIs are insufficient.

Goals:

- expose better theme variables;
- improve desktop theme inheritance;
- add docs or config hooks upstream could accept;
- preserve serious photo-editing UX.

Benefits:

- can produce deeper integration;
- might become upstream contribution.

Risks:

- high maintenance burden;
- C/GTK complexity;
- fork could become chaff if not upstreamable.

Recommendation: start with Track A, design Track B, avoid Track C until evidence says it is necessary.

## Definition Of Success

A user can run one command and get a Darktable UI that feels native to their Omarchy desktop while keeping the editing canvas visually trustworthy.

Minimum proof:

- generated Darktable theme from real Omarchy tokens;
- screenshot comparison before/after;
- documentation explaining neutral editing surface constraints;
- verifier/checker that confirms target file and token mapping;
- no modification of upstream Darktable files;
- rollback instructions.

## First Research Questions

1. Where does Darktable store user themes on Linux?
2. What CSS/theme variables does Darktable expose today?
3. Can a user theme override enough UI chrome without patching source?
4. Which surfaces must remain neutral for color-critical editing?
5. How should Omarchy semantic tokens map to Darktable UI roles?
6. Can theme regeneration be triggered safely after Omarchy theme changes?
7. What should rollback look like?

## First Build Slice

Add an experimental Darktable theme emitter to Omarchy Native Kit:

```bash
omarchy-native integrate darktable --out ./darktable-omarchy.css
```

The first version should:

- read active or fixture Omarchy tokens;
- emit a clearly marked generated CSS theme;
- preserve neutral photo canvas colors;
- include comments explaining token mapping;
- include tests with fixture output;
- document install and rollback.

## Why This Matters

If this works for Darktable, the kit graduates from toy scaffolder to ecosystem bridge. It proves that open-source Linux apps can participate in a coherent desktop experience without each app inventing its own visual kingdom.

This is wheat: serious user value, open-source leverage, clear community wedge, and a repeatable pattern for future integrations.
