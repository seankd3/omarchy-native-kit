import { useMemo, useState } from 'react';

type Permission = {
  app: string;
  portal: 'Screen' | 'Files' | 'Links' | 'Notifications';
  current: string;
  proposed: string;
  affected: string;
  risk: 'safe' | 'review' | 'block';
};

const permissions: Permission[] = [
  {
    app: 'Docs Reader',
    portal: 'Files',
    current: 'read recent docs',
    proposed: 'read docs folder',
    affected: 'local documentation',
    risk: 'safe'
  },
  {
    app: 'Signal Desk',
    portal: 'Notifications',
    current: 'quiet',
    proposed: 'release alerts',
    affected: 'release workflow',
    risk: 'review'
  },
  {
    app: 'Browser',
    portal: 'Links',
    current: 'system default',
    proposed: 'open docs links in app',
    affected: 'http and https handlers',
    risk: 'review'
  },
  {
    app: 'Recorder',
    portal: 'Screen',
    current: 'denied',
    proposed: 'full screen capture',
    affected: 'all workspaces',
    risk: 'block'
  }
];

const riskClass: Record<Permission['risk'], string> = {
  safe: 'safe',
  review: 'review',
  block: 'block'
};

export function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePermission = permissions[activeIndex];
  const reviewCount = useMemo(() => permissions.filter((permission) => permission.risk !== 'safe').length, []);
  const safeCount = permissions.length - reviewCount;

  return (
    <main className="shell">
      <section className="workspace" aria-label="Portal permission center">
        <div className="topbar">
          <span className="app-id">portal.center</span>
          <span className="state">{reviewCount} review</span>
        </div>

        <section className="brief" aria-labelledby="brief-title">
          <div>
            <p className="eyebrow">Desktop integration review</p>
            <h1 id="brief-title">Check portals before handlers change.</h1>
          </div>
          <div className="meter" aria-label={`${safeCount} safe permissions`}>
            <strong>{safeCount}</strong>
            <span>safe</span>
          </div>
        </section>

        <div className="permissionGrid">
          <div className="permissionList" role="list" aria-label="Permission changes">
            {permissions.map((permission, index) => (
              <button
                className={`permissionRow ${index === activeIndex ? 'selected' : ''}`}
                key={`${permission.app}-${permission.portal}`}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span>
                  <strong>{permission.app}</strong>
                  <small>{permission.portal} portal</small>
                </span>
                <em className={riskClass[permission.risk]}>{permission.risk}</em>
              </button>
            ))}
          </div>

          <section className="comparison" aria-label="Current and proposed permission state">
            <div className="compareColumn">
              <span>Current</span>
              <strong>{activePermission.current}</strong>
            </div>
            <div className="compareColumn proposed">
              <span>Proposed</span>
              <strong>{activePermission.proposed}</strong>
            </div>
            <div className="affected">
              <span>Affected surface</span>
              <strong>{activePermission.affected}</strong>
            </div>
          </section>

          <aside className="inspector" aria-label="Permission inspector">
            <div className="portalCard">
              <span>{activePermission.portal} portal</span>
              <strong>{activePermission.app}</strong>
            </div>

            <dl>
              <div>
                <dt>Risk</dt>
                <dd>{activePermission.risk}</dd>
              </div>
              <div>
                <dt>Review cue</dt>
                <dd>{reviewCue(activePermission)}</dd>
              </div>
              <div>
                <dt>Apply mode</dt>
                <dd>Stage only; export after confirming defaults.</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}

function reviewCue(permission: Permission) {
  if (permission.risk === 'safe') return 'Narrow scope and obvious app owner; safe for a staged apply.';
  if (permission.risk === 'review') return 'Confirm the default handler impact before applying.';
  return 'Blocked until scope is reduced or explicit user consent is recorded.';
}
