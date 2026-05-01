type EntryState = 'valid' | 'review' | 'broken';

type DesktopEntry = {
  name: string;
  exec: string;
  icon: string;
  categories: string;
  action: string;
  state: EntryState;
};

type MetadataCheck = {
  label: string;
  detail: string;
  score: number;
  state: EntryState;
};

type StagedFix = {
  target: string;
  action: string;
  command: string;
  state: EntryState;
};

const entries: DesktopEntry[] = [
  {
    name: 'Theme Forge',
    exec: 'npm --prefix examples/theme-forge run preview',
    icon: 'applications-graphics',
    categories: 'Graphics;Utility;',
    action: 'New Window',
    state: 'valid'
  },
  {
    name: 'Native Gallery',
    exec: 'npm --prefix examples/native-gallery run preview',
    icon: 'applications-graphics',
    categories: 'Utility;',
    action: 'Open Catalog',
    state: 'valid'
  },
  {
    name: 'Release Console',
    exec: 'npm --prefix examples/release-console run preview',
    icon: 'missing-release-symbolic',
    categories: 'Development;',
    action: 'Dry Run',
    state: 'review'
  },
  {
    name: 'Scratch App',
    exec: 'npm --prefix examples/scratch run dev',
    icon: '',
    categories: '',
    action: 'none',
    state: 'broken'
  }
];

const metadataChecks: MetadataCheck[] = [
  {
    label: 'Categories',
    detail: 'Every launcher has at least one desktop menu category',
    score: 88,
    state: 'review'
  },
  {
    label: 'Startup hints',
    detail: 'Preview launchers run without terminal windows',
    score: 96,
    state: 'valid'
  },
  {
    label: 'Icon names',
    detail: 'Icon keys resolve through the active theme or hicolor fallback',
    score: 71,
    state: 'broken'
  }
];

const stagedFixes: StagedFix[] = [
  {
    target: 'Scratch App categories',
    action: 'Add a Utility category so desktop menus can place the launcher',
    command: 'Categories=Utility;',
    state: 'broken'
  },
  {
    target: 'Release Console icon',
    action: 'Swap missing symbolic icon for a known theme fallback',
    command: 'Icon=applications-development',
    state: 'review'
  },
  {
    target: 'Generated launcher parity',
    action: 'Recreate launchers through the kit helper before install',
    command: 'omarchy-native app desktop examples/theme-forge --name "Theme Forge"',
    state: 'valid'
  }
];

const stateLabels: Record<EntryState, string> = {
  valid: 'Valid',
  review: 'Review',
  broken: 'Broken'
};

const validCount = entries.filter((entry) => entry.state === 'valid').length;
const reviewCount = entries.filter((entry) => entry.state === 'review').length;
const brokenCount = entries.filter((entry) => entry.state === 'broken').length;

export function App() {
  return (
    <main className="shell">
      <section className="inspector" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Desktop entry</p>
            <h1 id="page-title">Launcher Inspector</h1>
          </div>
          <button type="button">Export Entries</button>
        </header>

        <section className="metrics" aria-label="Desktop launcher summary">
          <article>
            <span>{entries.length}</span>
            <p>launchers scanned</p>
          </article>
          <article>
            <span>{validCount}</span>
            <p>valid</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{brokenCount}</span>
            <p>broken</p>
          </article>
        </section>

        <section className="layout">
          <section className="entryPanel" aria-label="Desktop entry audit matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Entry matrix</p>
                <h2>Exec lines, icons, categories, actions, and startup hints</h2>
              </div>
              <div className="entryBadge">
                <span />
                desktop spec pass
              </div>
            </div>

            <div className="entryList" role="list">
              {entries.map((entry) => (
                <article className="entryRow" data-state={entry.state} key={entry.name} role="listitem" tabIndex={0}>
                  <div className="entryTitle">
                    <span>{stateLabels[entry.state]}</span>
                    <h3>{entry.name}</h3>
                    <p>{entry.exec}</p>
                  </div>
                  <div className="entryMeta">
                    <div>
                      <small>icon</small>
                      <strong>{entry.icon || 'missing'}</strong>
                    </div>
                    <div>
                      <small>categories</small>
                      <strong>{entry.categories || 'missing'}</strong>
                    </div>
                    <div>
                      <small>action</small>
                      <strong>{entry.action}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Desktop entry preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Desktop entry</h2>
                </div>
              </div>
              <pre aria-label="Generated desktop entry preview">{`[Desktop Entry]
Type=Application
Name=Theme Forge
Exec=npm --prefix examples/theme-forge run preview
Icon=applications-graphics
Terminal=false
Categories=Graphics;Utility;`}</pre>
            </section>

            <section className="metadataPanel" aria-label="Desktop metadata checks">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Metadata</p>
                  <h2>Spec readiness</h2>
                </div>
              </div>
              <div className="metadataList">
                {metadataChecks.map((check) => (
                  <article data-state={check.state} key={check.label}>
                    <div>
                      <span>{stateLabels[check.state]}</span>
                      <h3>{check.label}</h3>
                      <p>{check.detail}</p>
                    </div>
                    <meter min="0" max="100" value={check.score} aria-label={`${check.label} score`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="fixPanel" aria-label="Staged desktop entry fixes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged fixes</p>
                  <h2>Safe changes</h2>
                </div>
              </div>
              <div className="fixList">
                {stagedFixes.map((fix) => (
                  <article data-state={fix.state} key={fix.target}>
                    <span>{stateLabels[fix.state]}</span>
                    <h3>{fix.target}</h3>
                    <p>{fix.action}</p>
                    <code>{fix.command}</code>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
