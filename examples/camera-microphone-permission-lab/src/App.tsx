type PermissionState = 'ready' | 'review' | 'blocked';

type PermissionRoute = {
  app: string;
  portal: string;
  camera: string;
  microphone: string;
  grant: string;
  state: PermissionState;
};

type DeviceProfile = {
  name: string;
  scope: string;
  readiness: number;
  state: PermissionState;
};

type FallbackStep = {
  mode: string;
  behavior: string;
  privacy: string;
  state: PermissionState;
};

type StagedAction = {
  target: string;
  action: string;
  command: string;
  state: PermissionState;
};

const routes: PermissionRoute[] = [
  {
    app: 'Meeting browser',
    portal: 'Camera + RemoteDesktop portals',
    camera: 'integrated webcam',
    microphone: 'studio USB mic',
    grant: 'session scoped',
    state: 'ready'
  },
  {
    app: 'Recording studio',
    portal: 'PipeWire media session',
    camera: 'capture card',
    microphone: 'monitor mix',
    grant: 'persistent review',
    state: 'review'
  },
  {
    app: 'Browser call',
    portal: 'WebRTC permission prompt',
    camera: 'virtual background feed',
    microphone: 'noise-suppressed source',
    grant: 'site scoped',
    state: 'ready'
  },
  {
    app: 'Legacy app',
    portal: 'none',
    camera: 'host device path',
    microphone: 'default source',
    grant: 'untracked',
    state: 'blocked'
  }
];

const profiles: DeviceProfile[] = [
  {
    name: 'Camera routing',
    scope: 'webcam, capture card, virtual feed',
    readiness: 82,
    state: 'ready'
  },
  {
    name: 'Microphone routing',
    scope: 'USB mic, monitor mix, fallback source',
    readiness: 74,
    state: 'review'
  },
  {
    name: 'Meeting privacy',
    scope: 'browser grants, portals, remembered devices',
    readiness: 68,
    state: 'review'
  }
];

const fallbacks: FallbackStep[] = [
  {
    mode: 'Camera blocked',
    behavior: 'show avatar feed and keep microphone muted until chosen',
    privacy: 'no device opened',
    state: 'ready'
  },
  {
    mode: 'Mic unavailable',
    behavior: 'route to push-to-talk text notes and captions',
    privacy: 'source remains disconnected',
    state: 'review'
  },
  {
    mode: 'Portal missing',
    behavior: 'deny launch for meeting profile until portal service is active',
    privacy: 'hard stop',
    state: 'blocked'
  }
];

const stagedActions: StagedAction[] = [
  {
    target: 'Portal baseline',
    action: 'Confirm camera and device prompts are mediated by the user portal session',
    command: 'systemctl --user status xdg-desktop-portal',
    state: 'ready'
  },
  {
    target: 'Microphone inventory',
    action: 'Compare visible sources before approving meeting and studio profiles',
    command: 'wpctl status && pactl list sources short',
    state: 'review'
  },
  {
    target: 'Browser grants',
    action: 'Reset stale WebRTC permissions before validating a new camera route',
    command: 'xdg-open chrome://settings/content/camera',
    state: 'review'
  },
  {
    target: 'Legacy device path',
    action: 'Block direct /dev/video access until the app uses portal-mediated capture',
    command: 'ls -l /dev/video*',
    state: 'blocked'
  }
];

const stateLabels: Record<PermissionState, string> = {
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
            <p className="eyebrow">Media portals</p>
            <h1 id="page-title">Camera Mic Lab</h1>
          </div>
          <button type="button">Stage Meeting Profile</button>
        </header>

        <section className="metrics" aria-label="Camera and microphone permission summary">
          <article>
            <span>{routes.length}</span>
            <p>media flows</p>
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
          <section className="routePanel" aria-label="Camera and microphone permission matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Permission matrix</p>
                <h2>Camera portals, microphone sources, remembered grants, and meeting profiles</h2>
              </div>
              <div className="mediaBadge">
                <span />
                portal mediated
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
                      <small>camera</small>
                      <strong>{route.camera}</strong>
                    </div>
                    <div>
                      <small>microphone</small>
                      <strong>{route.microphone}</strong>
                    </div>
                    <div>
                      <small>grant</small>
                      <strong>{route.grant}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Camera and microphone portal preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Meeting permission route</h2>
                </div>
              </div>
              <pre aria-label="Meeting permission route preview">{`meeting profile
  -> browser requests camera + microphone
  -> xdg-desktop-portal mediates choice
  -> PipeWire node + audio source selected
  -> session grant tracked
  -> revoke or reset per profile`}</pre>
            </section>

            <section className="profilePanel" aria-label="Camera and microphone readiness profiles">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Profiles</p>
                  <h2>Device readiness</h2>
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
                    <meter min="0" max="100" value={profile.readiness} aria-label={`${profile.name} readiness`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="fallbackPanel" aria-label="Privacy fallback behavior">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Fallbacks</p>
                  <h2>Privacy behavior</h2>
                </div>
              </div>
              <div className="fallbackList">
                {fallbacks.map((fallback) => (
                  <article data-state={fallback.state} key={fallback.mode}>
                    <span>{stateLabels[fallback.state]}</span>
                    <h3>{fallback.mode}</h3>
                    <p>{fallback.behavior}</p>
                    <strong>{fallback.privacy}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="actionPanel" aria-label="Staged camera and microphone checks">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged checks</p>
                  <h2>Terminal probes</h2>
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
