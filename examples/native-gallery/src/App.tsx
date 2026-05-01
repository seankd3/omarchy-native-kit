const apps = [
  { name: 'Signal Desk', kind: 'dashboard', path: 'examples/signal-desk', checks: '8/8' },
  { name: 'Theme Forge', kind: 'studio', path: 'examples/theme-forge', checks: '8/8' },
  { name: 'Hook Station', kind: 'studio', path: 'examples/hook-station', checks: '8/8' },
  { name: 'Workspace Radar', kind: 'dashboard', path: 'examples/workspace-radar', checks: '8/8' },
  { name: 'Prompt Foundry', kind: 'studio', path: 'examples/prompt-foundry', checks: '8/8' }
];

const recipe = [
  'omarchy-native app catalog ./examples --json',
  'omarchy-native agent blueprint --app native-gallery --kind studio',
  'omarchy-native verify ./examples/native-gallery'
];

const filters = ['All', 'Studio', 'Dashboard', 'Command'];

export function App() {
  return (
    <main className="galleryShell">
      <aside className="sidebar" aria-label="Gallery filters">
        <div className="brand">
          <p className="eyebrow">omarchy.gallery</p>
          <h1>Native Gallery</h1>
        </div>
        <div className="filterStack">
          {filters.map((filter, index) => (
            <button className={index === 0 ? 'filter active' : 'filter'} key={filter} type="button">
              {filter}
            </button>
          ))}
        </div>
      </aside>

      <section className="catalogPane" aria-label="Cataloged apps">
        <header className="paneHeader">
          <h2>Verified Apps</h2>
          <button className="primaryAction" type="button">
            Copy Recipe
          </button>
        </header>

        <div className="appList">
          {apps.map((app, index) => (
            <button className={index === 0 ? 'appRow selected' : 'appRow'} key={app.name} type="button">
              <span>
                <strong>{app.name}</strong>
                <small>{app.path}</small>
              </span>
              <em>{app.kind}</em>
              <b>{app.checks}</b>
            </button>
          ))}
        </div>
      </section>

      <aside className="recipePane" aria-label="Selected app recipe">
        <div className="paneHeader">
          <h2>Blueprint Recipe</h2>
          <span>verified</span>
        </div>
        <div className="summary">
          <small>Selected</small>
          <strong>Signal Desk</strong>
          <p>Dashboard pattern with metric strip, activity rows, and focused side-panel controls.</p>
        </div>
        <div className="commandStack">
          {recipe.map((command) => (
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
