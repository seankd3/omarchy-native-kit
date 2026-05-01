# Omarchy Native Kit Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build the first usable `omarchy-native` CLI and theme runtime.

**Architecture:** TypeScript package with a small dependency-free theme parser, semantic token mapper, CSS/JSON emitters, and a React/Vite starter template. It reads Omarchy user config and never edits upstream-managed Omarchy source.

**Tech Stack:** Node.js, TypeScript, Vitest, Vite/React template later.

---

## Task 1: Initialize TypeScript package

**Objective:** Create a buildable npm package with CLI entrypoint.

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/cli.ts`
- Create: `src/index.ts`

**Steps:**
1. Add package metadata, bin `omarchy-native`, scripts `build`, `test`, `typecheck`.
2. Add TypeScript dev dependencies.
3. Add placeholder CLI that prints help.
4. Run `npm install`.
5. Run `npm run build`.
6. Commit: `chore: initialize typescript package`.

## Task 2: Parse current Omarchy theme

**Objective:** Read `colors.toml` from current theme path and parse simple string key/value TOML.

**Files:**
- Create: `src/theme.ts`
- Create: `src/theme.test.ts`
- Create: `fixtures/osaka-jade/colors.toml`

**Steps:**
1. Write tests for parsing known color keys.
2. Implement `parseColorsToml()`.
3. Implement `getCurrentThemePaths(home = os.homedir())`.
4. Implement `readCurrentTheme()`.
5. Run tests.
6. Commit: `feat: read omarchy theme palette`.

## Task 3: Add semantic token mapping

**Objective:** Convert raw Omarchy palette into app-friendly semantic tokens.

**Files:**
- Modify: `src/theme.ts`
- Modify: `src/theme.test.ts`

**Steps:**
1. Write tests for `mapSemanticPalette()`.
2. Implement hex parsing and blending helpers.
3. Implement contrast-aware foreground helper.
4. Run tests.
5. Commit: `feat: map omarchy colors to semantic tokens`.

## Task 4: Add CSS and JSON emitters

**Objective:** Generate consumable artifacts for app authors.

**Files:**
- Create: `src/emit.ts`
- Create: `src/emit.test.ts`
- Modify: `src/index.ts`

**Steps:**
1. Test `toCssVariables()` output.
2. Test `toJson()` output.
3. Export emitters.
4. Run tests.
5. Commit: `feat: emit theme css and json`.

## Task 5: Wire CLI commands

**Objective:** Make `omarchy-native theme json`, `theme css`, and `doctor` work.

**Files:**
- Modify: `src/cli.ts`

**Steps:**
1. Add argument parsing without heavy framework.
2. Implement `theme json` to stdout.
3. Implement `theme css --out <path>` and stdout fallback.
4. Implement `doctor` to report detected paths and missing files.
5. Run build and manual commands.
6. Commit: `feat: add theme cli commands`.

## Task 6: Draft React/Vite template

**Objective:** Create starter app files using generated CSS variables.

**Files:**
- Create files under `templates/react-vite/`

**Steps:**
1. Add minimal Vite package.
2. Add app shell CSS using `--omarchy-*` variables.
3. Add `npm run theme:sync` example.
4. Add README for template use.
5. Commit: `feat: add react vite omarchy template`.

## Task 7: Hook documentation before hook mutation

**Objective:** Document safe hook setup before adding automated hook installer.

**Files:**
- Create: `docs/hooks.md`

**Steps:**
1. Explain `omarchy-hook theme-set`.
2. Explain app hook registry convention.
3. Include manual dispatcher script.
4. Warn not to clobber existing hooks.
5. Commit: `docs: document safe theme hook integration`.
