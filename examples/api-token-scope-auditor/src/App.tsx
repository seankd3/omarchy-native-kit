type ScopeState = 'least' | 'review' | 'overbroad';

type TokenScope = {
  name: string;
  owner: string;
  scopes: string;
  age: string;
  state: ScopeState;
};

type IntentRecord = {
  owner: string;
  intent: string;
  evidence: string;
  expires: string;
  state: ScopeState;
};

type ReductionPlan = {
  title: string;
  remove: string;
  rollback: string;
  state: ScopeState;
};

type RevocationWindow = {
  service: string;
  window: string;
  probe: string;
  state: ScopeState;
};

const tokens: TokenScope[] = [
  {
    name: 'release automation',
    owner: 'release desk',
    scopes: 'repo:write packages:publish',
    age: '27 days',
    state: 'least'
  },
  {
    name: 'metrics dashboard',
    owner: 'observability',
    scopes: 'metrics:read admin:read',
    age: '116 days',
    state: 'review'
  },
  {
    name: 'legacy deploy bot',
    owner: 'unknown',
    scopes: 'repo:* org:admin secrets:write',
    age: '412 days',
    state: 'overbroad'
  },
  {
    name: 'sandbox worker',
    owner: 'platform',
    scopes: 'deploy:sandbox read:artifacts',
    age: '13 days',
    state: 'least'
  }
];

const intents: IntentRecord[] = [
  {
    owner: 'release desk',
    intent: 'publish signed packages after release approval',
    evidence: 'scope request matches release runbook',
    expires: '2026-05-30',
    state: 'least'
  },
  {
    owner: 'observability',
    intent: 'read service metrics and dashboard metadata',
    evidence: 'admin:read needs owner confirmation',
    expires: '2026-05-08',
    state: 'review'
  },
  {
    owner: 'platform',
    intent: 'deploy sandbox builds from CI',
    evidence: 'token bound to sandbox workspace',
    expires: '2026-05-14',
    state: 'least'
  },
  {
    owner: 'legacy integrations',
    intent: 'unknown automation path',
    evidence: 'no current owner attestation',
    expires: 'blocked',
    state: 'overbroad'
  }
];

const reductions: ReductionPlan[] = [
  {
    title: 'Remove org admin',
    remove: 'org:admin from legacy deploy bot',
    rollback: 'restore temporary scope only after owner signs request',
    state: 'overbroad'
  },
  {
    title: 'Trim dashboard reads',
    remove: 'admin:read from metrics dashboard',
    rollback: 'keep scope until dashboard probe passes',
    state: 'review'
  },
  {
    title: 'Keep release publishing',
    remove: 'no scope removal needed',
    rollback: 'preserve current token until next cadence',
    state: 'least'
  },
  {
    title: 'Restrict sandbox artifact reads',
    remove: 'global artifact read fallback',
    rollback: 'restore fallback if deploy probe fails',
    state: 'review'
  }
];

const revocations: RevocationWindow[] = [
  {
    service: 'legacy deploy bot',
    window: 'immediate owner review',
    probe: 'confirm no active jobs use admin scopes',
    state: 'overbroad'
  },
  {
    service: 'metrics dashboard',
    window: 'Friday 18:00',
    probe: 'dashboard loads with read-only metrics scope',
    state: 'review'
  },
  {
    service: 'release automation',
    window: 'next release window',
    probe: 'package publish dry-run passes',
    state: 'least'
  }
];

const stateLabels: Record<ScopeState, string> = {
  least: 'Least',
  review: 'Review',
  overbroad: 'Overbroad'
};

const leastCount = tokens.filter((token) => token.state === 'least').length + intents.filter((intent) => intent.state === 'least').length;
const reviewCount = tokens.filter((token) => token.state === 'review').length + reductions.filter((plan) => plan.state === 'review').length;
const overbroadCount = tokens.filter((token) => token.state === 'overbroad').length + revocations.filter((item) => item.state === 'overbroad').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">API token scopes</p>
            <h1 id="page-title">Scope Auditor</h1>
          </div>
          <button type="button">Stage Reduction</button>
        </header>

        <section className="summary" aria-label="API token scope summary">
          <article>
            <span>{tokens.length}</span>
            <p>tokens</p>
          </article>
          <article>
            <span>{leastCount}</span>
            <p>least privilege</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>review items</p>
          </article>
          <article>
            <span>{overbroadCount}</span>
            <p>overbroad</p>
          </article>
        </section>

        <section className="tokenPanel" aria-label="API token scope inventory">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Scope ledger</p>
              <h2>API token scopes, stale grants, owner intent, overbroad permissions, revocation windows, and rollback-safe scope reductions</h2>
            </div>
            <div className="scopeBadge">
              <span />
              least privilege
            </div>
          </div>

          <div className="tokenGrid" role="list">
            {tokens.map((token) => (
              <article className="tokenCard" data-state={token.state} key={token.name} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{stateLabels[token.state]}</span>
                  <strong>{token.age}</strong>
                </div>
                <h3>{token.name}</h3>
                <code>{token.scopes}</code>
                <p>{token.owner}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="intentPanel" aria-labelledby="intent-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Intent</p>
              <h2 id="intent-title">Owner attestations</h2>
            </div>
            <div className="intentList" role="list">
              {intents.map((intent) => (
                <article data-state={intent.state} key={intent.owner} role="listitem" tabIndex={0}>
                  <span>{stateLabels[intent.state]}</span>
                  <h3>{intent.owner}</h3>
                  <p>{intent.intent}</p>
                  <strong>{intent.evidence}</strong>
                  <small>{intent.expires}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="reductionPanel" aria-labelledby="reduction-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Reduction</p>
              <h2 id="reduction-title">Rollback-safe trims</h2>
            </div>
            <div className="reductionList" role="list">
              {reductions.map((plan) => (
                <article data-state={plan.state} key={plan.title} role="listitem" tabIndex={0}>
                  <span>{stateLabels[plan.state]}</span>
                  <h3>{plan.title}</h3>
                  <p>{plan.remove}</p>
                  <strong>{plan.rollback}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="revocationPanel" aria-labelledby="revocation-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Windows</p>
            <h2 id="revocation-title">Revocation windows</h2>
          </div>
          <div className="revocationList" role="list">
            {revocations.map((item) => (
              <article data-state={item.state} key={item.service} role="listitem" tabIndex={0}>
                <span>{stateLabels[item.state]}</span>
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
