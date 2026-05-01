# Theme Migration Lab

Theme Migration Lab is an Omarchy-native studio for comparing old and new theme tokens before rolling palette changes through apps.

```bash
npm install
npm run theme:css
npm run dev
```

It dogfoods the theme rollout loop:

```bash
omarchy-native theme sync --out src/omarchy-theme.css
omarchy-native app catalog ../../examples
omarchy-native verify .
```
