type NestingState = 'clear' | 'review' | 'cleanup';

type GroupNode = {
  group: string;
  parent: string;
  privilege: string;
  owner: string;
  state: NestingState;
};

type MembershipFinding = {
  title: string;
  subject: string;
  evidence: string;
  state: NestingState;
};

type AppEntitlement = {
  app: string;
  group: string;
  blastRadius: string;
  path: string;
  state: NestingState;
};

type CleanupPlan = {
  title: string;
  change: string;
  rollback: string;
  state: NestingState;
};

const groups: GroupNode[] = [
  {
    group: 'eng-release-admins',
    parent: 'production-deployers',
    privilege: 'package publisher and deploy approver',
    owner: 'release desk',
    state: 'clear'
  },
  {
    group: 'support-admins-nested',
    parent: 'saas-superusers',
    privilege: 'transitive admin across support tooling',
    owner: 'stale owner',
    state: 'review'
  },
  {
    group: 'vpn-admins-legacy',
    parent: 'global-admin-shadow',
    privilege: 'directory admin through legacy nesting',
    owner: 'unclaimed',
    state: 'cleanup'
  },
  {
    group: 'finance-exporters-temp',
    parent: 'warehouse-readers',
    privilege: 'read and export payroll datasets',
    owner: 'finance systems',
    state: 'review'
  }
];

const findings: MembershipFinding[] = [
  {
    title: 'Circular membership',
    subject: 'global-admin-shadow',
    evidence: 'Group resolves back into vpn-admins-legacy after three hops.',
    state: 'cleanup'
  },
  {
    title: 'Stale owner chain',
    subject: 'support-admins-nested',
    evidence: 'Owner left directory but nested privilege still reaches SaaS admin role.',
    state: 'review'
  },
  {
    title: 'Bounded release path',
    subject: 'eng-release-admins',
    evidence: 'Nested groups match release desk owner and active attestation.',
    state: 'clear'
  }
];

const entitlements: AppEntitlement[] = [
  {
    app: 'Admin Console',
    group: 'vpn-admins-legacy',
    blastRadius: '28 privileged accounts',
    path: 'legacy VPN -> shadow global admin -> admin console',
    state: 'cleanup'
  },
  {
    app: 'Support Desk',
    group: 'support-admins-nested',
    blastRadius: '13 elevated agents',
    path: 'support admins -> SaaS superusers',
    state: 'review'
  },
  {
    app: 'Deploy Service',
    group: 'eng-release-admins',
    blastRadius: '6 release approvers',
    path: 'release admins -> production deployers',
    state: 'clear'
  }
];

const cleanupPlans: CleanupPlan[] = [
  {
    title: 'Break circular admin nest',
    change: 'Remove vpn-admins-legacy from global-admin-shadow and freeze inherited admin rights.',
    rollback: 'Restore diagnostics-only membership for one hour through emergency owner approval.',
    state: 'cleanup'
  },
  {
    title: 'Reassign support owner',
    change: 'Hold support-admins-nested in review until customer ops confirms owner intent.',
    rollback: 'Delegate review to service owner if stale owner record cannot be repaired today.',
    state: 'review'
  },
  {
    title: 'Preserve release nesting',
    change: 'Keep release-admin nesting because attestation and deploy path match.',
    rollback: 'Move to review if package publisher membership changes.',
    state: 'clear'
  }
];

const labels: Record<NestingState, string> = {
  clear: 'Clear',
  review: 'Review',
  cleanup: 'Cleanup'
};

const clearCount = [...groups, ...findings, ...entitlements, ...cleanupPlans].filter((item) => item.state === 'clear').length;
const reviewCount = [...groups, ...findings, ...entitlements, ...cleanupPlans].filter((item) => item.state === 'review').length;
const cleanupCount = [...groups, ...findings, ...entitlements, ...cleanupPlans].filter((item) => item.state === 'cleanup').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Directory trust</p>
            <h1 id="page-title">Group Nesting Inspector</h1>
          </div>
          <button type="button">Stage Cleanup</button>
        </header>

        <section className="summary" aria-label="Directory group nesting summary">
          <article>
            <span>{groups.length}</span>
            <p>nested groups</p>
          </article>
          <article>
            <span>{clearCount}</span>
            <p>clear paths</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>review chains</p>
          </article>
          <article>
            <span>{cleanupCount}</span>
            <p>cleanup actions</p>
          </article>
        </section>

        <section className="groupPanel" aria-label="Nested directory groups">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Nesting graph</p>
              <h2>Nested directory groups, transitive privilege, stale owners, circular membership, app entitlements, blast-radius previews, and rollback-safe group cleanup</h2>
            </div>
            <div className="modeBadge">
              <span />
              graph preview
            </div>
          </div>

          <div className="groupGrid" role="list">
            {groups.map((group) => (
              <article className="groupCard" data-state={group.state} key={group.group} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[group.state]}</span>
                  <strong>{group.owner}</strong>
                </div>
                <h3>{group.group}</h3>
                <p>{group.parent}</p>
                <code>{group.privilege}</code>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="findingPanel" aria-labelledby="findings-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Findings</p>
              <h2 id="findings-title">Membership risks</h2>
            </div>
            <div className="stack" role="list">
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

          <section className="entitlementPanel" aria-labelledby="entitlements-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Entitlements</p>
              <h2 id="entitlements-title">Blast-radius preview</h2>
            </div>
            <div className="entitlementList" role="list">
              {entitlements.map((entitlement) => (
                <article data-state={entitlement.state} key={entitlement.app} role="listitem" tabIndex={0}>
                  <span>{labels[entitlement.state]}</span>
                  <div>
                    <h3>{entitlement.app}</h3>
                    <p>{entitlement.group}</p>
                  </div>
                  <strong>{entitlement.blastRadius}</strong>
                  <code>{entitlement.path}</code>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="cleanupPanel" aria-labelledby="cleanup-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Rollback</p>
            <h2 id="cleanup-title">Group cleanup plans</h2>
          </div>
          <div className="cleanupGrid" role="list">
            {cleanupPlans.map((plan) => (
              <article data-state={plan.state} key={plan.title} role="listitem" tabIndex={0}>
                <span>{labels[plan.state]}</span>
                <h3>{plan.title}</h3>
                <p>{plan.change}</p>
                <code>{plan.rollback}</code>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
