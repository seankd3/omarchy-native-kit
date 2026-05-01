type FlatpakState = 'contained' | 'review' | 'exposed';

type FlatpakApp = {
  name: string;
  appId: string;
  filesystem: string;
  portals: string;
  rollback: string;
  state: FlatpakState;
};

type AuditLane = {
  name: string;
  scope: string;
  score: number;
  state: FlatpakState;
};

type OverrideChange = {
  mode: string;
  behavior: string;
  rollback: string;
  state: FlatpakState;
};

type AuditProbe = {
  target: string;
  action: string;
  command: string;
  state: FlatpakState;
};

const apps: FlatpakApp[] = [
  {
    name: 'Design browser',
    appId: 'org.chromium.Chromium',
    filesystem: 'downloads and documents',
    portals: 'FileChooser, OpenURI, Screenshare',
    rollback: 'remove filesystem override',
    state: 'review'
  },
  {
    name: 'Notes vault',
    appId: 'md.obsidian.Obsidian',
    filesystem: 'single vault path',
    portals: 'Documents and Notifications',
    rollback: 'restore vault-only grant',
    state: 'contained'
  },
  {
    name: 'Legacy editor',
    appId: 'org.gnome.gedit',
    filesystem: 'home read-write',
    portals: 'missing document portal',
    rollback: 'drop broad home grant',
    state: 'exposed'
  },
  {
    name: 'Media importer',
    appId: 'org.gnome.Snapshot',
    filesystem: 'xdg-pictures',
    portals: 'Camera and FileChooser',
    rollback: 'reset camera override',
    state: 'review'
  }
];

const lanes: AuditLane[] = [
  {
    name: 'Filesystem grants',
    scope: 'home, host, xdg dirs, path-specific read-write grants',
    score: 66,
    state: 'review'
  },
  {
    name: 'Portal use',
    scope: 'FileChooser, Documents, OpenURI, Camera, ScreenCast',
    score: 82,
    state: 'contained'
  },
  {
    name: 'Override drift',
    scope: 'user overrides, system overrides, stale broad grants',
    score: 49,
    state: 'exposed'
  }
];

const changes: OverrideChange[] = [
  {
    mode: 'Home grant cleanup',
    behavior: 'replace broad home access with document portal handoffs',
    rollback: 'flatpak override --filesystem=home',
    state: 'review'
  },
  {
    mode: 'Vault-only path',
    behavior: 'keep note-taking access scoped to one workspace vault path',
    rollback: 'restore previous path override',
    state: 'contained'
  },
  {
    mode: 'Legacy quarantine',
    behavior: 'block editor launch until broad host access is removed',
    rollback: 'restore launcher after override audit',
    state: 'exposed'
  }
];

const probes: AuditProbe[] = [
  {
    target: 'App overrides',
    action: 'Inspect app-specific user overrides before changing grants',
    command: 'flatpak override --show org.chromium.Chromium',
    state: 'review'
  },
  {
    target: 'Global drift',
    action: 'Find system and user overrides that apply beyond one app',
    command: 'flatpak override --show',
    state: 'exposed'
  },
  {
    target: 'Portal permissions',
    action: 'Review current portal grants before narrowing filesystem access',
    command: 'flatpak permissions',
    state: 'contained'
  },
  {
    target: 'Reset plan',
    action: 'Stage a reversible reset for apps with unknown override history',
    command: 'flatpak override --reset <app-id>',
    state: 'review'
  }
];

const stateLabels: Record<FlatpakState, string> = {
  contained: 'Contained',
  review: 'Review',
  exposed: 'Exposed'
};

const containedCount = apps.filter((app) => app.state === 'contained').length;
const reviewCount = apps.filter((app) => app.state === 'review').length;
const exposedCount = apps.filter((app) => app.state === 'exposed').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Flatpak sandbox</p>
            <h1 id="page-title">Permission Auditor</h1>
          </div>
          <button type="button">Stage Override</button>
        </header>

        <section className="metrics" aria-label="Flatpak permission summary">
          <article>
            <span>{apps.length}</span>
            <p>apps inspected</p>
          </article>
          <article>
            <span>{containedCount}</span>
            <p>contained</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{exposedCount}</span>
            <p>exposed</p>
          </article>
        </section>

        <section className="layout">
          <section className="appPanel" aria-label="Flatpak permission matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Permission matrix</p>
                <h2>Flatpak permissions, filesystem grants, portal use, override drift, and rollback-safe sandbox changes</h2>
              </div>
              <div className="appBadge">
                <span />
                override-safe
              </div>
            </div>

            <div className="appRows" role="list">
              {apps.map((app) => (
                <article className="appRow" data-state={app.state} key={app.appId} role="listitem" tabIndex={0}>
                  <div className="appTitle">
                    <span>{stateLabels[app.state]}</span>
                    <h3>{app.name}</h3>
                    <p>{app.appId}</p>
                  </div>
                  <div className="appMeta">
                    <div>
                      <small>filesystem</small>
                      <strong>{app.filesystem}</strong>
                    </div>
                    <div>
                      <small>portals</small>
                      <strong>{app.portals}</strong>
                    </div>
                    <div>
                      <small>rollback</small>
                      <strong>{app.rollback}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Flatpak override route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Override route</h2>
                </div>
              </div>
              <pre aria-label="Flatpak override route preview">{`flatpak app
  -> filesystem grant reviewed
  -> portal alternative selected
  -> override drift compared
  -> reset command staged
  -> previous grants retained`}</pre>
            </section>

            <section className="lanePanel" aria-label="Flatpak audit lanes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Coverage</p>
                  <h2>Audit lanes</h2>
                </div>
              </div>
              <div className="laneList">
                {lanes.map((lane) => (
                  <article data-state={lane.state} key={lane.name}>
                    <div>
                      <span>{stateLabels[lane.state]}</span>
                      <h3>{lane.name}</h3>
                      <p>{lane.scope}</p>
                    </div>
                    <meter min="0" max="100" value={lane.score} aria-label={`${lane.name} coverage`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="changePanel" aria-label="Rollback-safe Flatpak changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Changes</p>
                  <h2>Sandbox edits</h2>
                </div>
              </div>
              <div className="changeList">
                {changes.map((change) => (
                  <article data-state={change.state} key={change.mode}>
                    <span>{stateLabels[change.state]}</span>
                    <h3>{change.mode}</h3>
                    <p>{change.behavior}</p>
                    <strong>{change.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="probePanel" aria-label="Staged Flatpak probes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged probes</p>
                  <h2>Review commands</h2>
                </div>
              </div>
              <div className="probeList">
                {probes.map((probe) => (
                  <article data-state={probe.state} key={probe.target}>
                    <span>{stateLabels[probe.state]}</span>
                    <h3>{probe.target}</h3>
                    <p>{probe.action}</p>
                    <code>{probe.command}</code>
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
