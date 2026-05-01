type RenderState = 'matched' | 'review' | 'drift';

type SurfaceSample = {
  surface: string;
  stack: string;
  antialias: string;
  hinting: string;
  scale: string;
  state: RenderState;
};

type TuningStep = {
  target: string;
  action: string;
  command: string;
  state: RenderState;
};

type PreviewLine = {
  label: string;
  sample: string;
  detail: string;
};

const surfaces: SurfaceSample[] = [
  {
    surface: 'GTK apps',
    stack: 'Inter, Noto Sans',
    antialias: 'rgba',
    hinting: 'slight',
    scale: '1.00',
    state: 'matched'
  },
  {
    surface: 'Qt apps',
    stack: 'Noto Sans, DejaVu Sans',
    antialias: 'subpixel',
    hinting: 'medium',
    scale: '1.00',
    state: 'review'
  },
  {
    surface: 'Terminal',
    stack: 'JetBrains Mono',
    antialias: 'grayscale',
    hinting: 'full',
    scale: '1.08',
    state: 'drift'
  },
  {
    surface: 'Browser',
    stack: 'Inter, system-ui',
    antialias: 'subpixel',
    hinting: 'slight',
    scale: '1.00',
    state: 'matched'
  }
];

const steps: TuningStep[] = [
  {
    target: 'terminal font scale',
    action: 'Bring terminal line height back to desktop scale',
    command: 'set font.size 12 && set font.line_height 1.2',
    state: 'drift'
  },
  {
    target: 'Qt font hinting',
    action: 'Preview medium-to-slight hinting before writing qt6ct config',
    command: 'omarchy-native theme qt --out qt-font-preview.ini',
    state: 'review'
  },
  {
    target: 'GTK baseline',
    action: 'Keep GTK antialias and hinting as the reference surface',
    command: 'gsettings get org.gnome.desktop.interface font-antialiasing',
    state: 'matched'
  }
];

const previewLines: PreviewLine[] = [
  {
    label: 'Body text',
    sample: 'The quick brown fox jumps over the lazy dog.',
    detail: 'Checks x-height, spacing, and grayscale rhythm.'
  },
  {
    label: 'Code text',
    sample: 'const scale = surface.fontSize * devicePixelRatio;',
    detail: 'Checks mono metrics and punctuation clarity.'
  },
  {
    label: 'UI chrome',
    sample: 'Settings  Preferences  Apply  Cancel',
    detail: 'Checks button labels and compact navigation.'
  }
];

const stateLabels: Record<RenderState, string> = {
  matched: 'Matched',
  review: 'Review',
  drift: 'Drift'
};

const matchedCount = surfaces.filter((surface) => surface.state === 'matched').length;
const reviewCount = surfaces.filter((surface) => surface.state === 'review').length;
const driftCount = surfaces.filter((surface) => surface.state === 'drift').length;

export function App() {
  return (
    <main className="shell">
      <section className="tuner" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Font rendering</p>
            <h1 id="page-title">Rendering Tuner</h1>
          </div>
          <div className="statusBadge">
            <span />
            preview profile staged
          </div>
        </header>

        <section className="metrics" aria-label="Font rendering summary">
          <article>
            <span>{surfaces.length}</span>
            <p>surfaces compared</p>
          </article>
          <article>
            <span>{matchedCount}</span>
            <p>matched</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{driftCount}</span>
            <p>scale drift</p>
          </article>
        </section>

        <section className="layout">
          <div className="surfacePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Surface matrix</p>
                <h2>Compare font stacks, antialiasing, hinting, and scale</h2>
              </div>
              <button type="button">Stage Profile</button>
            </div>

            <div className="surfaceList" role="list" aria-label="Font rendering surfaces">
              {surfaces.map((surface) => (
                <article className="surface" data-state={surface.state} key={surface.surface} role="listitem" tabIndex={0}>
                  <div className="surfaceTitle">
                    <span>{stateLabels[surface.state]}</span>
                    <h3>{surface.surface}</h3>
                    <p>{surface.stack}</p>
                  </div>
                  <div className="surfaceMeta">
                    <div>
                      <small>antialias</small>
                      <strong>{surface.antialias}</strong>
                    </div>
                    <div>
                      <small>hinting</small>
                      <strong>{surface.hinting}</strong>
                    </div>
                    <div>
                      <small>scale</small>
                      <strong>{surface.scale}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Font preview samples">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Sample text</h2>
                </div>
              </div>
              <div className="previewList">
                {previewLines.map((line) => (
                  <article key={line.label}>
                    <h3>{line.label}</h3>
                    <p>{line.sample}</p>
                    <small>{line.detail}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="stepPanel" aria-label="Staged font tuning steps">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged tuning</p>
                  <h2>Safe changes</h2>
                </div>
              </div>
              <div className="stepList">
                {steps.map((step) => (
                  <article data-state={step.state} key={step.target}>
                    <span>{stateLabels[step.state]}</span>
                    <h3>{step.target}</h3>
                    <p>{step.action}</p>
                    <code>{step.command}</code>
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
