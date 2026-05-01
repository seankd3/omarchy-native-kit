type LifecycleState = 'aligned' | 'handoff' | 'cleanup';

type LifecyclePolicy = {
  phase: string;
  subject: string;
  manager: string;
  evidence: string;
  state: LifecycleState;
};

type IdentityFinding = {
  title: string;
  identity: string;
  evidence: string;
  state: LifecycleState;
};

type EntitlementDrift = {
  app: string;
  identity: string;
  drift: string;
  window: string;
  state: LifecycleState;
};

type CleanupPlan = {
  title: string;
  action: string;
  rollback: string;
  state: LifecycleState;
};

const policies: LifecyclePolicy[] = [
  {
    phase: 'Joiner',
    subject: 'new finance analyst',
    manager: 'Priya Rao',
    evidence: 'baseline roles match onboarding template',
    state: 'aligned'
  },
  {
    phase: 'Mover',
    subject: 'support lead to sales ops',
    manager: 'pending handoff',
    evidence: 'old support admin role waits on receiving manager',
    state: 'handoff'
  },
  {
    phase: 'Leaver',
    subject: 'departed VPN operator',
    manager: 'inactive',
    evidence: 'account is suspended but nested group remains active',
    state: 'cleanup'
  },
  {
    phase: 'Contractor renewal',
    subject: 'package publishing vendor',
    manager: 'release desk',
    evidence: 'exception window expires tonight',
    state: 'handoff'
  }
];

const findings: IdentityFinding[] = [
  {
    title: 'Suspended account retains group',
    identity: 'alex.morgan',
    evidence: 'Leaver account is suspended but keeps vpn-admins-legacy membership.',
    state: 'cleanup'
  },
  {
    title: 'Manager handoff missing',
    identity: 'sam.lee',
    evidence: 'Mover workflow lacks receiving manager sign-off for SaaS admin removal.',
    state: 'handoff'
  },
  {
    title: 'Joiner access aligned',
    identity: 'tessa.kim',
    evidence: 'New finance access matches job code and manager attestation.',
    state: 'aligned'
  }
];

const drift: EntitlementDrift[] = [
  {
    app: 'Legacy VPN',
    identity: 'alex.morgan',
    drift: 'suspended leaver still inherits privileged VPN group',
    window: 'immediate',
    state: 'cleanup'
  },
  {
    app: 'Support SaaS',
    identity: 'sam.lee',
    drift: 'old support admin role carried into sales ops',
    window: 'today 16:00',
    state: 'handoff'
  },
  {
    app: 'Finance Warehouse',
    identity: 'tessa.kim',
    drift: 'no drift against finance analyst template',
    window: 'next review',
    state: 'aligned'
  }
];

const plans: CleanupPlan[] = [
  {
    title: 'Clean suspended leaver',
    action: 'Remove inherited VPN admin group and close stale lifecycle ticket.',
    rollback: 'Restore diagnostics-only access if offboarding validation blocks payroll freeze.',
    state: 'cleanup'
  },
  {
    title: 'Complete manager handoff',
    action: 'Require receiving manager sign-off before sales ops role remains active.',
    rollback: 'Delegate approval to department owner if manager record is not repaired today.',
    state: 'handoff'
  },
  {
    title: 'Preserve finance joiner',
    action: 'Keep baseline warehouse access while onboarding attestation remains current.',
    rollback: 'Move to handoff if job code or manager changes.',
    state: 'aligned'
  }
];

const labels: Record<LifecycleState, string> = {
  aligned: 'Aligned',
  handoff: 'Handoff',
  cleanup: 'Cleanup'
};

const alignedCount = [...policies, ...findings, ...drift, ...plans].filter((item) => item.state === 'aligned').length;
const handoffCount = [...policies, ...findings, ...drift, ...plans].filter((item) => item.state === 'handoff').length;
const cleanupCount = [...policies, ...findings, ...drift, ...plans].filter((item) => item.state === 'cleanup').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Directory lifecycle</p>
            <h1 id="page-title">Policy Lab</h1>
          </div>
          <button type="button">Stage Cleanup</button>
        </header>

        <section className="summary" aria-label="Directory lifecycle policy summary">
          <article>
            <span>{policies.length}</span>
            <p>lifecycle policies</p>
          </article>
          <article>
            <span>{alignedCount}</span>
            <p>aligned identities</p>
          </article>
          <article>
            <span>{handoffCount}</span>
            <p>manager handoffs</p>
          </article>
          <article>
            <span>{cleanupCount}</span>
            <p>cleanup actions</p>
          </article>
        </section>

        <section className="policyPanel" aria-label="Joiner mover leaver lifecycle policies">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Lifecycle</p>
              <h2>Joiner-mover-leaver lifecycle policy, stale identities, manager handoffs, suspended accounts, entitlement drift, exception windows, and rollback-safe lifecycle cleanup</h2>
            </div>
            <div className="modeBadge">
              <span />
              policy preview
            </div>
          </div>

          <div className="policyGrid" role="list">
            {policies.map((policy) => (
              <article className="policyCard" data-state={policy.state} key={`${policy.phase}-${policy.subject}`} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[policy.state]}</span>
                  <strong>{policy.phase}</strong>
                </div>
                <h3>{policy.subject}</h3>
                <p>{policy.manager}</p>
                <code>{policy.evidence}</code>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="findingPanel" aria-labelledby="findings-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Identities</p>
              <h2 id="findings-title">Stale identity findings</h2>
            </div>
            <div className="stack" role="list">
              {findings.map((finding) => (
                <article data-state={finding.state} key={finding.title} role="listitem" tabIndex={0}>
                  <span>{labels[finding.state]}</span>
                  <h3>{finding.title}</h3>
                  <p>{finding.identity}</p>
                  <strong>{finding.evidence}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="driftPanel" aria-labelledby="drift-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Drift</p>
              <h2 id="drift-title">Entitlement drift windows</h2>
            </div>
            <div className="driftList" role="list">
              {drift.map((item) => (
                <article data-state={item.state} key={`${item.app}-${item.identity}`} role="listitem" tabIndex={0}>
                  <span>{labels[item.state]}</span>
                  <div>
                    <h3>{item.app}</h3>
                    <p>{item.identity}</p>
                  </div>
                  <strong>{item.window}</strong>
                  <code>{item.drift}</code>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="cleanupPanel" aria-labelledby="cleanup-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Rollback</p>
            <h2 id="cleanup-title">Lifecycle cleanup plans</h2>
          </div>
          <div className="cleanupGrid" role="list">
            {plans.map((plan) => (
              <article data-state={plan.state} key={plan.title} role="listitem" tabIndex={0}>
                <span>{labels[plan.state]}</span>
                <h3>{plan.title}</h3>
                <p>{plan.action}</p>
                <code>{plan.rollback}</code>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
