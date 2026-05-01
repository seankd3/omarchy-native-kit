# React/Vite Omarchy Native Template

A keyboard-first React/Vite starter that imports generated Omarchy CSS variables before app styles.

```bash
npm install
npm run theme:css
npm run dev
```

The template uses `src/omarchy-theme.css` for semantic tokens such as `--omarchy-background`, `--omarchy-foreground`, `--omarchy-surface`, and `--omarchy-accent`.

Generated apps also include `omarchy-blueprint.json`, a structured build contract for coding agents. Regenerate it from the parent kit with:

```bash
omarchy-native agent blueprint --app my-app --kind command-center > omarchy-blueprint.json
```
