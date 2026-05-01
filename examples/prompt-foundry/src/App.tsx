const kinds = [
  { name: 'command-center', state: 'ready' },
  { name: 'dashboard', state: 'metrics' },
  { name: 'studio', state: 'selected' }
];

const briefFields = [
  { label: 'App name', value: 'Release Console' },
  { label: 'Workflow', value: 'Prepare, verify, and ship Omarchy-native apps' },
  { label: 'Audience', value: 'builders working inside a themed desktop' }
];

const promptLines = [
  'Build an Omarchy-native studio named Release Console.',
  'Use generated --omarchy-* variables for every visible color.',
  'Start on the release preparation surface, not a marketing screen.',
  'Include file checks, command previews, and keyboard-first controls.'
];

const checks = [
  'imports theme CSS before app styles',
  'uses current blueprint kind: studio',
  'includes verifier and package gates',
  'keeps generated prompt copyable'
];

export function App() {
  return (
    <main className="foundryShell">
      <header className="mast">
        <div>
          <p className="eyebrow">omarchy.prompt</p>
          <h1>Prompt Foundry</h1>
        </div>
        <button className="primaryAction" type="button">
          Copy Prompt
        </button>
      </header>

      <section className="foundryGrid" aria-label="Prompt foundry workspace">
        <aside className="briefPanel" aria-label="App brief inputs">
          <div className="panelHeader">
            <h2>Brief</h2>
            <span>schema v1</span>
          </div>
          <div className="fieldStack">
            {briefFields.map((field) => (
              <label className="field" key={field.label}>
                {field.label}
                <input value={field.value} readOnly />
              </label>
            ))}
          </div>
        </aside>

        <section className="previewPanel" aria-label="Generated prompt preview">
          <div className="panelHeader">
            <h2>Generated Prompt</h2>
            <span>agent ready</span>
          </div>
          <div className="promptBlock">
            {promptLines.map((line, index) => (
              <p key={line}>
                <span>{index + 1}</span>
                {line}
              </p>
            ))}
          </div>
        </section>

        <aside className="controlPanel" aria-label="Blueprint and checks">
          <div className="panelHeader">
            <h2>Blueprint</h2>
            <span>studio</span>
          </div>
          <div className="kindStack">
            {kinds.map((kind) => (
              <button className={kind.name === 'studio' ? 'kindButton active' : 'kindButton'} key={kind.name} type="button">
                <strong>{kind.name}</strong>
                <small>{kind.state}</small>
              </button>
            ))}
          </div>
          <div className="checkStack" aria-label="Acceptance checks">
            {checks.map((check) => (
              <button className="checkRow" key={check} type="button">
                <span aria-hidden="true" />
                {check}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
