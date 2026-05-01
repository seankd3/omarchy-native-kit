type Tone = 'expired' | 'soon' | 'watch' | 'ready';

type ExceptionItem = {
  person: string;
  exception: string;
  resource: string;
  expires: string;
  owner: string;
  justification: string;
  tone: Tone;
};

type EntitlementImpact = {
  resource: string;
  downstream: string;
  blast: string;
  removal: string;
  tone: Tone;
};

type Renewal = {
  owner: string;
  queue: string;
  age: string;
  decision: string;
};

type Notification = {
  channel: string;
  audience: string;
  window: string;
  message: string;
};

const metrics = [
  { label: 'expired exceptions', value: '7', tone: 'expired' },
  { label: 'expire in 48h', value: '14', tone: 'soon' },
  { label: 'stale justifications', value: '9', tone: 'watch' },
  { label: 'ready removals', value: '22', tone: 'ready' }
] satisfies Array<{ label: string; value: string; tone: Tone }>;

const exceptions: ExceptionItem[] = [
  {
    person: 'Morgan Lee',
    exception: 'Finance warehouse read bypass',
    resource: 'Snowflake finance',
    expires: 'expired 6h',
    owner: 'Rina Patel',
    justification: 'quarter close emergency access',
    tone: 'expired'
  },
  {
    person: 'Jamie Ortiz',
    exception: 'Privileged support console',
    resource: 'Escalation tooling',
    expires: 'today 17:00',
    owner: 'Marisol Chen',
    justification: 'customer incident follow-up',
    tone: 'soon'
  },
  {
    person: 'Taylor Brooks',
    exception: 'Vendor VPN split tunnel',
    resource: 'Network access',
    expires: 'May 03',
    owner: 'Jon Bell',
    justification: 'migration window extended twice',
    tone: 'watch'
  },
  {
    person: 'Nadia Singh',
    exception: 'Temporary release signing',
    resource: 'Artifact registry',
    expires: 'May 06',
    owner: 'Avery Kim',
    justification: 'release captain coverage',
    tone: 'ready'
  }
];

const impacts: EntitlementImpact[] = [
  {
    resource: 'Finance warehouse',
    downstream: 'BI shares, cost export, audit notebook',
    blast: '12 groups',
    removal: 'remove exception, retain reader baseline',
    tone: 'expired'
  },
  {
    resource: 'Support console',
    downstream: 'incident bridge, customer notes, pager override',
    blast: '4 emergency roles',
    removal: 'handoff owner before revocation',
    tone: 'soon'
  },
  {
    resource: 'Release signing',
    downstream: 'artifact publish, deploy attestations',
    blast: '2 signing keys',
    removal: 'rollback safe after tag verification',
    tone: 'ready'
  }
];

const renewals: Renewal[] = [
  {
    owner: 'Rina Patel',
    queue: 'Finance exception renewals',
    age: '3 reminders',
    decision: 'reject unless new close ticket exists'
  },
  {
    owner: 'Marisol Chen',
    queue: 'Support break-glass',
    age: '1 reminder',
    decision: 'approve only with incident commander'
  },
  {
    owner: 'Jon Bell',
    queue: 'Vendor connectivity',
    age: 'stale 9d',
    decision: 'expire and notify sponsor'
  }
];

const notifications: Notification[] = [
  {
    channel: 'Slack',
    audience: 'exception owners',
    window: 'T-48h',
    message: 'Renewal decision required before access removal'
  },
  {
    channel: 'Email',
    audience: 'managers and sponsors',
    window: 'T-24h',
    message: 'Business justification must match active ticket'
  },
  {
    channel: 'Audit log',
    audience: 'security review',
    window: 'on removal',
    message: 'Snapshot downstream entitlements and rollback plan'
  }
];

const rollbackPlan = [
  'Snapshot exception grants and inherited group edges',
  'Remove temporary exception before baseline entitlement changes',
  'Notify owner, manager, and resource steward after removal',
  'Keep restoration command ready until next access review pass'
];

function toneText(tone: Tone) {
  return {
    expired: 'expired',
    soon: 'expiring',
    watch: 'watch',
    ready: 'ready'
  }[tone];
}

export function App() {
  return (
    <main className="shell">
      <section className="masthead" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access exceptions</p>
          <h1 id="page-title">Expiration board for temporary access.</h1>
          <p className="lede">
            Inspect temporary access exceptions, expiring approvals, owner renewals, stale
            justifications, downstream entitlements, notification windows, and rollback-safe
            exception removal.
          </p>
        </div>

        <div className="actions" aria-label="Board actions">
          <button type="button">Send reminders</button>
          <button type="button">Export evidence</button>
        </div>
      </section>

      <section className="metrics" aria-label="Exception summary">
        {metrics.map((metric) => (
          <article className="metric" data-tone={metric.tone} key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="board">
        <div className="panel exception-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Review queue</p>
              <h2>Expiring approvals</h2>
            </div>
            <span>owner action required</span>
          </div>

          <div className="exception-list" role="list" aria-label="Expiring access exceptions">
            {exceptions.map((item) => (
              <button className="exception-row" data-tone={item.tone} type="button" key={item.exception}>
                <span className="status" aria-hidden="true" />
                <span>
                  <strong>{item.exception}</strong>
                  <small>{item.person}</small>
                </span>
                <span>{item.resource}</span>
                <span>{item.owner}</span>
                <em>{item.expires}</em>
                <small>{item.justification}</small>
              </button>
            ))}
          </div>
        </div>

        <aside className="panel renewal-panel" aria-label="Renewal owners">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Renewals</p>
              <h2>Owner queues</h2>
            </div>
          </div>

          <div className="renewal-list">
            {renewals.map((renewal) => (
              <article className="renewal-card" key={renewal.owner}>
                <span>{renewal.age}</span>
                <strong>{renewal.owner}</strong>
                <p>{renewal.queue}</p>
                <small>{renewal.decision}</small>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Downstream</p>
              <h2>Entitlement impact</h2>
            </div>
          </div>

          <div className="impact-grid">
            {impacts.map((impact) => (
              <article className="impact-card" data-tone={impact.tone} key={impact.resource}>
                <span>{toneText(impact.tone)}</span>
                <strong>{impact.resource}</strong>
                <p>{impact.downstream}</p>
                <footer>
                  <small>{impact.blast}</small>
                  <em>{impact.removal}</em>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Notifications</p>
              <h2>Expiration windows</h2>
            </div>
          </div>

          <div className="notification-list">
            {notifications.map((notice) => (
              <article className="notice-card" key={`${notice.channel}-${notice.window}`}>
                <span>{notice.window}</span>
                <strong>{notice.channel}</strong>
                <p>{notice.audience}</p>
                <small>{notice.message}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel rollback-panel" aria-label="Rollback-safe removal">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Removal plan</p>
            <h2>Rollback guardrails</h2>
          </div>
          <button type="button" className="primary-action">
            Approve safe removals
          </button>
        </div>

        <ol className="rollback-list">
          {rollbackPlan.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
