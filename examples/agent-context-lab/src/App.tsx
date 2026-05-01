const tokens = [
  { name: 'background', variable: '--omarchy-background', role: 'Window base' },
  { name: 'surface', variable: '--omarchy-surface', role: 'Panels' },
  { name: 'surfaceRaised', variable: '--omarchy-surface-raised', role: 'Hover rows' },
  { name: 'accent', variable: '--omarchy-accent', role: 'Focus and primary' },
  { name: 'success', variable: '--omarchy-success', role: 'Ready states' },
  { name: 'warning', variable: '--omarchy-warning', role: 'Pending states' },
  { name: 'danger', variable: '--omarchy-danger', role: 'Errors' },
  { name: 'info', variable: '--omarchy-info', role: 'Links and notes' }
];

const buildChecks = [
  { label: 'Use semantic tokens', state: 'locked' },
  { label: 'Keyboard focus visible', state: 'ready' },
  { label: 'No nested cards', state: 'ready' },
  { label: 'Responsive rows stable', state: 'ready' }
];

const commands = [
  'omarchy-native agent json',
  'omarchy-native agent prompt',
  'omarchy-native theme css --out src/omarchy-theme.css'
];

const promptLines = [
  'Build an Omarchy-native app shell using the active theme.',
  'Keep the layout dense, keyboard-first, and useful on first load.',
  'Use accent only for selected, focused, or primary actions.',
  'Verify contrast and avoid hard-coded colors.'
];

export function App() {
  return (
    <main className="labShell">
      <section className="mast">
        <div>
          <p className="eyebrow">omarchy.native.agent</p>
          <h1>Agent Context Lab</h1>
        </div>
        <button className="primaryAction" type="button">
          Sync theme
        </button>
      </section>

      <section className="workspaceGrid" aria-label="Agent build workspace">
        <div className="tokenPanel">
          <div className="sectionHeader">
            <h2>Tokens</h2>
            <span>schema v1</span>
          </div>
          <div className="tokenList">
            {tokens.map((token) => (
              <button className="tokenRow" key={token.name} type="button">
                <span className="swatch" style={{ background: `var(${token.variable})` }} />
                <span>
                  <strong>{token.name}</strong>
                  <small>{token.variable}</small>
                </span>
                <em>{token.role}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="promptPanel">
          <div className="sectionHeader">
            <h2>Prompt Brief</h2>
            <span>agent ready</span>
          </div>
          <div className="promptBlock">
            {promptLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="commandStack" aria-label="Kit commands">
            {commands.map((command) => (
              <button className="command" key={command} type="button">
                <kbd>$</kbd>
                <span>{command}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="checkPanel">
          <div className="sectionHeader">
            <h2>Build Checks</h2>
            <span>4/4</span>
          </div>
          <div className="checkGrid">
            {buildChecks.map((check) => (
              <button className="check" key={check.label} type="button">
                <span className={check.state} />
                <strong>{check.label}</strong>
                <small>{check.state}</small>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
