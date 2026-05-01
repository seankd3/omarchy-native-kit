type Tone = 'critical' | 'warning' | 'ready' | 'hold';

type DeprovisionTask = {
  owner: string;
  task: string;
  system: string;
  due: string;
  status: string;
  tone: Tone;
};

type Identity = {
  person: string;
  role: string;
  state: string;
  lastSeen: string;
  evidence: string;
  tone: Tone;
};

type AppQueue = {
  app: string;
  queue: string;
  blockers: string;
  exposure: string;
  tone: Tone;
};

type Session = {
  device: string;
  session: string;
  signal: string;
  action: string;
};

type SignOff = {
  manager: string;
  portfolio: string;
  decision: string;
  window: string;
};

const taskCounts = [
  { label: 'tasks due today', value: '18', tone: 'critical' },
  { label: 'apps in queue', value: '9', tone: 'warning' },
  { label: 'sessions to revoke', value: '14', tone: 'hold' },
  { label: 'rollback checkpoints', value: '6', tone: 'ready' }
] satisfies Array<{ label: string; value: string; tone: Tone }>;

const tasks: DeprovisionTask[] = [
  {
    owner: 'Nina Shah',
    task: 'Disable directory account after payroll export',
    system: 'IdP core',
    due: '14:30',
    status: 'manager sign-off missing',
    tone: 'critical'
  },
  {
    owner: 'Cal Mateo',
    task: 'Remove shared mailbox delegation',
    system: 'Mail',
    due: '16:00',
    status: 'dependency mapped',
    tone: 'warning'
  },
  {
    owner: 'Avery Kim',
    task: 'Archive project repositories and rotate deploy key',
    system: 'Git forge',
    due: 'tomorrow',
    status: 'rollback checkpoint ready',
    tone: 'ready'
  },
  {
    owner: 'Priya Rao',
    task: 'Hold account while legal export completes',
    system: 'Legal hold',
    due: 'May 03',
    status: 'exception active',
    tone: 'hold'
  }
];

const identities: Identity[] = [
  {
    person: 'Nina Shah',
    role: 'Support engineer',
    state: 'Suspended',
    lastSeen: 'VPN token used 2h ago',
    evidence: 'Group membership still grants escalation console',
    tone: 'critical'
  },
  {
    person: 'Leon Park',
    role: 'Contractor',
    state: 'Grace hold',
    lastSeen: 'No shell sessions since Apr 28',
    evidence: 'Pending invoice approval keeps SaaS seat active',
    tone: 'hold'
  },
  {
    person: 'Avery Kim',
    role: 'Platform lead',
    state: 'Ready',
    lastSeen: 'Admin session revoked',
    evidence: 'Delegated owners confirmed for every resource',
    tone: 'ready'
  }
];

const appQueues: AppQueue[] = [
  {
    app: 'Finance Warehouse',
    queue: 'Manual owner approval',
    blockers: 'Quarter close export',
    exposure: 'read-only data mart',
    tone: 'warning'
  },
  {
    app: 'Escalation Console',
    queue: 'Immediate revocation',
    blockers: 'no owner fallback',
    exposure: 'customer incident tooling',
    tone: 'critical'
  },
  {
    app: 'Design Vault',
    queue: 'Scheduled removal',
    blockers: 'asset handoff signed',
    exposure: 'brand archive',
    tone: 'ready'
  }
];

const sessions: Session[] = [
  {
    device: 'linux-nina-07',
    session: 'browser refresh token',
    signal: 'stale after suspension',
    action: 'revoke before account disable'
  },
  {
    device: 'vpn-mobile-41',
    session: 'wireguard peer',
    signal: 'last handshake 09:12',
    action: 'remove peer and snapshot config'
  },
  {
    device: 'forge-runner-12',
    session: 'deploy key',
    signal: 'owner departed',
    action: 'rotate key after build drain'
  }
];

const signOffs: SignOff[] = [
  {
    manager: 'Marisol Chen',
    portfolio: 'Support operations',
    decision: 'Needs alternate queue owner',
    window: 'today 13:00'
  },
  {
    manager: 'Jon Bell',
    portfolio: 'Product data',
    decision: 'Approved disablement',
    window: 'complete'
  },
  {
    manager: 'Anika Soto',
    portfolio: 'Vendor programs',
    decision: 'Exception hold expires',
    window: 'May 03 09:00'
  }
];

