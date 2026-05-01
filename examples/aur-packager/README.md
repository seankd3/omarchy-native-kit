# AUR Packager

AUR Packager is an Omarchy-native studio for staging PKGBUILD metadata, install commands, and package validation for Arch and Omarchy users.

```bash
npm install
npm run theme:css
npm run dev
```

It dogfoods the packaging path:

```bash
npm pack --dry-run
omarchy-native verify .
omarchy-native app desktop . --out aur-packager.desktop
```
