const fields = [
  { label: 'pkgname', value: 'omarchy-native-kit' },
  { label: 'pkgver', value: '0.0.0' },
  { label: 'license', value: 'MIT' },
  { label: 'depends', value: 'nodejs npm' }
];

const pkgbuild = [
  'pkgname=omarchy-native-kit',
  'pkgver=0.0.0',
  'pkgrel=1',
  "pkgdesc='Scaffolding and theme runtime for Omarchy-native apps'",
  "arch=('any')",
  "license=('MIT')"
];

const checks = [
  { label: 'package dry-run', state: 'pass' },
  { label: 'license included', state: 'pass' },
  { label: 'template files packaged', state: 'pass' },
  { label: 'install command staged', state: 'review' }
];

const commands = ['npm pack --dry-run', 'makepkg --printsrcinfo', 'pacman -Ql omarchy-native-kit'];

export function App() {
  return (
    <main className="packagerShell">
      <aside className="metaPanel" aria-label="Package metadata">
        <div className="brand">
          <p className="eyebrow">omarchy.aur</p>
          <h1>AUR Packager</h1>
        </div>
        <div className="fieldStack">
          {fields.map((field) => (
            <label className="field" key={field.label}>
              {field.label}
              <input value={field.value} readOnly />
            </label>
          ))}
        </div>
      </aside>

      <section className="buildPane" aria-label="PKGBUILD preview">
        <header className="paneHeader">
          <h2>PKGBUILD</h2>
          <button className="primaryAction" type="button">
            Copy File
          </button>
        </header>
        <pre className="codeBlock">
          {pkgbuild.map((line, index) => (
            <span key={line}>
              <i>{index + 1}</i>
              {line}
            </span>
          ))}
        </pre>
      </section>

      <aside className="checkPanel" aria-label="Package checks">
        <div className="paneHeader">
          <h2>Checks</h2>
          <span>aur</span>
        </div>
        <div className="checkStack">
          {checks.map((check) => (
            <button className="checkRow" key={check.label} type="button">
              <span aria-hidden="true" />
              <strong>{check.label}</strong>
              <small>{check.state}</small>
            </button>
          ))}
        </div>
        <div className="commandStack">
          {commands.map((command) => (
            <button className="commandRow" key={command} type="button">
              <kbd>$</kbd>
              <span>{command}</span>
            </button>
          ))}
        </div>
      </aside>
    </main>
  );
}
