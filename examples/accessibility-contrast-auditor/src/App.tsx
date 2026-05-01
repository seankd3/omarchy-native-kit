type AuditState = 'pass' | 'review' | 'fail';

type SurfaceAudit = {
  surface: string;
  contrast: string;
  focus: string;
  motion: string;
  target: string;
  state: AuditState;
};

type ScaleProfile = {
  name: string;
  fontScale: string;
  lineHeight: string;
  targetScore: number;
  state: AuditState;
};

type StagedFix = {
  target: string;
  action: string;
  command: string;
  state: AuditState;
};

const audits: SurfaceAudit[] = [
  {
    surface: 'Command menus',
    contrast: '7.8:1',
    focus: '2px token ring',
    motion: 'instant',
    target: '44px rows',
    state: 'pass'
  },
  {
    surface: 'Status badges',
    contrast: '4.9:1',
    focus: 'visible on hover rows',
    motion: 'subtle fade',
    target: '38px controls',
    state: 'review'
  },
  {
    surface: 'Dense tables',
    contrast: '6.4:1',
    focus: 'cell outline',
    motion: 'none',
    target: '40px rows',
    state: 'pass'
  },
  {
    surface: 'Icon-only tools',
    contrast: '3.1:1',
    focus: 'missing tooltip parity',
    motion: 'scale pulse',
    target: '32px buttons',
    state: 'fail'
  }
];

const scaleProfiles: ScaleProfile[] = [
  {
    name: 'Default desktop',
    fontScale: '1.00',
    lineHeight: '1.5',
    targetScore: 91,
    state: 'pass'
  },
  {
    name: 'Large text',
    fontScale: '1.20',
    lineHeight: '1.55',
    targetScore: 84,
    state: 'review'
  },
  {
    name: 'Compact ops',
    fontScale: '0.92',
    lineHeight: '1.35',
    targetScore: 63,
    state: 'fail'
  }
];

const stagedFixes: StagedFix[] = [
  {
    target: 'Icon tool targets',
    action: 'Raise icon-only controls to the minimum pointer target size',
    command: 'min-inline-size: 44px; min-block-size: 44px;',
    state: 'fail'
  },
  {
    target: 'Reduced motion mode',
    action: 'Disable scale pulses when the desktop asks for reduced motion',
    command: '@media (prefers-reduced-motion: reduce) { transition: none; }',
    state: 'review'
  },
  {
    target: 'Focus token baseline',
    action: 'Keep all interactive rows on the generated focus token',
    command: 'outline: 2px solid var(--omarchy-focus);',
    state: 'pass'
  }
];

const stateLabels: Record<AuditState, string> = {
  pass: 'Pass',
  review: 'Review',
  fail: 'Fail'
};

const passCount = audits.filter((audit) => audit.state === 'pass').length;
const reviewCount = audits.filter((audit) => audit.state === 'review').length;
const failCount = audits.filter((audit) => audit.state === 'fail').length;

export function App() {
  return (
    <main className="shell">
      <section className="auditor" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Accessibility</p>
            <h1 id="page-title">Contrast Auditor</h1>
          </div>
          <button type="button">Stage Fixes</button>
        </header>

        <section className="metrics" aria-label="Accessibility audit summary">
          <article>
            <span>{audits.length}</span>
            <p>surfaces audited</p>
          </article>
          <article>
            <span>{passCount}</span>
            <p>passing</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{failCount}</span>
            <p>blocking issues</p>
          </article>
        </section>

        <section className="layout">
          <section className="auditPanel" aria-label="Accessibility surface audit">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Surface matrix</p>
                <h2>Contrast, focus rings, motion, and pointer target sizing</h2>
              </div>
              <div className="auditBadge">
                <span />
                wcag pass staged
              </div>
            </div>

            <div className="auditList" role="list">
              {audits.map((audit) => (
                <article className="auditRow" data-state={audit.state} key={audit.surface} role="listitem" tabIndex={0}>
                  <div className="auditTitle">
                    <span>{stateLabels[audit.state]}</span>
                    <h3>{audit.surface}</h3>
                    <p>{audit.contrast} contrast</p>
                  </div>
                  <div className="auditMeta">
                    <div>
                      <small>focus</small>
                      <strong>{audit.focus}</strong>
                    </div>
                    <div>
                      <small>motion</small>
                      <strong>{audit.motion}</strong>
                    </div>
                    <div>
                      <small>target</small>
                      <strong>{audit.target}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Accessibility preview controls">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Token contrast samples</h2>
                </div>
              </div>
              <div className="sampleGrid">
                <button type="button">Primary</button>
                <button className="secondary" type="button">Secondary</button>
                <a href="#page-title">Focusable Link</a>
                <label>
                  <input type="checkbox" defaultChecked />
                  reduced motion
                </label>
              </div>
            </section>

            <section className="scalePanel" aria-label="Font scaling profiles">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Scaling</p>
                  <h2>Text and target profiles</h2>
                </div>
              </div>
              <div className="scaleList">
                {scaleProfiles.map((profile) => (
                  <article data-state={profile.state} key={profile.name}>
                    <div>
                      <span>{stateLabels[profile.state]}</span>
                      <h3>{profile.name}</h3>
                      <p>font {profile.fontScale} / line {profile.lineHeight}</p>
                    </div>
                    <meter min="0" max="100" value={profile.targetScore} aria-label={`${profile.name} accessibility score`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="fixPanel" aria-label="Staged accessibility fixes">
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
