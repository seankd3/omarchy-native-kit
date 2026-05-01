type Decision = 'allow' | 'step-up' | 'block';

type Rule = {
  name: string;
  target: string;
  signal: string;
  outcome: Decision;
  confidence: string;
};

type Scenario = {
  actor: string;
  app: string;
  device: string;
  identity: string;
  path: string;
  outcome: Decision;
};

type Exception = {
  name: string;
  owner: string;
  window: string;
  guardrail: string;
  outcome: Decision;
};

type Simulation = {
  title: string;
  change: string;
  impact: string;
  rollback: string;
  outcome: Decision;
};

const rules: Rule[] = [
  {
    name: 'Managed device required',
    target: 'finance warehouse',
    signal: 'compliant laptop and encrypted disk',
    outcome: 'allow',
    confidence: '98%'
  },
  {
    name: 'Identity risk challenge',
    target: 'production deploy',
    signal: 'new country, passkey available',
    outcome: 'step-up',
    confidence: '84%'
  },
  {
    name: 'Legacy auth block',
    target: 'admin console',
    signal: 'password-only client and stale token',
    outcome: 'block',
    confidence: '100%'
  },
  {
    name: 'Network trust boundary',
    target: 'support desk',
    signal: 'unknown network, healthy device',
    outcome: 'step-up',
    confidence: '76%'
  }
];

const scenarios: Scenario[] = [
  {
    actor: 'Release approver',
    app: 'Production Deploy',
    device: 'managed workstation',
    identity: 'low risk passkey',
    path: 'trusted workspace',
    outcome: 'allow'
  },
  {
    actor: 'Finance traveler',
    app: 'Finance Warehouse',
    device: 'managed laptop',
    identity: 'travel anomaly',
    path: 'new country',
    outcome: 'step-up'
  },
  {
    actor: 'Contract admin',
    app: 'Admin Console',
    device: 'unregistered host',
    identity: 'password fallback',
    path: 'public network',
    outcome: 'block'
  }
];

const exceptions: Exception[] = [
  {
    name: 'Break-glass production access',
    owner: 'incident commander',
    window: '45 minutes',
    guardrail: 'requires passkey, live ticket, and post-use review',
    outcome: 'step-up'
  },
  {
    name: 'Finance close travel',
    owner: 'finance systems',
    window: 'today 18:00',
    guardrail: 'manager intent and fresh device posture probe',
    outcome: 'step-up'
  },
  {
    name: 'Legacy admin bypass',
    owner: 'unclaimed',
    window: 'expired',
    guardrail: 'no rollback owner or session evidence',
    outcome: 'block'
  }
];

const simulations: Simulation[] = [
  {
    title: 'Require passkeys for deploy',
    change: 'Move release approvers from password plus OTP to phishing-resistant sign-in.',
    impact: 'Two service accounts need owner attestation before the rule ships.',
    rollback: 'Return to step-up for release desk only while passkey inventory is repaired.',
    outcome: 'step-up'
  },
  {
    title: 'Block legacy admin clients',
    change: 'Deny password-only flows and stale refresh tokens against admin surfaces.',
    impact: 'Three blocked paths, no active owner confirmed.',
    rollback: 'Emergency access runbook can grant a ticket-bound exception.',
    outcome: 'block'
  },
  {
    title: 'Preserve support desk access',
    change: 'Allow healthy support devices while requiring session step-up on unknown networks.',
    impact: 'No user lockout in the simulated support queue.',
    rollback: 'Drop to review mode if device compliance feed goes stale.',
    outcome: 'allow'
  }
];

const labels: Record<Decision, string> = {
  allow: 'Allow',
  'step-up': 'Step-up',
  block: 'Block'
};

const totalSignals = rules.length + scenarios.length + exceptions.length;
const blockedPaths = [...rules, ...scenarios, ...exceptions, ...simulations].filter((item) => item.outcome === 'block').length;
const stepUps = [...rules, ...scenarios, ...exceptions, ...simulations].filter((item) => item.outcome === 'step-up').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Conditional access</p>
            <h1 id="page-title">Policy Simulator</h1>
          </div>
          <button type="button">Run Simulation</button>
        </header>

        <section className="summary" aria-label="Conditional access simulation summary">
          <article>
            <span>{rules.length}</span>
            <p>active rules</p>
          </article>
          <article>
            <span>{totalSignals}</span>
            <p>device and identity signals</p>
          </article>
          <article>
            <span>{stepUps}</span>
            <p>step-up paths</p>
          </article>
          <article>
            <span>{blockedPaths}</span>
            <p>blocked paths</p>
          </article>
        </section>

        <section className="rulePanel" aria-label="Conditional access rules and signals">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Rules</p>
              <h2>Conditional access rules, device and identity signals, blocked paths, break-glass exceptions, owner intent, and rollback-safe policy simulations</h2>
            </div>
            <div className="liveBadge">
              <span />
              dry-run mode
            </div>
          </div>

          <div className="ruleGrid" role="list">
            {rules.map((rule) => (
              <article className="ruleCard" data-outcome={rule.outcome} key={rule.name} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[rule.outcome]}</span>
                  <strong>{rule.confidence}</strong>
                </div>
                <h3>{rule.name}</h3>
                <p>{rule.target}</p>
                <code>{rule.signal}</code>
              </article>
            ))}
          </div>
        </section>

        <section className="matrixPanel" aria-labelledby="matrix-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Signals</p>
            <h2 id="matrix-title">Access path matrix</h2>
          </div>
          <div className="scenarioList" role="list">
            {scenarios.map((scenario) => (
              <article data-outcome={scenario.outcome} key={scenario.actor} role="listitem" tabIndex={0}>
                <div>
                  <span>{labels[scenario.outcome]}</span>
                  <h3>{scenario.actor}</h3>
                  <p>{scenario.app}</p>
                </div>
                <dl>
                  <div>
                    <dt>Device</dt>
                    <dd>{scenario.device}</dd>
                  </div>
                  <div>
                    <dt>Identity</dt>
                    <dd>{scenario.identity}</dd>
                  </div>
                  <div>
                    <dt>Path</dt>
                    <dd>{scenario.path}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="exceptionPanel" aria-labelledby="exceptions-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Exceptions</p>
              <h2 id="exceptions-title">Break-glass windows</h2>
            </div>
            <div className="stack" role="list">
              {exceptions.map((exception) => (
                <article data-outcome={exception.outcome} key={exception.name} role="listitem" tabIndex={0}>
                  <span>{labels[exception.outcome]}</span>
                  <h3>{exception.name}</h3>
                  <p>{exception.owner}</p>
                  <strong>{exception.window}</strong>
                  <code>{exception.guardrail}</code>
                </article>
              ))}
            </div>
          </section>

          <section className="simulationPanel" aria-labelledby="simulations-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Simulation</p>
              <h2 id="simulations-title">Rollback-safe policy changes</h2>
            </div>
            <div className="stack" role="list">
              {simulations.map((simulation) => (
                <article data-outcome={simulation.outcome} key={simulation.title} role="listitem" tabIndex={0}>
                  <span>{labels[simulation.outcome]}</span>
                  <h3>{simulation.title}</h3>
                  <p>{simulation.change}</p>
                  <strong>{simulation.impact}</strong>
                  <code>{simulation.rollback}</code>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
