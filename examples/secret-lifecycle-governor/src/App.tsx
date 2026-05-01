type LifecycleState = 'current' | 'review' | 'retire';

type SecretRecord = {
  name: string;
  born: string;
  owner: string;
  cadence: string;
  state: LifecycleState;
};

type Attestation = {
  owner: string;
  scope: string;
  evidence: string;
  nextReview: string;
  state: LifecycleState;
};

type ConsumerDrift = {
  service: string;
  expected: string;
  observed: string;
  action: string;
  state: LifecycleState;
};

type DeletionPlan = {
  title: string;
  readiness: string;
  rollback: string;
  state: LifecycleState;
};

const secrets: SecretRecord[] = [
  {
    name: 'release signing token',
    born: '2026-02-14',
    owner: 'release desk',
    cadence: '30 days',
    state: 'current'
  },
  {
    name: 'metrics read key',
    born: '2025-12-03',
    owner: 'observability',
    cadence: '90 days',
    state: 'review'
  },
  {
    name: 'legacy webhook secret',
    born: '2024-09-19',
    owner: 'unknown',
    cadence: 'missing',
    state: 'retire'
  },
  {
    name: 'sandbox deploy token',
    born: '2026-04-11',
    owner: 'platform',
    cadence: '14 days',
    state: 'current'
  }
];

const attestations: Attestation[] = [
  {
    owner: 'release desk',
    scope: 'package publishing and release hooks',
    evidence: 'owner signed current token inventory',
    nextReview: '2026-05-14',
    state: 'current'
  },
  {
    owner: 'observability',
    scope: 'metrics readers and dashboards',
    evidence: 'consumer list needs one service check',
    nextReview: '2026-05-08',
    state: 'review'
  },
  {
    owner: 'platform',
    scope: 'sandbox deployment workers',
    evidence: 'rotation cadence confirmed in runbook',
    nextReview: '2026-05-12',
    state: 'current'
  },
  {
    owner: 'legacy integrations',
    scope: 'old webhook receivers',
    evidence: 'no accountable owner found',
    nextReview: 'blocked',
    state: 'retire'
  }
];

const drifts: ConsumerDrift[] = [
  {
    service: 'release-worker',
    expected: 'v4 token',
    observed: 'v4 token',
    action: 'keep current cadence',
    state: 'current'
  },
  {
    service: 'metrics-exporter',
    expected: 'read key v3',
    observed: 'read key v2',
    action: 'reload service after owner review',
    state: 'review'
  },
  {
    service: 'legacy-webhook',
    expected: 'no secret',
    observed: 'old shared secret',
    action: 'retire after receiver shutdown',
    state: 'retire'
  }
];

const deletionPlans: DeletionPlan[] = [
  {
    title: 'Expire unused versions',
    readiness: 'all consumers moved to current secret version',
    rollback: 'restore previous version while audit window is open',
    state: 'current'
  },
  {
    title: 'Retire orphaned webhook',
    readiness: 'blocked until owner and receiver shutdown are confirmed',
    rollback: 'disable routing before deleting shared secret',
    state: 'retire'
  },
  {
    title: 'Tighten rotation cadence',
    readiness: 'observability service needs reload proof',
    rollback: 'keep 90-day cadence until service drift is gone',
    state: 'review'
  },
  {
    title: 'Archive lifecycle evidence',
    readiness: 'attestations and deletion proof are sealed',
    rollback: 'reopen lifecycle review if evidence is incomplete',
    state: 'current'
  }
];

const stateLabels: Record<LifecycleState, string> = {
  current: 'Current',
  review: 'Review',
  retire: 'Retire'
};

const currentCount = secrets.filter((secret) => secret.state === 'current').length + attestations.filter((item) => item.state === 'current').length;
const reviewCount = secrets.filter((secret) => secret.state === 'review').length + drifts.filter((item) => item.state === 'review').length;
const retireCount = secrets.filter((secret) => secret.state === 'retire').length + deletionPlans.filter((item) => item.state === 'retire').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Secret governance</p>
            <h1 id="page-title">Lifecycle Governor</h1>
          </div>
          <button type="button">Start Review</button>
        </header>

        <section className="summary" aria-label="Secret lifecycle summary">
          <article>
            <span>{secrets.length}</span>
            <p>tracked secrets</p>
          </article>
          <article>
            <span>{currentCount}</span>
            <p>current proofs</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>review items</p>
          </article>
          <article>
            <span>{retireCount}</span>
            <p>retire paths</p>
          </article>
        </section>

        <section className="secretPanel" aria-label="Secret lifecycle inventory">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Lifecycle ledger</p>
              <h2>Secret birth, owner attestations, rotation cadence, consumer drift, deletion readiness, and policy-safe lifecycle changes</h2>
            </div>
            <div className="lifecycleBadge">
              <span />
              policy safe
            </div>
          </div>

          <div className="secretGrid" role="list">
            {secrets.map((secret) => (
              <article className="secretCard" data-state={secret.state} key={secret.name} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{stateLabels[secret.state]}</span>
                  <strong>{secret.cadence}</strong>
                </div>
                <h3>{secret.name}</h3>
                <dl>
                  <div>
                    <dt>Born</dt>
                    <dd>{secret.born}</dd>
                  </div>
                  <div>
                    <dt>Owner</dt>
                    <dd>{secret.owner}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="attestationPanel" aria-labelledby="attestation-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Owners</p>
              <h2 id="attestation-title">Attestation queue</h2>
            </div>
            <div className="attestationList" role="list">
              {attestations.map((item) => (
                <article data-state={item.state} key={item.owner} role="listitem" tabIndex={0}>
                  <span>{stateLabels[item.state]}</span>
                  <h3>{item.owner}</h3>
                  <p>{item.scope}</p>
                  <strong>{item.evidence}</strong>
                  <small>{item.nextReview}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="driftPanel" aria-labelledby="drift-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Consumers</p>
              <h2 id="drift-title">Consumer drift</h2>
            </div>
            <div className="driftList" role="list">
              {drifts.map((item) => (
                <article data-state={item.state} key={item.service} role="listitem" tabIndex={0}>
                  <span>{stateLabels[item.state]}</span>
                  <h3>{item.service}</h3>
                  <p>{item.expected}</p>
                  <code>{item.observed}</code>
                  <strong>{item.action}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="deletionPanel" aria-labelledby="deletion-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Deletion</p>
            <h2 id="deletion-title">Policy-safe lifecycle changes</h2>
          </div>
          <div className="deletionList" role="list">
            {deletionPlans.map((item) => (
              <article data-state={item.state} key={item.title} role="listitem" tabIndex={0}>
                <span>{stateLabels[item.state]}</span>
                <h3>{item.title}</h3>
                <p>{item.readiness}</p>
                <strong>{item.rollback}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
