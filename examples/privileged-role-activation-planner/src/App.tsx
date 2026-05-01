type RoleState = 'approved' | 'review' | 'deactivate';

type Activation = {
  requester: string;
  role: string;
  window: string;
  reason: string;
  state: RoleState;
};

type Approval = {
  chain: string;
  owner: string;
  evidence: string;
  state: RoleState;
};

type Drift = {
  title: string;
  subject: string;
  detail: string;
  state: RoleState;
};

type Deactivation = {
  title: string;
  action: string;
  rollback: string;
  state: RoleState;
};

const activations: Activation[] = [
  {
    requester: 'Rina Patel',
    role: 'Production Database Admin',
    window: '45 minutes',
    reason: 'hotfix migration with ticket owner present',
    state: 'approved'
  },
  {
    requester: 'Breakglass Root',
    role: 'Cloud Organization Owner',
    window: 'expired',
    reason: 'emergency elevation has no incident commander attached',
    state: 'deactivate'
  },
  {
    requester: 'Milo Chen',
    role: 'Release Manager',
    window: '2 hours',
    reason: 'release freeze override needs second approver',
    state: 'review'
  },
  {
    requester: 'Service Pipeline',
    role: 'Package Publisher',
    window: 'standing',
    reason: 'automation path retained after temporary publish window',
    state: 'deactivate'
  }
];

const approvals: Approval[] = [
  {
    chain: 'Database hotfix',
    owner: 'data platform',
    evidence: 'ticket, migration plan, and rollback snapshot attached',
    state: 'approved'
  },
  {
    chain: 'Release freeze override',
    owner: 'release desk',
    evidence: 'one approval missing from service owner',
    state: 'review'
  },
  {
    chain: 'Emergency root',
    owner: 'unclaimed',
    evidence: 'break-glass use exceeds emergency window',
    state: 'deactivate'
  }
];

const drift: Drift[] = [
  {
    title: 'Standing publisher role',
    subject: 'Service Pipeline',
    detail: 'Just-in-time role was never deactivated after package promotion.',
    state: 'deactivate'
  },
  {
    title: 'Healthy DBA activation',
    subject: 'Rina Patel',
    detail: 'Activation scope matches ticket and expires before maintenance close.',
    state: 'approved'
  },
  {
    title: 'Risky assignment chain',
    subject: 'Milo Chen',
    detail: 'Role assignment is valid, but approval chain lacks owner intent.',
    state: 'review'
  }
];

const deactivations: Deactivation[] = [
  {
    title: 'Deactivate emergency root',
    action: 'End the expired organization-owner activation and rotate recovery note access.',
    rollback: 'Reopen through emergency access runbook with incident commander approval.',
    state: 'deactivate'
  },
  {
    title: 'Time-box release override',
    action: 'Keep role in review until the service owner confirms the freeze override.',
    rollback: 'Auto-expire if owner intent is not attached before release gate.',
    state: 'review'
  },
  {
    title: 'Preserve DBA hotfix',
    action: 'Allow database admin role until migration dry-run and rollback snapshot pass.',
    rollback: 'Drop role immediately if migration health probe fails.',
    state: 'approved'
  }
];

const labels: Record<RoleState, string> = {
  approved: 'Approved',
  review: 'Review',
  deactivate: 'Deactivate'
};

const deactivateCount = [...activations, ...approvals, ...drift, ...deactivations].filter((item) => item.state === 'deactivate').length;
const reviewCount = [...activations, ...approvals, ...drift, ...deactivations].filter((item) => item.state === 'review').length;
const approvedCount = [...activations, ...approvals, ...drift, ...deactivations].filter((item) => item.state === 'approved').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Privileged access</p>
            <h1 id="page-title">Role Activation Planner</h1>
          </div>
          <button type="button">Stage Role Change</button>
        </header>

        <section className="summary" aria-label="Privileged role activation summary">
          <article>
            <span>{activations.length}</span>
            <p>activation requests</p>
          </article>
          <article>
            <span>{approvedCount}</span>
            <p>approved windows</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>approval reviews</p>
          </article>
          <article>
            <span>{deactivateCount}</span>
            <p>deactivation actions</p>
          </article>
        </section>

        <section className="activationPanel" aria-label="Just-in-time privileged role activations">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Activation queue</p>
              <h2>Just-in-time privileged role activations, approval chains, risky assignments, standing access drift, owner intent, emergency elevation, and rollback-safe role deactivation plans</h2>
            </div>
            <div className="modeBadge">
              <span />
              dry-run only
            </div>
          </div>

          <div className="activationGrid" role="list">
            {activations.map((activation) => (
              <article className="activationCard" data-state={activation.state} key={`${activation.requester}-${activation.role}`} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[activation.state]}</span>
                  <strong>{activation.window}</strong>
                </div>
                <h3>{activation.requester}</h3>
                <p>{activation.role}</p>
                <code>{activation.reason}</code>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="approvalPanel" aria-labelledby="approvals-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Approvals</p>
              <h2 id="approvals-title">Approval chains</h2>
            </div>
            <div className="stack" role="list">
              {approvals.map((approval) => (
                <article data-state={approval.state} key={approval.chain} role="listitem" tabIndex={0}>
                  <span>{labels[approval.state]}</span>
                  <h3>{approval.chain}</h3>
                  <p>{approval.owner}</p>
                  <strong>{approval.evidence}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="driftPanel" aria-labelledby="drift-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Drift</p>
              <h2 id="drift-title">Standing access drift</h2>
            </div>
            <div className="driftList" role="list">
              {drift.map((item) => (
                <article data-state={item.state} key={item.title} role="listitem" tabIndex={0}>
                  <span>{labels[item.state]}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subject}</p>
                  </div>
                  <code>{item.detail}</code>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="deactivationPanel" aria-labelledby="deactivations-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Rollback</p>
            <h2 id="deactivations-title">Role deactivation plans</h2>
          </div>
          <div className="planGrid" role="list">
            {deactivations.map((plan) => (
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
