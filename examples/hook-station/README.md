# Hook Station

Hook Station is an Omarchy-native studio app for reviewing safe per-app theme sync hook scripts before exporting them.

```bash
npm install
npm run theme:css
npm run dev
```

It dogfoods the kit's hook workflow:

```bash
omarchy-native app hook . --out theme-set
omarchy-native verify .
```
