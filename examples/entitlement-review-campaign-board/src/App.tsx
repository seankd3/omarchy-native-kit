type ReviewState = 'certified' | 'review' | 'remove';

type Campaign = {
  name: string;
  scope: string;
  due: string;
  evidence: string;
  state: ReviewState;
};

type ReviewerQueue = {
  reviewer: string;
  queue: string;
  overdue: string;
  signal: string;
  state: ReviewState;
};

type EntitlementFinding = {
  title: string;
  subject: string;
  detail: string;
  state: ReviewState;
};

type RemovalPlan = {
  title: string;
  action: string;
  exception: string;
  rollback: string;
  state: ReviewState;
};

const campaigns: Campaign[] = [
  {
    name: 'Finance Quarter Close',
    scope: 'warehouse readers and payroll exporters',
    due: 'today 17:00',
    evidence: 'manager attestations complete for payroll exporters',
    state: 'certified'
  },
  {
    name: 'Privileged SaaS Cleanup',
    scope: 'admin groups across support and sales tools',
    due: 'tomorrow 12:00',
    evidence: 'three reviewers have stale queues',
    state: 'review'
  },
  {
    name: 'Legacy VPN Group',
    scope: 'vpn-admins and temporary vendor roles',
    due: 'expired',
    evidence: 'orphaned role has no owner intent',
    state: 'remove'
  },
  {
    name: 'Engineering Deployers',
    scope: 'release approvers and package publishers',
    due: 'next release freeze',
    evidence: 'standing publisher access drift detected',
    state: 'review'
  }
];

const queues: ReviewerQueue[] = [
  {
    reviewer: 'Avery Stone',
    queue: 'Support SaaS admins',
    overdue: '9 items',
    signal: 'reviewer has accepted owner role but missed two reminders',
    state: 'review'
  },
  {
    reviewer: 'Priya Rao',
    queue: 'Finance exports',
    overdue: '0 items',
    signal: 'all high-risk entitlements certified with comments',
    state: 'certified'
  },
  {
    reviewer: 'Unassigned',
    queue: 'Legacy VPN admins',
    overdue: '14 items',
    signal: 'group owner removed from directory',
    state: 'remove'
  }
];

const findings: EntitlementFinding[] = [
  {
    title: 'Stale group membership',
    subject: 'support-admins',
    detail: 'Five members have not used privileged SaaS access in 120 days.',
    state: 'review'
  },
  {
    title: 'Orphaned role',
    subject: 'vpn-admins',
    detail: 'Directory group maps to a role with no current business owner.',
    state: 'remove'
  },
  {
    title: 'Certified exporter group',
    subject: 'payroll-exporters',
    detail: 'Reviewer comments match recent job function and access logs.',
    state: 'certified'
  }
];

const removals: RemovalPlan[] = [
  {
    title: 'Remove legacy VPN admins',
    action: 'Drop orphaned role mapping and disable temporary vendor group membership.',
    exception: 'Emergency access only through named owner and incident ticket.',
    rollback: 'Restore read-only VPN diagnostics for one hour if maintenance blocks.',
    state: 'remove'
  },
  {
    title: 'Time-box SaaS admin review',
    action: 'Keep stale support admins in review until queue owner confirms intent.',
    exception: 'Auto-expire reviewers that miss tomorrow noon checkpoint.',
    rollback: 'Reopen queue with delegated reviewer if support handoff is active.',
    state: 'review'
  },
  {
    title: 'Preserve payroll exporters',
    action: 'Certify payroll exporter access for quarter-close window.',
    exception: 'No exception required while access logs stay current.',
    rollback: 'Move to review if exporter job code changes.',
    state: 'certified'
  }
];

const labels: Record<ReviewState, string> = {
  certified: 'Certified',
  review: 'Review',
  remove: 'Remove'
};

const certifiedCount = [...campaigns, ...queues, ...findings, ...removals].filter((item) => item.state === 'certified').length;
const reviewCount = [...campaigns, ...queues, ...findings, ...removals].filter((item) => item.state === 'review').length;
const removeCount = [...campaigns, ...queues, ...findings, ...removals].filter((item) => item.state === 'remove').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Entitlement review</p>
            <h1 id="page-title">Campaign Board</h1>
          </div>
          <button type="button">Stage Removals</button>
        </header>

        <section className="summary" aria-label="Entitlement review campaign summary">
          <article>
            <span>{campaigns.length}</span>
            <p>active campaigns</p>
          </article>
          <article>
            <span>{certifiedCount}</span>
            <p>certified grants</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>review queues</p>
          </article>
          <article>
            <span>{removeCount}</span>
            <p>removal actions</p>
          </article>
        </section>

        <section className="campaignPanel" aria-label="Entitlement review campaigns">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Campaigns</p>
              <h2>Entitlement review campaigns, reviewer queues, stale group membership, orphaned roles, owner intent, exception windows, and rollback-safe access removals</h2>
            </div>
            <div className="modeBadge">
              <span />
              attestation mode
            </div>
          </div>

          <div className="campaignGrid" role="list">
            {campaigns.map((campaign) => (
              <article className="campaignCard" data-state={campaign.state} key={campaign.name} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[campaign.state]}</span>
                  <strong>{campaign.due}</strong>
                </div>
                <h3>{campaign.name}</h3>
                <p>{campaign.scope}</p>
                <code>{campaign.evidence}</code>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="queuePanel" aria-labelledby="queues-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Queues</p>
              <h2 id="queues-title">Reviewer queues</h2>
            </div>
            <div className="queueList" role="list">
              {queues.map((queue) => (
                <article data-state={queue.state} key={`${queue.reviewer}-${queue.queue}`} role="listitem" tabIndex={0}>
                  <span>{labels[queue.state]}</span>
                  <div>
                    <h3>{queue.reviewer}</h3>
                    <p>{queue.queue}</p>
                  </div>
                  <strong>{queue.overdue}</strong>
                  <code>{queue.signal}</code>
                </article>
              ))}
            </div>
          </section>

          <section className="findingPanel" aria-labelledby="findings-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Findings</p>
              <h2 id="findings-title">Membership and role drift</h2>
            </div>
            <div className="stack" role="list">
              {findings.map((finding) => (
                <article data-state={finding.state} key={finding.title} role="listitem" tabIndex={0}>
                  <span>{labels[finding.state]}</span>
                  <h3>{finding.title}</h3>
                  <p>{finding.subject}</p>
                  <strong>{finding.detail}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="removalPanel" aria-labelledby="removals-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Rollback</p>
            <h2 id="removals-title">Access removal plans</h2>
          </div>
          <div className="removalGrid" role="list">
            {removals.map((removal) => (
              <article data-state={removal.state} key={removal.title} role="listitem" tabIndex={0}>
                <span>{labels[removal.state]}</span>
                <h3>{removal.title}</h3>
                <p>{removal.action}</p>
                <strong>{removal.exception}</strong>
                <code>{removal.rollback}</code>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
