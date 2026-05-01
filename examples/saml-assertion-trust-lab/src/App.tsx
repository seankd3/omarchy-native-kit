type TrustState = 'trusted' | 'review' | 'retire';

type SamlApp = {
  name: string;
  owner: string;
  idp: string;
  certificate: string;
  state: TrustState;
};

type AttributeFinding = {
  claim: string;
  app: string;
  evidence: string;
  state: TrustState;
};

type TrustAction = {
  title: string;
  target: string;
  rollback: string;
  state: TrustState;
};

type FederationWindow = {
  service: string;
  window: string;
  probe: string;
  state: TrustState;
};

const apps: SamlApp[] = [
  {
    name: 'Ops Console SSO',
    owner: 'platform',
    idp: 'primary workforce IdP',
    certificate: 'expires in 42 days',
    state: 'trusted'
  },
  {
    name: 'Payroll Bridge',
    owner: 'finance',
    idp: 'legacy IdP alias',
    certificate: 'expires in 9 days',
    state: 'review'
  },
  {
    name: 'Old Wiki Access',
    owner: 'unknown',
    idp: 'retired partner IdP',
    certificate: 'expired 81 days ago',
    state: 'retire'
  },
  {
    name: 'Analytics Notebook',
    owner: 'data',
    idp: 'primary workforce IdP',
    certificate: 'expires in 103 days',
    state: 'trusted'
  }
];

const findings: AttributeFinding[] = [
  {
    claim: 'mail, department, role',
    app: 'Ops Console SSO',
    evidence: 'Attributes match access policy and owner attestation',
    state: 'trusted'
  },
  {
    claim: 'employeeId, costCenter',
    app: 'Payroll Bridge',
    evidence: 'Cost center claim is unused by the service provider',
    state: 'review'
  },
  {
    claim: 'groups:*',
    app: 'Old Wiki Access',
    evidence: 'Wildcard group assertion still accepted by retired app',
    state: 'retire'
  }
];

const actions: TrustAction[] = [
  {
    title: 'Rotate payroll certificate',
    target: 'Upload new IdP signing cert and verify SP metadata',
    rollback: 'Keep current cert active until payroll login probe passes',
    state: 'review'
  },
  {
    title: 'Remove wildcard groups',
    target: 'Disable groups:* for Old Wiki Access',
    rollback: 'Restore only named groups through signed exception',
    state: 'retire'
  },
  {
    title: 'Keep ops attributes',
    target: 'Preserve mail, department, and role assertions',
    rollback: 'No rollback needed while owner intent remains fresh',
    state: 'trusted'
  }
];

const windows: FederationWindow[] = [
  {
    service: 'Old Wiki Access',
    window: 'today 18:00',
    probe: 'confirm no successful assertions in the last 30 days',
    state: 'retire'
  },
  {
    service: 'Payroll Bridge',
    window: 'finance freeze window',
    probe: 'test SP metadata and signed response after rotation',
    state: 'review'
  },
  {
    service: 'Ops Console SSO',
    window: 'next trust audit',
    probe: 'assertion replay test remains blocked',
    state: 'trusted'
  }
];

const labels: Record<TrustState, string> = {
  trusted: 'Trusted',
  review: 'Review',
  retire: 'Retire'
};

const trustedCount = apps.filter((app) => app.state === 'trusted').length + findings.filter((finding) => finding.state === 'trusted').length;
const reviewCount = apps.filter((app) => app.state === 'review').length + actions.filter((action) => action.state === 'review').length;
const retireCount = apps.filter((app) => app.state === 'retire').length + windows.filter((window) => window.state === 'retire').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">SAML federation trust</p>
            <h1 id="page-title">Trust Lab</h1>
          </div>
          <button type="button">Stage Federation Cleanup</button>
        </header>

        <section className="summary" aria-label="SAML trust posture summary">
          <article>
            <span>{apps.length}</span>
            <p>SAML apps</p>
          </article>
          <article>
            <span>{trustedCount}</span>
            <p>trusted assertions</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>review items</p>
          </article>
          <article>
            <span>{retireCount}</span>
            <p>retire actions</p>
          </article>
        </section>

        <section className="appPanel" aria-label="SAML app trust inventory">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Federation ledger</p>
              <h2>SAML apps, assertion attributes, stale identity provider trust, certificate expiry, owner intent, and rollback-safe federation cleanup</h2>
            </div>
            <div className="trustBadge">
              <span />
              signed assertions
            </div>
          </div>

          <div className="appGrid" role="list">
            {apps.map((app) => (
              <article className="appCard" data-state={app.state} key={app.name} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[app.state]}</span>
                  <strong>{app.certificate}</strong>
                </div>
                <h3>{app.name}</h3>
                <code>{app.idp}</code>
                <p>{app.owner}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="attributePanel" aria-labelledby="attributes-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Attributes</p>
              <h2 id="attributes-title">Assertion claim review</h2>
            </div>
            <div className="attributeList" role="list">
              {findings.map((finding) => (
                <article data-state={finding.state} key={finding.claim} role="listitem" tabIndex={0}>
                  <span>{labels[finding.state]}</span>
                  <h3>{finding.claim}</h3>
                  <p>{finding.app}</p>
                  <strong>{finding.evidence}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="actionPanel" aria-labelledby="actions-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Cleanup</p>
              <h2 id="actions-title">Rollback-safe federation actions</h2>
            </div>
            <div className="actionList" role="list">
              {actions.map((action) => (
                <article data-state={action.state} key={action.title} role="listitem" tabIndex={0}>
                  <span>{labels[action.state]}</span>
                  <h3>{action.title}</h3>
                  <p>{action.target}</p>
                  <strong>{action.rollback}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="windowPanel" aria-labelledby="windows-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Windows</p>
            <h2 id="windows-title">Trust change windows</h2>
          </div>
          <div className="windowList" role="list">
            {windows.map((item) => (
              <article data-state={item.state} key={item.service} role="listitem" tabIndex={0}>
                <span>{labels[item.state]}</span>
                <h3>{item.service}</h3>
                <p>{item.window}</p>
                <strong>{item.probe}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
