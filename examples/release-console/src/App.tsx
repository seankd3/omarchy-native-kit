const metrics = [
  { label: 'Verified apps', value: '8/8', state: 'success' },
  { label: 'Tests', value: '27', state: 'success' },
  { label: 'Package files', value: '35', state: 'info' },
  { label: 'Open gates', value: '0', state: 'success' }
];

const checks = [
  { command: 'npm test', detail: 'unit and CLI contracts', status: 'pass' },
  { command: 'npm run verify:examples', detail: 'all dogfood app contracts', status: 'pass' },
  { command: 'npm run catalog:examples', detail: 'catalog snapshot', status: 'pass' },
  { command: 'npm pack --dry-run', detail: 'publish contents', status: 'pass' }
];

const artifacts = [
  { name: 'README.md', role: 'public guide' },
  { name: 'CHANGELOG.md', role: 'release notes' },
  { name: 'dist/catalog.js', role: 'catalog API' },
  { name: 'templates/react-vite', role: 'starter app' }
];

export function App() {
  return (
    <main className="releaseShell">
      <header className="mast">
        <div>
          <p className="eyebrow">omarchy.release</p>
          <h1>Release Console</h1>
        </div>
        <button className="primaryAction" type="button">
          Prepare Pack
        </button>
      </header>

      <section className="metricStrip" aria-label="Release metrics">
        {metrics.map((metric) => (
          <button className="metricTile" key={metric.label} type="button">
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
            <em className={metric.state}>{metric.state}</em>
          </button>
        ))}
      </section>

      <section className="releaseGrid">
        <section className="checkPanel" aria-label="Release checks">
          <div className="panelHeader">
            <h2>Gates</h2>
            <span>ready</span>
          </div>
          <div className="checkTable" role="table" aria-label="Release gate table">
            {checks.map((check) => (
              <button className="checkRow" key={check.command} type="button" role="row">
                <kbd>$</kbd>
                <span>
                  <strong>{check.command}</strong>
                  <small>{check.detail}</small>
                </span>
                <em>{check.status}</em>
              </button>
            ))}
          </div>
        </section>

        <aside className="artifactPanel" aria-label="Package artifacts">
          <div className="panelHeader">
            <h2>Tarball</h2>
            <span>dry-run</span>
          </div>
          <div className="artifactStack">
            {artifacts.map((artifact) => (
              <button className="artifactRow" key={artifact.name} type="button">
                <strong>{artifact.name}</strong>
                <small>{artifact.role}</small>
              </button>
            ))}
          </div>
          <div className="summary">
            <small>Next publish step</small>
            <strong>review package metadata</strong>
            <p>Confirm version, release notes, catalog snapshot, and generated files before publishing.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
