type ConsentState = 'approved' | 'review' | 'revoke';

type ConsentGrant = {
  app: string;
  owner: string;
  scopes: string;
  lastUsed: string;
  state: ConsentState;
};

type ScopeFinding = {
  title: string;
  source: string;
  evidence: string;
  state: ConsentState;
};

type ReviewStep = {
  step: string;
  detail: string;
  guard: string;
  state: ConsentState;
};

type RevocationPlan = {
  app: string;
  window: string;
  rollback: string;
  state: ConsentState;
};

const grants: ConsentGrant[] = [
  {
    app: 'Cal Sync Bridge',
    owner: 'scheduling',
    scopes: 'calendar.read calendar.events.write',
    lastUsed: '2 hours ago',
    state: 'approved'
  },
  {
    app: 'Pipeline Reporter',
    owner: 'release desk',
    scopes: 'repo.status.read user.email.read',
    lastUsed: '11 days ago',
    state: 'review'
  },
  {
    app: 'Legacy CRM Export',
    owner: 'unknown',
    scopes: 'contacts.read mail.read drive.read',
    lastUsed: '184 days ago',
    state: 'revoke'
  },
  {
    app: 'Notebook Publisher',
    owner: 'docs',
    scopes: 'drive.file.read drive.file.write',
    lastUsed: 'yesterday',
    state: 'approved'
  }
];

const findings: ScopeFinding[] = [
  {
    title: 'Mail scope without owner intent',
    source: 'Legacy CRM Export',
    evidence: 'No attestation and no mailbox access in six months',
    state: 'revoke'
  },
  {
    title: 'Email identity still required',
    source: 'Pipeline Reporter',
    evidence: 'Release status comment links back to deploy owner',
    state: 'review'
  },
  {
    title: 'Drive file access is bounded',
    source: 'Notebook Publisher',
    evidence: 'Grant limited to files created by the app',
    state: 'approved'
  }
];

const reviewSteps: ReviewStep[] = [
  {
    step: 'Owner attestation',
    detail: 'Collect explicit purpose, system owner, and expiry for every delegated grant.',
    guard: 'Block cleanup until the active owner has a rollback contact.',
    state: 'review'
  },
  {
    step: 'Scope narrowing',
    detail: 'Replace broad drive and mail scopes with file-level or read-only alternatives.',
    guard: 'Run the app probe before removing the existing consent.',
    state: 'approved'
  },
  {
    step: 'Consent cleanup',
    detail: 'Queue stale app access for revocation during a low-traffic window.',
    guard: 'Restore consent only through a signed request.',
    state: 'revoke'
  }
];

const revocations: RevocationPlan[] = [
  {
    app: 'Legacy CRM Export',
    window: 'today 17:30',
    rollback: 'temporary mail.read only after business owner signs',
    state: 'revoke'
  },
  {
    app: 'Pipeline Reporter',
    window: 'Friday release freeze',
    rollback: 'keep user.email.read until status probe passes',
    state: 'review'
  },
  {
    app: 'Cal Sync Bridge',
    window: 'next calendar audit',
    rollback: 'no change while current scope remains bounded',
    state: 'approved'
  }
];

const labels: Record<ConsentState, string> = {
  approved: 'Approved',
  review: 'Review',
  revoke: 'Revoke'
};

const approvedCount = grants.filter((grant) => grant.state === 'approved').length;
const reviewCount = grants.filter((grant) => grant.state === 'review').length + findings.filter((finding) => finding.state === 'review').length;
const revokeCount = grants.filter((grant) => grant.state === 'revoke').length + revocations.filter((plan) => plan.state === 'revoke').length;

export function App() {
  return (
    <main className="shell">
      <section className="board" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">OAuth consent review</p>
            <h1 id="page-title">Consent Board</h1>
          </div>
          <button type="button">Queue Cleanup</button>
        </header>

        <section className="scoreboard" aria-label="OAuth consent posture">
          <article>
            <span>{grants.length}</span>
            <p>active grants</p>
          </article>
          <article>
            <span>{approvedCount}</span>
            <p>bounded consents</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs owner review</p>
          </article>
          <article>
            <span>{revokeCount}</span>
            <p>cleanup actions</p>
          </article>
        </section>

        <section className="grantPanel" aria-label="Delegated OAuth grants">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Delegated scopes</p>
              <h2>OAuth grants, delegated scopes, stale app access, owner intent, revocation windows, and rollback-safe consent cleanup</h2>
            </div>
            <div className="syncBadge">
              <span />
              consent ledger
            </div>
          </div>

          <div className="grantGrid" role="list">
            {grants.map((grant) => (
              <article className="grantCard" data-state={grant.state} key={grant.app} role="listitem" tabIndex={0}>
                <div className="cardTopline">
                  <span>{labels[grant.state]}</span>
                  <strong>{grant.lastUsed}</strong>
                </div>
                <h3>{grant.app}</h3>
                <code>{grant.scopes}</code>
                <p>{grant.owner}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="reviewArea">
          <section className="findingPanel" aria-labelledby="findings-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Evidence</p>
              <h2 id="findings-title">Stale access findings</h2>
            </div>
            <div className="findingList" role="list">
              {findings.map((finding) => (
                <article data-state={finding.state} key={finding.title} role="listitem" tabIndex={0}>
                  <span>{labels[finding.state]}</span>
                  <h3>{finding.title}</h3>
                  <p>{finding.source}</p>
                  <strong>{finding.evidence}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="stepPanel" aria-labelledby="steps-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Decision path</p>
              <h2 id="steps-title">Rollback-safe cleanup</h2>
            </div>
            <div className="stepList" role="list">
              {reviewSteps.map((item) => (
                <article data-state={item.state} key={item.step} role="listitem" tabIndex={0}>
                  <span>{labels[item.state]}</span>
                  <h3>{item.step}</h3>
                  <p>{item.detail}</p>
                  <strong>{item.guard}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="revocationPanel" aria-labelledby="revocations-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Windows</p>
            <h2 id="revocations-title">Revocation windows</h2>
          </div>
          <div className="revocationList" role="list">
            {revocations.map((plan) => (
              <article data-state={plan.state} key={plan.app} role="listitem" tabIndex={0}>
                <span>{labels[plan.state]}</span>
                <h3>{plan.app}</h3>
                <p>{plan.window}</p>
                <strong>{plan.rollback}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