const rollbackSteps = [
  'Snapshot directory attributes and group edges',
  'Disable account before destructive app removal',
  'Preserve mailbox, files, and repository ownership',
  'Revoke orphaned sessions after app queue confirmation'
];

function toneLabel(tone: Tone) {
  return {
    critical: 'critical',
    warning: 'watch',
    ready: 'ready',
    hold: 'hold'
  }[tone];
}

export function App() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Directory deprovisioning</p>
          <h1 id="page-title">Runbook for clean account exits.</h1>
          <p className="lede">
            Inspect deprovisioning tasks, suspended identities, app offboarding queues, orphaned
            sessions, manager sign-off, exception holds, and rollback-safe account disablement.
          </p>
        </div>

        <div className="control-panel" aria-label="Runbook controls">
          <button type="button">Queue disablement</button>
          <button type="button">Export evidence</button>
        </div>
      </section>

      <section className="metrics" aria-label="Runbook summary">
        {taskCounts.map((item) => (
          <article className="metric" data-tone={item.tone} key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="layout">
        <div className="panel task-panel">
          <div className="section-heading">
            <p className="eyebrow">Task queue</p>
            <h2>Deprovisioning tasks</h2>
          </div>

          <div className="task-list" role="list" aria-label="Deprovisioning task list">
            {tasks.map((task) => (
              <button className="task-row" data-tone={task.tone} key={`${task.owner}-${task.task}`} type="button">
                <span className="status-dot" aria-hidden="true" />
                <span>
                  <strong>{task.task}</strong>
                  <small>{task.owner}</small>
                </span>
                <span>{task.system}</span>
                <span>{task.due}</span>
                <em>{task.status}</em>
              </button>
            ))}
          </div>
        </div>

        <aside className="panel signoff-panel" aria-label="Manager sign-off">
          <div className="section-heading">
            <p className="eyebrow">Sign-off</p>
            <h2>Manager decisions</h2>
          </div>

          <div className="signoff-list">
            {signOffs.map((item) => (
              <article className="signoff" key={item.manager}>
                <span>{item.window}</span>
                <strong>{item.manager}</strong>
                <p>{item.portfolio}</p>
                <small>{item.decision}</small>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="evidence-grid" aria-label="Deprovisioning evidence">
        <div className="panel">
          <div className="section-heading">
            <p className="eyebrow">Suspended identities</p>
            <h2>Account evidence</h2>
          </div>

          <div className="identity-list">
            {identities.map((identity) => (
              <article className="identity-card" data-tone={identity.tone} key={identity.person}>
                <div>
                  <strong>{identity.person}</strong>
                  <span>{identity.role}</span>
                </div>
                <p>{identity.evidence}</p>
                <footer>
                  <span>{identity.state}</span>
                  <small>{identity.lastSeen}</small>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <p className="eyebrow">Offboarding queues</p>
            <h2>App removals</h2>
          </div>

          <div className="queue-list">
            {appQueues.map((queue) => (
              <article className="queue-card" data-tone={queue.tone} key={queue.app}>
                <span>{toneLabel(queue.tone)}</span>
                <strong>{queue.app}</strong>
                <p>{queue.queue}</p>
                <small>{queue.blockers}</small>
                <em>{queue.exposure}</em>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel">
          <div className="section-heading">
            <p className="eyebrow">Orphaned sessions</p>
            <h2>Revocation plan</h2>
          </div>

          <div className="session-table" role="table" aria-label="Orphaned session revocation plan">
            {sessions.map((session) => (
              <div className="session-row" role="row" key={session.device}>
                <span>{session.device}</span>
                <strong>{session.session}</strong>
                <small>{session.signal}</small>
                <em>{session.action}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="panel rollback-panel">
          <div className="section-heading">
            <p className="eyebrow">Rollback safe</p>
            <h2>Disablement guardrails</h2>
          </div>

          <ol className="rollback-list">
            {rollbackSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <button type="button" className="primary-action">
            Approve staged disablement
          </button>
        </div>
      </section>
    </main>
  );
}
