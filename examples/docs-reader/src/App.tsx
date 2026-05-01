const docs = [
  { title: 'README', path: 'README.md', status: 'primary' },
  { title: 'Agent Context', path: 'docs/agent-context.md', status: 'contract' },
  { title: 'Ecosystem', path: 'docs/ecosystem.md', status: 'map' },
  { title: 'Release Checklist', path: 'docs/release-checklist.md', status: 'gate' }
];

const commands = [
  'omarchy-native doctor',
  'omarchy-native agent blueprint --app my-app --kind dashboard',
  'omarchy-native app catalog ./examples',
  'omarchy-native verify ./my-app'
];

const notes = [
  'Use generated --omarchy-* variables instead of hard-coded colors.',
  'Generated apps import src/omarchy-theme.css before app styles.',
  'Every app ships a blueprint and passes omarchy-native verify.',
  'Launcher and hook scripts are generated only where requested.'
];

export function App() {
  return (
    <main className="readerShell">
      <aside className="docList" aria-label="Documentation list">
        <div className="brand">
          <p className="eyebrow">omarchy.docs</p>
          <h1>Docs Reader</h1>
        </div>
        <div className="docStack">
          {docs.map((doc, index) => (
            <button className={index === 0 ? 'docRow active' : 'docRow'} key={doc.path} type="button">
              <strong>{doc.title}</strong>
              <small>{doc.path}</small>
              <em>{doc.status}</em>
            </button>
          ))}
        </div>
      </aside>

      <section className="readerPane" aria-label="Selected document">
        <header className="paneHeader">
          <h2>Quick Start</h2>
          <button className="primaryAction" type="button">
            Copy Section
          </button>
        </header>
        <div className="noteStack">
          {notes.map((note, index) => (
            <p key={note}>
              <span>{index + 1}</span>
              {note}
            </p>
          ))}
        </div>
      </section>

      <aside className="commandPane" aria-label="Command reference">
        <div className="paneHeader">
          <h2>Commands</h2>
          <span>copyable</span>
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
