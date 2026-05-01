type AccessState = 'allowed' | 'review' | 'deny';

type ResourceAccess = {
  resource: string;
  owner: string;
  gate: string;
  risk: string;
  state: AccessState;
};

type RiskFinding = {
  title: string;
  subject: string;
  evidence: string;
  state: AccessState;
};

type PolicyChange = {
  title: string;
  change: string;
  rollback: string;
  state: AccessState;
};

type ExceptionWindow = {
  group: string;
  window: string;
  probe: string;
  state: AccessState;
};

const resources: ResourceAccess[] = [
  {
    resource: 'Production Deploy',
    owner: 'release desk',
    gate: 'managed device, passkey, low identity risk',
    risk: 'risk score 12',
    state: 'allowed'
  },
  {
    resource: 'Finance Warehouse',
    owner: 'finance',
    gate: 'managed device and location match',
    risk: 'travel anomaly',
    state: 'review'
  },
  {
    resource: 'Legacy Admin VPN',
    owner: 'unknown',
    gate: 'password fallback allowed',
    risk: 'risk score 91',
    state: 'deny'
  },
  {
    resource: 'Support Console',
    owner: 'customer ops',
    gate: 'device posture and session step-up',
    risk: 'risk score 18',
    state: 'allowed'
  }
];

const findings: RiskFinding[] = [
  {
    title: 'Password fallback on privileged VPN',
    subject: 'Legacy Admin VPN',
    evidence: 'Exception has no active owner and bypasses device posture gate',
    state: 'deny'
  },
  {
    title: 'Travel anomaly needs owner intent',
    subject: 'Finance Warehouse',
    evidence: 'Access request came from approved device but new country',
    state: 'review'
  },
  {
    title: 'Deploy access is bounded',
    subject: 'Production Deploy',
    evidence: 'Passkey, device posture, and low risk claim all passed',
    state: 'allowed'
  }
];

const changes: PolicyChange[] = [
  {
    title: 'Remove VPN fallback',
    change: 'Deny password-only sessions for privileged VPN access',
    rollback: 'Temporary allow only through break-glass policy owner',
    state: 'deny'
  },
  {
    title: 'Time-box finance travel',
    change: 'Keep finance access in review until manager confirms travel',
    rollback: 'Drop exception automatically if location probe fails',
    state: 'review'
  },
  {
    title: 'Preserve deploy route',
    change: 'Keep production deploy access for low-risk attested devices',
    rollback: 'Move route to review if device posture changes',
    state: 'allowed'
  }
];

const windows: ExceptionWindow[] = [
  {
    group: 'Legacy VPN users',
    window: 'immediate block',
    probe: 'confirm no active production sessions rely on fallback',
    state: 'deny'
  },
  {
    group: 'Finance travelers',
    window: 'today 18:00',
    probe: 'manager attestation and fresh device posture check',
    state: 'review'
  },
  {
    group: 'Release approvers',
    window: 'next release freeze',
    probe: 'deploy dry-run succeeds with zero-trust gates enforced',
    state: 'allowed'
  }
];

const labels: Record<AccessState, string> = {
  allowed: 'Allowed',
  review: 'Review',
  deny: 'Deny'
};

const allowedCount = resources.filter((resource) => resource.state === 'allowed').length + findings.filter((finding) => finding.state === 'allowed').length;
const reviewCount = resources.filter((resource) => resource.state === 'review').length + changes.filter((change) => change.state === 'review').length;
const denyCount = resources.filter((resource) => resource.state === 'deny').length + windows.filter((window) => window.state === 'deny').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Zero-trust access</p>
            <h1 id="page-title">Access Review</h1>
          </div>
          <button type="button">Stage Policy Change</button>
        </header>

        <section className="summary" aria-label="Zero-trust access summary">
          <article>
            <span>{resources.length}</span>
            <p>protected resources</p>
          </article>
          <article>
            <span>{allowedCount}</span>
            <p>healthy grants</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>review gates</p>
          </article>
          <article>
            <span>{denyCount}</span>
            <p>deny actions</p>
          </article>
        </section>

        <section className="resourcePanel" aria-label="Protected resource access inventory">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Access ledger</p>
              <h2>Protected resources, device posture gates, identity risk, stale access exceptions, owner intent, and rollback-safe zero-trust policy changes</h2>
            </div>
            <div className="accessBadge">
              <span />
              continuous trust
            </div>
          </div>

          <div className="resourceGrid" role="list">
            {resources.map((resource) => (
              <article className="resourceCard" data-state={resource.state} key={resource.resource} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[resource.state]}</span>
                  <strong>{resource.risk}</strong>
                </div>
                <h3>{resource.resource}</h3>
                <code>{resource.gate}</code>
                <p>{resource.owner}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="findingPanel" aria-labelledby="findings-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Risk</p>
              <h2 id="findings-title">Identity risk findings</h2>
            </div>
            <div className="findingList" role="list">
              {findings.map((finding) => (
                <article data-state={finding.state} key={finding.title} role="listitem" tabIndex={0}>
                  <span>{labels[finding.state]}</span>
                  <h3>{finding.title}</h3>
                  <p>{finding.subject}</p>
                  <strong>{finding.evidence}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="changePanel" aria-labelledby="changes-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Policy</p>
              <h2 id="changes-title">Rollback-safe gate changes</h2>
            </div>
            <div className="changeList" role="list">
              {changes.map((change) => (
                <article data-state={change.state} key={change.title} role="listitem" tabIndex={0}>
                  <span>{labels[change.state]}</span>
                  <h3>{change.title}</h3>
                  <p>{change.change}</p>
                  <strong>{change.rollback}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="windowPanel" aria-labelledby="windows-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Windows</p>
            <h2 id="windows-title">Exception windows</h2>
          </div>
          <div className="windowList" role="list">
            {windows.map((item) => (
              <article data-state={item.state} key={item.group} role="listitem" tabIndex={0}>
                <span>{labels[item.state]}</span>
                <h3>{item.group}</h3>
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
