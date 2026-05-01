const workspaces = [
  { id: '01', name: 'Build', windows: 5, focus: 'native-kit', state: 'active' },
  { id: '02', name: 'Write', windows: 3, focus: 'docs', state: 'ready' },
  { id: '03', name: 'Ship', windows: 4, focus: 'terminal', state: 'busy' },
  { id: '04', name: 'Watch', windows: 2, focus: 'logs', state: 'quiet' }
];

const windows = [
  { app: 'Codex', title: 'omarchy-native-kit', workspace: 'Build', age: 'now' },
  { app: 'Terminal', title: 'npm run catalog:examples', workspace: 'Build', age: '1m' },
  { app: 'Browser', title: 'Hook Station preview', workspace: 'Ship', age: '4m' },
  { app: 'Editor', title: 'workspace-radar/src/App.tsx', workspace: 'Write', age: '7m' }
];

const shortcuts = [
  { keys: 'Super 1', target: 'Build', status: 'mapped' },
  { keys: 'Super 2', target: 'Write', status: 'mapped' },
  { keys: 'Super Shift H', target: 'Move left', status: 'check' },
  { keys: 'Super Shift L', target: 'Move right', status: 'check' }
];

export function App() {
  return (
    <main className="radarShell">
      <header className="mast">
        <div>
          <p className="eyebrow">omarchy.workspace</p>
          <h1>Workspace Radar</h1>
        </div>
        <button className="scanButton" type="button">
          Rescan
        </button>
      </header>

      <section className="overview" aria-label="Workspace overview">
        {workspaces.map((workspace) => (
          <button className={`workspaceTile ${workspace.state}`} key={workspace.id} type="button">
            <span className="workspaceId">{workspace.id}</span>
            <strong>{workspace.name}</strong>
            <small>{workspace.focus}</small>
            <em>{workspace.windows} windows</em>
          </button>
        ))}
      </section>

      <section className="radarGrid">
        <section className="windowPanel" aria-label="Active windows">
          <div className="panelHeader">
            <h2>Windows</h2>
            <span>focused first</span>
          </div>
          <div className="windowTable" role="table" aria-label="Window list">
            <div className="tableHead" role="row">
              <span>App</span>
              <span>Title</span>
              <span>Space</span>
              <span>Age</span>
            </div>
            {windows.map((window) => (
              <button className="windowRow" key={`${window.app}-${window.title}`} type="button" role="row">
                <strong>{window.app}</strong>
                <span>{window.title}</span>
                <em>{window.workspace}</em>
                <small>{window.age}</small>
              </button>
            ))}
          </div>
        </section>

        <aside className="inspector" aria-label="Workspace inspector">
          <div className="panelHeader">
            <h2>Inspector</h2>
            <span>Build</span>
          </div>
          <div className="focusCard">
            <small>Focused window</small>
            <strong>omarchy-native-kit</strong>
            <p>Catalog, verifier, and dogfood apps are aligned on the current blueprint contract.</p>
          </div>
          <div className="shortcutStack" aria-label="Shortcut coverage">
            {shortcuts.map((shortcut) => (
              <button className="shortcutRow" key={shortcut.keys} type="button">
                <kbd>{shortcut.keys}</kbd>
                <span>{shortcut.target}</span>
                <em>{shortcut.status}</em>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
