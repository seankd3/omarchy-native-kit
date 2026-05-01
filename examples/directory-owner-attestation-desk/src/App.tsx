type OwnerState = 'attested' | 'escalate' | 'reassign';

type ResourceOwner = {
  resource: string;
  owner: string;
  steward: string;
  attestation: string;
  state: OwnerState;
};

type ApproverRisk = {
  title: string;
  subject: string;
  evidence: string;
  state: OwnerState;
};

type GroupRisk = {
  group: string;
  owner: string;
  risk: string;
  window: string;
  state: OwnerState;
};

type ReassignmentPlan = {
  title: string;
  action: string;
  rollback: string;
  state: OwnerState;
};

const owners: ResourceOwner[] = [
  {
    resource: 'Finance Warehouse',
    owner: 'Priya Rao',
    steward: 'finance systems',
    attestation: 'signed today with exporter review',
    state: 'attested'
  },
  {
    resource: 'Support SaaS Admins',
    owner: 'Avery Stone',
    steward: 'customer ops delegate',
    attestation: 'pending delegated stewardship confirmation',
    state: 'escalate'
  },
  {
    resource: 'Legacy VPN Admins',
    owner: 'departed employee',
    steward: 'none',
    attestation: 'missing for two campaigns',
    state: 'reassign'
  },
  {
    resource: 'Release Publishers',
    owner: 'release desk',
    steward: 'package platform',
    attestation: 'signed for next release window',
    state: 'attested'
  }
];

const approverRisks: ApproverRisk[] = [
  {
    title: 'Stale approver',
    subject: 'Legacy VPN Admins',
    evidence: 'Owner is inactive but still receives approval tasks.',
    state: 'reassign'
  },
  {
    title: 'Delegated stewardship needs proof',
    subject: 'Support SaaS Admins',
    evidence: 'Delegate accepted queue but has not attached owner intent.',
    state: 'escalate'
  },
  {
    title: 'Release ownership healthy',
    subject: 'Release Publishers',
    evidence: 'Steward and owner agree on release-freeze access.',
    state: 'attested'
  }
];

const groupRisks: GroupRisk[] = [
  {
    group: 'vpn-admins-legacy',
    owner: 'departed employee',
    risk: 'orphaned owner with privileged nesting',
    window: 'immediate',
    state: 'reassign'
  },
  {
    group: 'support-admins-nested',
    owner: 'customer ops delegate',
    risk: 'delegation lacks attestation evidence',
    window: 'tomorrow noon',
    state: 'escalate'
  },
  {
    group: 'release-publishers',
    owner: 'release desk',
    risk: 'bounded to release window',
    window: 'next freeze',
    state: 'attested'
  }
];

const plans: ReassignmentPlan[] = [
  {
    title: 'Reassign legacy VPN owner',
    action: 'Move ownership to incident access desk and suspend stale approver tasks.',
    rollback: 'Restore read-only reviewer queue if VPN maintenance is active.',
    state: 'reassign'
  },
  {
    title: 'Escalate support stewardship',
    action: 'Ask customer ops lead to confirm delegated stewardship before tomorrow noon.',
    rollback: 'Delegate to backup service owner if the primary owner misses the window.',
    state: 'escalate'
  },
  {
    title: 'Preserve release owner',
    action: 'Keep release desk as owner while package platform remains steward.',
    rollback: 'Move to escalation if publisher membership changes.',
    state: 'attested'
  }
];

const labels: Record<OwnerState, string> = {
  attested: 'Attested',
  escalate: 'Escalate',
  reassign: 'Reassign'
};

const attestedCount = [...owners, ...approverRisks, ...groupRisks, ...plans].filter((item) => item.state === 'attested').length;
const escalationCount = [...owners, ...approverRisks, ...groupRisks, ...plans].filter((item) => item.state === 'escalate').length;
const reassignCount = [...owners, ...approverRisks, ...groupRisks, ...plans].filter((item) => item.state === 'reassign').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Directory ownership</p>
            <h1 id="page-title">Owner Attestation Desk</h1>
          </div>
          <button type="button">Stage Reassignment</button>
        </header>

        <section className="summary" aria-label="Directory owner attestation summary">
          <article>
            <span>{owners.length}</span>
            <p>resource owners</p>
          </article>
          <article>
            <span>{attestedCount}</span>
            <p>attested paths</p>
          </article>
          <article>
            <span>{escalationCount}</span>
            <p>escalation windows</p>
          </article>
          <article>
            <span>{reassignCount}</span>
            <p>reassignments</p>
          </article>
        </section>

        <section className="ownerPanel" aria-label="Directory resource owners">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Ownership</p>
              <h2>Directory resource owners, stale approvers, delegated stewardship, missing attestations, group risk, escalation windows, and rollback-safe owner reassignment</h2>
            </div>
            <div className="modeBadge">
              <span />
              attestation queue
            </div>
          </div>

          <div className="ownerGrid" role="list">
            {owners.map((owner) => (
              <article className="ownerCard" data-state={owner.state} key={owner.resource} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[owner.state]}</span>
                  <strong>{owner.owner}</strong>
                </div>
                <h3>{owner.resource}</h3>
                <p>{owner.steward}</p>
                <code>{owner.attestation}</code>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="riskPanel" aria-labelledby="approver-risks-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Approvers</p>
              <h2 id="approver-risks-title">Approver risk</h2>
            </div>
            <div className="stack" role="list">
              {approverRisks.map((risk) => (
                <article data-state={risk.state} key={risk.title} role="listitem" tabIndex={0}>
                  <span>{labels[risk.state]}</span>
                  <h3>{risk.title}</h3>
                  <p>{risk.subject}</p>
                  <strong>{risk.evidence}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="groupPanel" aria-labelledby="group-risk-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Groups</p>
              <h2 id="group-risk-title">Group risk windows</h2>
            </div>
            <div className="groupList" role="list">
              {groupRisks.map((risk) => (
                <article data-state={risk.state} key={risk.group} role="listitem" tabIndex={0}>
                  <span>{labels[risk.state]}</span>
                  <div>
                    <h3>{risk.group}</h3>
                    <p>{risk.owner}</p>
                  </div>
                  <strong>{risk.window}</strong>
                  <code>{risk.risk}</code>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="planPanel" aria-labelledby="plans-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Rollback</p>
            <h2 id="plans-title">Owner reassignment plans</h2>
          </div>
          <div className="planGrid" role="list">
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
