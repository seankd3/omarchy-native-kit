# Audio Device Mixer

A dashboard dogfood app for routing microphones, speakers, per-app volume, and meeting presets across Omarchy-native apps.

The app starts on the operational surface: active device routes, gain meters, per-app lanes, and guarded meeting presets. Styling comes from `src/omarchy-theme.css`, with app CSS consuming `--omarchy-*` variables.

```bash
npm install
npm run theme:css
npm run dev
```

Useful kit checks from the repository root:

```bash
omarchy-native verify examples/audio-device-mixer --build
omarchy-native app desktop examples/audio-device-mixer --name "Audio Device Mixer"
omarchy-native app hook examples/audio-device-mixer
```
