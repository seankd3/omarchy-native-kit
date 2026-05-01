# Portal Permission Center

A studio dogfood app for reviewing app portals, browser/default handlers, and desktop integration changes before applying them.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports generated Omarchy CSS variables before app styles, uses only `--omarchy-*` color tokens, and keeps every permission row keyboard-focusable.

Useful kit checks:

```bash
omarchy-native verify examples/portal-permission-center --build
omarchy-native app desktop examples/portal-permission-center --name "Portal Permission Center"
omarchy-native app hook examples/portal-permission-center
```
