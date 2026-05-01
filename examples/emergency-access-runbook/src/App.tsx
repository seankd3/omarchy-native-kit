type RunbookState = 'ready' | 'handoff' | 'blocked';

type BreakGlassAccount = {
  name: string;
  scope: string;
  custodian: string;
  grantWindow: string;
  state: RunbookState;
};

type Handoff = {
  contact: string;
  channel: string;
  proof: string;
  fallback: string;
  state: RunbookState;
};

type RehearsalStep = {
  title: string;
  action: string;
  evidence: string;
  rollback: string;
  state: RunbookState;
};

type AccessGrant = {
  target: string;
  limit: string;
  expires: string;
  rollback: string;
  state: RunbookState;
};

const accounts: BreakGlassAccount[] = [
  {
    name: 'Local admin shell',
    scope: 'single workstation recovery',
    custodian: 'offline vault A',
    grantWindow: '45 minutes',
    state: 'ready'
  },
  {
    name: 'Password manager recovery',
    scope: 'emergency item export',
    custodian: 'sealed kit',
    grantWindow: '30 minutes',
    state: 'handoff'
  },
  {
    name: 'SSH CA override',
    scope: 'temporary host access',
    custodian: 'security lead',
    grantWindow: '20 minutes',
    state: 'ready'
  },
  {
    name: 'Cloud console fallback',
    scope: 'billing and DNS lockout',
    custodian: 'not assigned',
    grantWindow: 'blocked',
    state: 'blocked'
  }
];

const handoffs: Handoff[] = [
  {
    contact: 'Trusted contact',
    channel: 'phone phrase + sealed envelope',
    proof: 'reads challenge words without opening key material',
    fallback: 'abort if phrase mismatch occurs',
    state: 'ready'
  },
  {
    contact: 'Security lead',
    channel: 'Signal call and signed note',
    proof: 'confirms incident ticket and time box',
    fallback: 'keep old policy until ticket is signed',
    state: 'handoff'
  },
  {
    contact: 'DNS registrar support',
    channel: 'recovery email and hardware key',
    proof: 'support path verified last quarter',
    fallback: 'do not reset MFA during rehearsal',
    state: 'ready'
  },
  {
    contact: 'Backup custodian',
    channel: 'missing offsite number',
    proof: 'no current contact record',
    fallback: 'block cloud console rehearsal',
    state: 'blocked'
  }
];

const rehearsalSteps: RehearsalStep[] = [
  {
    title: 'Open incident window',
    action: 'create rehearsal ticket with start and expiry time',
    evidence: 'ticket contains contact path, owner, and rollback owner',
    rollback: 'close ticket without granting access',
    state: 'ready'
  },
  {
    title: 'Verify offline runbook',
    action: 'compare printed steps against current auth policy',
    evidence: 'hash of current runbook matches offline copy',
    rollback: 'reprint and reseal before continuing',
    state: 'handoff'
  },
  {
    title: 'Grant temporary shell',
    action: 'enable break-glass account for one local session',
    evidence: 'session opens and audit marker is written',
    rollback: 'lock account and remove temporary sudo rule',
    state: 'ready'
  },
  {
    title: 'Cloud fallback rehearsal',
    action: 'confirm emergency console ownership',
    evidence: 'blocked until custodian is assigned',
    rollback: 'no access grant allowed',
    state: 'blocked'
  }
];

const grants: AccessGrant[] = [
  {
    target: 'local-admin',
    limit: 'TTY login only',
    expires: '45 min',
    rollback: 'passwd -l local-admin',
    state: 'ready'
  },
  {
    target: 'ssh-ca-override',
    limit: 'single host certificate',
    expires: '20 min',
    rollback: 'revoke cert serial and reload sshd',
    state: 'ready'
  },
  {
    target: 'password-vault-export',
    limit: 'read-only emergency item set',
    expires: '30 min',
    rollback: 'rotate exported item secrets',
    state: 'handoff'
  }
];

const stateLabels: Record<RunbookState, string> = {
  ready: 'Ready',
  handoff: 'Handoff',
  blocked: 'Blocked'
};

const readyAccounts = accounts.filter((account) => account.state === 'ready').length;
const handoffItems = accounts.filter((account) => account.state === 'handoff').length + handoffs.filter((handoff) => handoff.state === 'handoff').length;
const blockedItems = accounts.filter((account) => account.state === 'blocked').length + rehearsalSteps.filter((step) => step.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Emergency access</p>
            <h1 id="page-title">Runbook Rehearsal</h1>
          </div>
          <button type="button">Open Drill Window</button>
        </header>

        <section className="summary" aria-label="Emergency access summary">
          <article>
            <span>{accounts.length}</span>
            <p>break-glass paths</p>
          </article>
          <article>
            <span>{readyAccounts}</span>
            <p>ready accounts</p>
          </article>
          <article>
            <span>{handoffItems}</span>
            <p>handoffs</p>
          </article>
          <article>
            <span>{blockedItems}</span>
            <p>blocked drills</p>
          </article>
        </section>

        <section className="runbookPanel" aria-label="Break-glass account inventory">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Break-glass ledger</p>
              <h2>Break-glass accounts, offline runbooks, contact handoffs, time-boxed access grants, and rollback-safe emergency access rehearsals</h2>
            </div>
            <div className="runbookBadge">
              <span />
              audit ready
            </div>
          </div>

          <div className="accountGrid" role="list">
            {accounts.map((account) => (
              <article className="accountCard" data-state={account.state} key={account.name} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{stateLabels[account.state]}</span>
                  <strong>{account.grantWindow}</strong>
                </div>
                <h3>{account.name}</h3>
                <dl>
                  <div>
                    <dt>Scope</dt>
                    <dd>{account.scope}</dd>
                  </div>
                  <div>
                    <dt>Custodian</dt>
                    <dd>{account.custodian}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="handoffPanel" aria-labelledby="handoff-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Contacts</p>
              <h2 id="handoff-title">Handoff proof</h2>
            </div>
            <div className="handoffList" role="list">
              {handoffs.map((handoff) => (
                <article data-state={handoff.state} key={handoff.contact} role="listitem" tabIndex={0}>
                  <span>{stateLabels[handoff.state]}</span>
                  <h3>{handoff.contact}</h3>
                  <p>{handoff.channel}</p>
                  <strong>{handoff.proof}</strong>
                  <small>{handoff.fallback}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="grantPanel" aria-labelledby="grant-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Time box</p>
              <h2 id="grant-title">Temporary access grants</h2>
            </div>
            <div className="grantList" role="list">
              {grants.map((grant) => (
                <article data-state={grant.state} key={grant.target} role="listitem" tabIndex={0}>
                  <span>{stateLabels[grant.state]}</span>
                  <h3>{grant.target}</h3>
                  <p>{grant.limit}</p>
                  <code>{grant.rollback}</code>
                  <strong>expires {grant.expires}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="rehearsalPanel" aria-labelledby="rehearsal-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Rehearsal</p>
            <h2 id="rehearsal-title">Rollback-safe drill steps</h2>
          </div>
          <div className="rehearsalList" role="list">
            {rehearsalSteps.map((step) => (
              <article data-state={step.state} key={step.title} role="listitem" tabIndex={0}>
                <span>{stateLabels[step.state]}</span>
                <h3>{step.title}</h3>
                <p>{step.action}</p>
                <strong>{step.evidence}</strong>
                <code>{step.rollback}</code>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
