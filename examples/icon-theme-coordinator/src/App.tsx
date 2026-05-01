type CoverageState = 'covered' | 'review' | 'missing';

type IconSurface = {
  surface: string;
  theme: string;
  symbolic: string;
  launcher: string;
  fallback: string;
  state: CoverageState;
};

type IconFamily = {
  name: string;
  coverage: number;
  style: string;
  risk: string;
  state: CoverageState;
};

type StagedFix = {
  target: string;
  action: string;
  command: string;
  state: CoverageState;
};

const surfaces: IconSurface[] = [
  {
    surface: 'GTK apps',
    theme: 'Papirus-Dark',
    symbolic: '98%',
    launcher: 'native',
    fallback: 'Adwaita',
    state: 'covered'
  },
  {
    surface: 'Qt apps',
    theme: 'Papirus-Dark',
    symbolic: '84%',
    launcher: 'mixed glyphs',
    fallback: 'breeze-icons',
    state: 'review'
  },
  {
    surface: 'Browser surfaces',
    theme: 'Papirus-Dark',
    symbolic: '91%',
    launcher: 'web app masks',
    fallback: 'hicolor',
    state: 'covered'
  },
  {
    surface: 'Shell launchers',
    theme: 'Papirus-Dark',
    symbolic: '72%',
    launcher: 'missing desktop icons',
    fallback: 'hicolor',
    state: 'missing'
  }
];

const families: IconFamily[] = [
  {
    name: 'Papirus-Dark',
    coverage: 94,
    style: 'filled + symbolic',
    risk: 'low contrast on two tray icons',
    state: 'covered'
  },
  {
    name: 'Adwaita',
    coverage: 86,
    style: 'symbolic first',
    risk: 'launcher mismatch',
    state: 'review'
  },
  {
    name: 'hicolor',
    coverage: 61,
    style: 'fallback only',
    risk: 'generic app badges',
    state: 'missing'
  }
];

const fixes: StagedFix[] = [
  {
    target: 'Qt icon theme',
    action: 'Align Qt icon theme and fallback list before relaunching Qt apps',
    command: 'kwriteconfig6 --group Icons --key Theme Papirus-Dark',
    state: 'review'
  },
  {
    target: 'Desktop launcher glyphs',
    action: 'Find launchers that still point at missing icon names',
    command: 'rg "^Icon=" ~/.local/share/applications /usr/share/applications',
    state: 'missing'
  },
  {
    target: 'GTK symbolic baseline',
    action: 'Keep GTK symbolic icons as the reference coverage surface',
    command: 'gsettings get org.gnome.desktop.interface icon-theme',
    state: 'covered'
  }
];

const stateLabels: Record<CoverageState, string> = {
  covered: 'Covered',
  review: 'Review',
  missing: 'Missing'
};

const coveredCount = surfaces.filter((surface) => surface.state === 'covered').length;
const reviewCount = surfaces.filter((surface) => surface.state === 'review').length;
const missingCount = surfaces.filter((surface) => surface.state === 'missing').length;

export function App() {
  return (
    <main className="shell">
      <section className="coordinator" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Icon theme</p>
            <h1 id="page-title">Icon Coordinator</h1>
          </div>
          <button type="button">Stage Theme</button>
        </header>

        <section className="metrics" aria-label="Icon theme summary">
          <article>
            <span>{surfaces.length}</span>
            <p>surfaces audited</p>
          </article>
          <article>
            <span>{coveredCount}</span>
            <p>covered</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{missingCount}</span>
            <p>missing glyphs</p>
          </article>
        </section>

        <section className="layout">
          <section className="matrixPanel" aria-label="Icon surface coverage matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Surface matrix</p>
                <h2>Symbolic coverage, launcher glyphs, and fallback chains</h2>
              </div>
              <div className="syncBadge">
                <span />
                cache warm
              </div>
            </div>

            <div className="surfaceList" role="list">
              {surfaces.map((surface) => (
                <article className="surface" data-state={surface.state} key={surface.surface} role="listitem" tabIndex={0}>
                  <div className="surfaceTitle">
                    <span>{stateLabels[surface.state]}</span>
                    <h3>{surface.surface}</h3>
                    <p>{surface.theme}</p>
                  </div>
                  <div className="surfaceMeta">
                    <div>
                      <small>symbolic</small>
                      <strong>{surface.symbolic}</strong>
                    </div>
                    <div>
                      <small>launcher</small>
                      <strong>{surface.launcher}</strong>
                    </div>
                    <div>
                      <small>fallback</small>
                      <strong>{surface.fallback}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Icon preview board">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview board</p>
                  <h2>Glyph families</h2>
                </div>
              </div>
              <div className="glyphGrid" aria-hidden="true">
                <span data-kind="folder" />
                <span data-kind="terminal" />
                <span data-kind="browser" />
                <span data-kind="settings" />
                <span data-kind="missing" />
                <span data-kind="symbolic" />
              </div>
            </section>

            <section className="familyPanel" aria-label="Icon family coverage">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Families</p>
                  <h2>Coverage candidates</h2>
                </div>
              </div>
              <div className="familyList">
                {families.map((family) => (
                  <article data-state={family.state} key={family.name}>
                    <div>
                      <span>{stateLabels[family.state]}</span>
                      <h3>{family.name}</h3>
                      <p>{family.style}</p>
                      <small>{family.risk}</small>
                    </div>
                    <meter min="0" max="100" value={family.coverage} aria-label={`${family.name} icon coverage`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="fixPanel" aria-label="Staged icon theme fixes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged fixes</p>
                  <h2>Safe changes</h2>
                </div>
              </div>
              <div className="fixList">
                {fixes.map((fix) => (
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
