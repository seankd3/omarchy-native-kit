const commands = [
  { keys: 'Super Space', label: 'Open launcher', status: 'Ready' },
  { keys: 'Super Enter', label: 'New terminal', status: 'Native' },
  { keys: 'Super B', label: 'Browser workspace', status: 'Pinned' },
  { keys: 'Super Shift R', label: 'Reload theme', status: 'Hook' }
];

export function App() {
  return (
    <main className="shell">
      <section className="workspace">
        <div className="topbar">
          <span className="app-id">omarchy.native</span>
          <span className="state">theme synced</span>
        </div>

        <div className="hero">
          <p className="eyebrow">Command surface</p>
          <h1>Hello, Omarchy.</h1>
          <p className="lede">
            A keyboard-first React app using CSS variables generated from the active Omarchy theme.
          </p>
        </div>

        <div className="palette">
          <span style={{ background: 'var(--omarchy-accent)' }} />
          <span style={{ background: 'var(--omarchy-success)' }} />
          <span style={{ background: 'var(--omarchy-warning)' }} />
          <span style={{ background: 'var(--omarchy-danger)' }} />
          <span style={{ background: 'var(--omarchy-info)' }} />
        </div>

        <div className="commandMenu" role="list" aria-label="Example commands">
          {commands.map((command) => (
            <button className="command" key={command.keys} type="button">
              <kbd>{command.keys}</kbd>
              <span>{command.label}</span>
              <small>{command.status}</small>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
