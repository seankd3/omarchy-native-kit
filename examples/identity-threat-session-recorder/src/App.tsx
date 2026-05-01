type ThreatState = 'contained' | 'investigate' | 'revoke';

type Session = {
  user: string;
  app: string;
  location: string;
  evidence: string;
  token: string;
  state: ThreatState;
};

type ReplayClue = {
  title: string;
  source: string;
  detail: string;
  state: ThreatState;
};

type DevicePivot = {
  device: string;
  user: string;
  pivot: string;
  owner: string;
  state: ThreatState;
};

type RevocationPlan = {
  title: string;
  action: string;
  containment: string;
  rollback: string;
  state: ThreatState;
};

const sessions: Session[] = [
  {
    user: 'mira.sato',
    app: 'Finance Warehouse',
    location: 'Osaka then Frankfurt in 18 minutes',
    evidence: 'impossible travel with valid refresh token',
    token: 'refresh token age 41 days',
    state: 'revoke'
  },
  {
    user: 'jon.bell',
    app: 'Production Deploy',
    location: 'Austin trusted workspace',
    evidence: 'passkey sign-in and managed workstation',
    token: 'fresh session binding',
    state: 'contained'
  },
  {
    user: 'nadia.khan',
    app: 'Support Console',
    location: 'Toronto then unknown proxy',
    evidence: 'same token family from two networks',
    token: 'token replay suspicion',
    state: 'investigate'
  },
  {
    user: 'breakglass.release',
    app: 'Admin Console',
    location: 'unlisted country',
    evidence: 'break-glass account outside approved window',
    token: 'stale browser cookie',
    state: 'revoke'
  }
];

const clues: ReplayClue[] = [
  {
    title: 'Token family split',
    source: 'identity provider',
    detail: 'Two active sessions share a token family but disagree on device binding.',
    state: 'investigate'
  },
  {
    title: 'Impossible travel hit',
    source: 'risk engine',
    detail: 'Finance session hops continents faster than expected travel time.',
    state: 'revoke'
  },
  {
    title: 'Passkey proof intact',
    source: 'authenticator log',
    detail: 'Release approver session has fresh phishing-resistant proof.',
    state: 'contained'
  }
];

const pivots: DevicePivot[] = [
  {
    device: 'Laptop FIN-221',
    user: 'mira.sato',
    pivot: 'same browser cookie appears from unmanaged host',
    owner: 'finance systems',
    state: 'revoke'
  },
  {
    device: 'Workstation REL-018',
    user: 'jon.bell',
    pivot: 'no lateral session reuse detected',
    owner: 'release desk',
    state: 'contained'
  },
  {
    device: 'Tablet SUP-044',
    user: 'nadia.khan',
    pivot: 'support console session pivots through proxy ASN',
    owner: 'customer ops',
    state: 'investigate'
  }
];

const plans: RevocationPlan[] = [
  {
    title: 'Revoke finance token family',
    action: 'Kill refresh token family and require passkey re-auth on managed device.',
    containment: 'Warehouse queries pause until manager confirms owner intent.',
    rollback: 'Restore read-only access through audited exception if close process blocks.',
    state: 'revoke'
  },
  {
    title: 'Quarantine support proxy path',
    action: 'Force sign-out for proxy ASN and move support console to step-up.',
    containment: 'Keep existing trusted workspace sessions active for queue continuity.',
    rollback: 'Remove ASN block after device pivot review clears the session.',
    state: 'investigate'
  },
  {
    title: 'Preserve release approver',
    action: 'Keep deploy session active with passkey proof and fresh device posture.',
    containment: 'Monitor privileged commands for the next release window.',
    rollback: 'Move to revoke if device compliance feed goes stale.',
    state: 'contained'
  }
];

const labels: Record<ThreatState, string> = {
  contained: 'Contained',
  investigate: 'Investigate',
  revoke: 'Revoke'
};

const revokeCount = [...sessions, ...clues, ...pivots, ...plans].filter((item) => item.state === 'revoke').length;
const investigationCount = [...sessions, ...clues, ...pivots, ...plans].filter((item) => item.state === 'investigate').length;
const containedCount = [...sessions, ...clues, ...pivots, ...plans].filter((item) => item.state === 'contained').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Identity threat</p>
            <h1 id="page-title">Session Recorder</h1>
          </div>
          <button type="button">Stage Revocation</button>
        </header>

        <section className="summary" aria-label="Identity threat session summary">
          <article>
            <span>{sessions.length}</span>
            <p>risky sign-in sessions</p>
          </article>
          <article>
            <span>{revokeCount}</span>
            <p>revocation signals</p>
          </article>
          <article>
            <span>{investigationCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{containedCount}</span>
            <p>contained paths</p>
          </article>
        </section>

        <section className="sessionPanel" aria-label="Risky sign-in sessions and impossible travel evidence">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Timeline</p>
              <h2>Risky sign-in sessions, impossible travel evidence, token replay clues, device pivots, owner intent, containment status, and rollback-safe session revocation plans</h2>
            </div>
            <div className="signalBadge">
              <span />
              live evidence
            </div>
          </div>

          <div className="sessionGrid" role="list">
            {sessions.map((session) => (
              <article className="sessionCard" data-state={session.state} key={`${session.user}-${session.app}`} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[session.state]}</span>
                  <strong>{session.app}</strong>
                </div>
                <h3>{session.user}</h3>
                <p>{session.location}</p>
                <code>{session.evidence}</code>
                <small>{session.token}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="cluePanel" aria-labelledby="clues-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Replay</p>
              <h2 id="clues-title">Token replay clues</h2>
            </div>
            <div className="stack" role="list">
              {clues.map((clue) => (
                <article data-state={clue.state} key={clue.title} role="listitem" tabIndex={0}>
                  <span>{labels[clue.state]}</span>
                  <h3>{clue.title}</h3>
                  <p>{clue.source}</p>
                  <strong>{clue.detail}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="pivotPanel" aria-labelledby="pivots-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Devices</p>
              <h2 id="pivots-title">Device pivots</h2>
            </div>
            <div className="pivotList" role="list">
              {pivots.map((pivot) => (
                <article data-state={pivot.state} key={pivot.device} role="listitem" tabIndex={0}>
                  <span>{labels[pivot.state]}</span>
                  <div>
                    <h3>{pivot.device}</h3>
                    <p>{pivot.user}</p>
                  </div>
                  <code>{pivot.pivot}</code>
                  <strong>{pivot.owner}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="planPanel" aria-labelledby="plans-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Containment</p>
            <h2 id="plans-title">Rollback-safe session revocation plans</h2>
          </div>
          <div className="planGrid" role="list">
            {plans.map((plan) => (
              <article data-state={plan.state} key={plan.title} role="listitem" tabIndex={0}>
                <span>{labels[plan.state]}</span>
                <h3>{plan.title}</h3>
                <p>{plan.action}</p>
                <strong>{plan.containment}</strong>
                <code>{plan.rollback}</code>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
