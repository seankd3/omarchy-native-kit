type MimeState = 'aligned' | 'review' | 'conflict';

type MimeRoute = {
  mime: string;
  defaultApp: string;
  opener: string;
  portal: string;
  browser: string;
  state: MimeState;
};

type HandlerProfile = {
  name: string;
  scope: string;
  coverage: number;
  state: MimeState;
};

type StagedChange = {
  target: string;
  action: string;
  command: string;
  state: MimeState;
};

const routes: MimeRoute[] = [
  {
    mime: 'text/html',
    defaultApp: 'firefox.desktop',
    opener: 'xdg-open',
    portal: 'browser portal',
    browser: 'Firefox Stable',
    state: 'aligned'
  },
  {
    mime: 'application/pdf',
    defaultApp: 'org.pwmt.zathura.desktop',
    opener: 'gio open',
    portal: 'document portal',
    browser: 'download prompt',
    state: 'aligned'
  },
  {
    mime: 'image/png',
    defaultApp: 'org.gnome.Loupe.desktop',
    opener: 'xdg-open',
    portal: 'file chooser',
    browser: 'built-in preview',
    state: 'review'
  },
  {
    mime: 'x-scheme-handler/http',
    defaultApp: 'chromium.desktop',
    opener: 'xdg-open',
    portal: 'browser portal',
    browser: 'Firefox expected',
    state: 'conflict'
  }
];

const profiles: HandlerProfile[] = [
  {
    name: 'Desktop defaults',
    scope: '~/.config/mimeapps.list',
    coverage: 92,
    state: 'aligned'
  },
  {
    name: 'Portal handoffs',
    scope: 'xdg-desktop-portal',
    coverage: 83,
    state: 'review'
  },
  {
    name: 'Browser schemes',
    scope: 'http, https, mailto',
    coverage: 64,
    state: 'conflict'
  }
];

const stagedChanges: StagedChange[] = [
  {
    target: 'HTTP handler',
    action: 'Restore browser scheme handlers to the expected desktop browser',
    command: 'xdg-mime default firefox.desktop x-scheme-handler/http x-scheme-handler/https',
    state: 'conflict'
  },
  {
    target: 'Image preview',
    action: 'Confirm PNG handling before replacing the image viewer default',
    command: 'xdg-mime query default image/png',
    state: 'review'
  },
  {
    target: 'Rollback snapshot',
    action: 'Save current MIME defaults before writing any association changes',
    command: 'cp ~/.config/mimeapps.list ~/.config/mimeapps.list.omarchy-bak',
    state: 'aligned'
  }
];

const stateLabels: Record<MimeState, string> = {
  aligned: 'Aligned',
  review: 'Review',
  conflict: 'Conflict'
};

const alignedCount = routes.filter((route) => route.state === 'aligned').length;
const reviewCount = routes.filter((route) => route.state === 'review').length;
const conflictCount = routes.filter((route) => route.state === 'conflict').length;

export function App() {
  return (
    <main className="shell">
      <section className="workbench" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">MIME defaults</p>
            <h1 id="page-title">Handler Workbench</h1>
          </div>
          <button type="button">Stage Associations</button>
        </header>

        <section className="metrics" aria-label="MIME handler summary">
          <article>
            <span>{routes.length}</span>
            <p>routes audited</p>
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
            <span>{conflictCount}</span>
            <p>conflicts</p>
          </article>
        </section>

        <section className="layout">
          <section className="routePanel" aria-label="MIME default route matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Route matrix</p>
                <h2>Defaults, opener precedence, portal handoffs, and browser handlers</h2>
              </div>
              <div className="routeBadge">
                <span />
                rollback armed
              </div>
            </div>

            <div className="routeList" role="list">
              {routes.map((route) => (
                <article className="routeRow" data-state={route.state} key={route.mime} role="listitem" tabIndex={0}>
                  <div className="routeTitle">
                    <span>{stateLabels[route.state]}</span>
                    <h3>{route.mime}</h3>
                    <p>{route.defaultApp}</p>
                  </div>
                  <div className="routeMeta">
                    <div>
                      <small>opener</small>
                      <strong>{route.opener}</strong>
                    </div>
                    <div>
                      <small>portal</small>
                      <strong>{route.portal}</strong>
                    </div>
                    <div>
                      <small>browser</small>
                      <strong>{route.browser}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="mimeapps preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>mimeapps.list patch</h2>
                </div>
              </div>
              <pre aria-label="MIME defaults preview">{`[Default Applications]
text/html=firefox.desktop
application/pdf=org.pwmt.zathura.desktop
image/png=org.gnome.Loupe.desktop
x-scheme-handler/http=firefox.desktop
x-scheme-handler/https=firefox.desktop`}</pre>
            </section>

            <section className="profilePanel" aria-label="Handler profile coverage">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Profiles</p>
                  <h2>Handler coverage</h2>
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
                    <meter min="0" max="100" value={profile.coverage} aria-label={`${profile.name} coverage`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="changePanel" aria-label="Staged MIME default changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged changes</p>
                  <h2>Rollback-safe edits</h2>
                </div>
              </div>
              <div className="changeList">
                {stagedChanges.map((change) => (
                  <article data-state={change.state} key={change.target}>
                    <span>{stateLabels[change.state]}</span>
                    <h3>{change.target}</h3>
                    <p>{change.action}</p>
                    <code>{change.command}</code>
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
