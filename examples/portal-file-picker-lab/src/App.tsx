type PortalState = 'ready' | 'review' | 'blocked';

type PortalRoute = {
  app: string;
  portal: string;
  recent: string;
  sandbox: string;
  documents: string;
  state: PortalState;
};

type AccessProfile = {
  name: string;
  scope: string;
  score: number;
  state: PortalState;
};

type StagedStep = {
  target: string;
  action: string;
  command: string;
  state: PortalState;
};

const routes: PortalRoute[] = [
  {
    app: 'Browser uploads',
    portal: 'org.freedesktop.portal.FileChooser',
    recent: 'recent files hidden',
    sandbox: 'xdg-desktop-portal',
    documents: 'read-only grant',
    state: 'ready'
  },
  {
    app: 'Flatpak editor',
    portal: 'document portal',
    recent: 'recent files scoped',
    sandbox: 'flatpak session',
    documents: 'persistent grant review',
    state: 'review'
  },
  {
    app: 'Image picker',
    portal: 'GTK file chooser',
    recent: 'thumbnails exposed',
    sandbox: 'host app',
    documents: 'temporary grant',
    state: 'review'
  },
  {
    app: 'CLI helper',
    portal: 'none',
    recent: 'host recent files',
    sandbox: 'unsandboxed',
    documents: 'manual path access',
    state: 'blocked'
  }
];

const profiles: AccessProfile[] = [
  {
    name: 'Portal coverage',
    scope: 'FileChooser + Documents',
    score: 86,
    state: 'ready'
  },
  {
    name: 'Recent-file hygiene',
    scope: '~/.local/share/recently-used.xbel',
    score: 72,
    state: 'review'
  },
  {
    name: 'Sandbox parity',
    scope: 'Flatpak, browser, host apps',
    score: 59,
    state: 'blocked'
  }
];

const stagedSteps: StagedStep[] = [
  {
    target: 'CLI helper path access',
    action: 'Move helper workflows behind an explicit chooser or documented path prompt',
    command: 'xdg-document-portal --monitor',
    state: 'blocked'
  },
  {
    target: 'Recent-file exposure',
    action: 'Review recent-file visibility before enabling document previews',
    command: 'gio info ~/.local/share/recently-used.xbel',
    state: 'review'
  },
  {
    target: 'Portal backend baseline',
    action: 'Confirm portal service is active before testing picker flows',
    command: 'systemctl --user status xdg-desktop-portal',
    state: 'ready'
  }
];

const stateLabels: Record<PortalState, string> = {
  ready: 'Ready',
  review: 'Review',
  blocked: 'Blocked'
};

const readyCount = routes.filter((route) => route.state === 'ready').length;
const reviewCount = routes.filter((route) => route.state === 'review').length;
const blockedCount = routes.filter((route) => route.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">File portal</p>
            <h1 id="page-title">Picker Lab</h1>
          </div>
          <button type="button">Stage Access Plan</button>
        </header>

        <section className="metrics" aria-label="File portal summary">
          <article>
            <span>{routes.length}</span>
            <p>flows inspected</p>
          </article>
          <article>
            <span>{readyCount}</span>
            <p>ready</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked</p>
          </article>
        </section>

        <section className="layout">
          <section className="routePanel" aria-label="File picker portal matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Portal matrix</p>
                <h2>File chooser portals, recent-file exposure, sandbox handoffs, and document grants</h2>
              </div>
              <div className="portalBadge">
                <span />
                document grants staged
              </div>
            </div>

            <div className="routeList" role="list">
              {routes.map((route) => (
                <article className="routeRow" data-state={route.state} key={route.app} role="listitem" tabIndex={0}>
                  <div className="routeTitle">
                    <span>{stateLabels[route.state]}</span>
                    <h3>{route.app}</h3>
                    <p>{route.portal}</p>
                  </div>
                  <div className="routeMeta">
                    <div>
                      <small>recent</small>
                      <strong>{route.recent}</strong>
                    </div>
                    <div>
                      <small>sandbox</small>
                      <strong>{route.sandbox}</strong>
                    </div>
                    <div>
                      <small>documents</small>
                      <strong>{route.documents}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Document portal preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Document grant path</h2>
                </div>
              </div>
              <pre aria-label="Document portal preview">{`app -> FileChooser portal
  -> selected document
  -> /run/user/1000/doc/<token>
  -> temporary read grant
  -> revoke on close`}</pre>
            </section>

            <section className="profilePanel" aria-label="Portal access profile coverage">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Profiles</p>
                  <h2>Access readiness</h2>
                </div>
              </div>
              <div className="profileList">
                {profiles.map((profile) => (
                  <article data-state={profile.state} key={profile.name}>
                    <div>
                      <span>{stateLabels[profile.state]}</span>
                      <h3>{profile.name}</h3>
                      <p>{profile.scope}</p>
                    </div>
                    <meter min="0" max="100" value={profile.score} aria-label={`${profile.name} readiness`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="stepPanel" aria-label="Staged portal file picker steps">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged steps</p>
                  <h2>Safe checks</h2>
                </div>
              </div>
              <div className="stepList">
                {stagedSteps.map((step) => (
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
