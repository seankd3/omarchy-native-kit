# Accessibility Contrast Auditor

A studio dogfood app for inspecting contrast, focus rings, reduced-motion behavior, font scaling, and pointer target sizes across Omarchy-native app surfaces.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/accessibility-contrast-auditor --build
omarchy-native app desktop examples/accessibility-contrast-auditor --name "Accessibility Contrast Auditor"
omarchy-native app hook examples/accessibility-contrast-auditor
```
