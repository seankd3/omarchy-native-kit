# Shortcut Trainer

A command-center dogfood app for rehearsing Omarchy keyboard chords and checking that focus behavior stays predictable.

```bash
npm install
npm run theme:css
npm run dev
```

The app uses generated Omarchy CSS variables from `src/omarchy-theme.css`, imports them before app styles, and avoids hard-coded visible colors.

Useful kit checks:

```bash
omarchy-native verify examples/shortcut-trainer
omarchy-native app desktop examples/shortcut-trainer --name "Shortcut Trainer"
omarchy-native app hook examples/shortcut-trainer
```
