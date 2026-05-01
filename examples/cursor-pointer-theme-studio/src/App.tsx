type SurfaceState = 'aligned' | 'review' | 'drift';

type PointerSurface = {
  surface: string;
  theme: string;
  size: string;
  speed: string;
  gesture: string;
  state: SurfaceState;
};

type Profile = {
  name: string;
  acceleration: string;
  touchpad: string;
  pressure: number;
  state: SurfaceState;
};

type StagedAction = {
  target: string;
  action: string;
  command: string;
  state: SurfaceState;
};

const surfaces: PointerSurface[] = [
  {
    surface: 'Hyprland compositor',
    theme: 'Bibata-Modern-Ice',
    size: '24px',
    speed: 'flat / 0.0',
    gesture: 'three-finger workspace',
    state: 'aligned'
  },
  {
    surface: 'GTK apps',
    theme: 'Bibata-Modern-Ice',
    size: '24px',
    speed: 'system default',
    gesture: 'natural scroll on',
    state: 'aligned'
  },
  {
    surface: 'Qt apps',
    theme: 'Adwaita fallback',
    size: '24px',
    speed: 'libinput adaptive',
    gesture: 'pinch zoom review',
    state: 'review'
  },
  {
    surface: 'Browser chrome',
    theme: 'Bibata-Modern-Ice',
    size: '32px',
    speed: 'browser scaled',
    gesture: 'horizontal swipe drift',
    state: 'drift'
  }
];

const profiles: Profile[] = [
  {
    name: 'Precision docked',
    acceleration: 'flat',
    touchpad: 'tap disabled',
    pressure: 74,
    state: 'aligned'
  },
  {
    name: 'Laptop flow',
    acceleration: 'adaptive',
    touchpad: 'tap + natural scroll',
    pressure: 58,
    state: 'review'
  },
  {
    name: 'Presentation mode',
    acceleration: 'adaptive high',
    touchpad: 'large pointer',
    pressure: 92,
    state: 'drift'
  }
];

const stagedActions: StagedAction[] = [
  {
    target: 'Qt cursor fallback',
    action: 'Write matching cursor theme into qt6ct before relaunching Qt apps',
    command: 'omarchy-native theme qt --out ~/.config/qt6ct/colors/omarchy.conf',
    state: 'review'
  },
  {
    target: 'Browser pointer size',
    action: 'Audit browser scale factor and XCURSOR_SIZE before exporting profile',
    command: 'env | rg "XCURSOR|GDK_SCALE|QT_SCALE_FACTOR"',
    state: 'drift'
  },
  {
    target: 'Compositor baseline',
    action: 'Keep Hyprland pointer theme as the reference source',
    command: 'hyprctl getoption cursor:theme',
    state: 'aligned'
  }
];

const stateLabels: Record<SurfaceState, string> = {
  aligned: 'Aligned',
  review: 'Review',
  drift: 'Drift'
};

const alignedCount = surfaces.filter((surface) => surface.state === 'aligned').length;
const reviewCount = surfaces.filter((surface) => surface.state === 'review').length;
const driftCount = surfaces.filter((surface) => surface.state === 'drift').length;

export function App() {
  return (
    <main className="shell">
      <section className="studio" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Pointer theme</p>
            <h1 id="page-title">Cursor Studio</h1>
          </div>
          <button type="button">Export Profile</button>
        </header>

        <section className="metrics" aria-label="Pointer profile summary">
          <article>
            <span>{surfaces.length}</span>
            <p>surfaces tracked</p>
          </article>
          <article>
            <span>{alignedCount}</span>
            <p>aligned</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{driftCount}</span>
            <p>drift detected</p>
          </article>
        </section>

        <section className="layout">
          <section className="matrixPanel" aria-label="Cursor surface matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Surface matrix</p>
                <h2>Theme, size, acceleration, and gesture parity</h2>
              </div>
              <div className="profileBadge">
                <span />
                libinput preview
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
                      <small>size</small>
                      <strong>{surface.size}</strong>
                    </div>
                    <div>
                      <small>speed</small>
                      <strong>{surface.speed}</strong>
                    </div>
                    <div>
                      <small>gesture</small>
                      <strong>{surface.gesture}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Pointer preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview lane</p>
                  <h2>Pointer scale check</h2>
                </div>
              </div>
              <div className="pointerStage" aria-hidden="true">
                <div className="targetGrid">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="pointer large" />
                <div className="pointer small" />
                <div className="motionPath" />
              </div>
            </section>

            <section className="profilePanel" aria-label="Acceleration profiles">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Profiles</p>
                  <h2>Acceleration sets</h2>
                </div>
              </div>
              <div className="profileList">
                {profiles.map((profile) => (
                  <article data-state={profile.state} key={profile.name}>
                    <div>
                      <span>{stateLabels[profile.state]}</span>
                      <h3>{profile.name}</h3>
                      <p>{profile.acceleration} / {profile.touchpad}</p>
                    </div>
                    <meter min="0" max="100" value={profile.pressure} aria-label={`${profile.name} pointer pressure`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="actionPanel" aria-label="Staged pointer actions">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged actions</p>
                  <h2>Safe changes</h2>
                </div>
              </div>
              <div className="actionList">
                {stagedActions.map((action) => (
                  <article data-state={action.state} key={action.target}>
                    <span>{stateLabels[action.state]}</span>
                    <h3>{action.target}</h3>
                    <p>{action.action}</p>
                    <code>{action.command}</code>
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
