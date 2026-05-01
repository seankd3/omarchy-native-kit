const metrics = [
  { label: 'Open reopen requests', value: '17', detail: '5 need owner acknowledgement' },
  { label: 'Temporary regrants', value: '9', detail: 'average TTL 5h 20m' },
  { label: 'Dependency gaps', value: '6', detail: '3 block approval' },
  { label: 'Expiring today', value: '11', detail: '2 need rollback scope review' }
];

const requests = [
  {
    subject: 'Vendor VPN grant V-119',
    requester: 'Avery Holt',
    owner: 'Marisol Chen',
    reason: 'Provider support extension for invoice close',
    ttl: '4h',
    dependency: 'Firewall policy evidence',
    rollback: 'VPN group only',
    status: 'Pending owner'
  },
  {
    subject: 'Support macro role',
    requester: 'Bea Simmons',
    owner: 'Jon Bell',
    reason: 'Escalation macro still maps to removed role',
    ttl: '2h',
    dependency: 'Zendesk export mismatch',
    rollback: 'Role and macro binding',
    status: 'Blocked'
  },
  {
    subject: 'BI extract analyst',
    requester: 'Mina Gupta',
    owner: 'Rina Patel',
    reason: 'Revenue close exception for late warehouse export',
    ttl: '8h',
    dependency: 'Snapshot checksum attached',
    rollback: 'Analyst group only',
    status: 'Approved'
  },
  {
    subject: 'Release signing backup',
    requester: 'Oscar Vale',
    owner: 'Priya Rao',
    reason: 'Emergency release signing quorum failed',
    ttl: '1h',
    dependency: 'Quorum note missing',
    rollback: 'Vault membership',
    status: 'Review'
  }
];

const approvals = [
  { approver: 'Marisol Chen', scope: 'Vendor access', pending: 3, ack: 'Waiting', expires: '18:30' },
  { approver: 'Jon Bell', scope: 'Support tooling', pending: 4, ack: 'Blocked', expires: '16:10' },
  { approver: 'Rina Patel', scope: 'Finance warehouse', pending: 1, ack: 'Signed', expires: '23:45' },
  { approver: 'Priya Rao', scope: 'Release keys', pending: 1, ack: 'Reviewing', expires: '15:05' }
];

const dependencyEvidence = [
  { name: 'Firewall policy evidence', request: 'Vendor VPN grant V-119', state: 'Ready', detail: 'Rule diff and owner note attached' },
  { name: 'Zendesk export mismatch', request: 'Support macro role', state: 'Missing', detail: 'Export lacks contractor alias mapping' },
  { name: 'Snapshot checksum', request: 'BI extract analyst', state: 'Ready', detail: 'Sealed entitlement snapshot verified' },
  { name: 'Quorum note', request: 'Release signing backup', state: 'Stale', detail: 'Last acknowledgement is outside policy window' }
];

const timers = [
  { label: 'BI extract analyst', remaining: '7h 42m', state: 'Healthy' },
  { label: 'Vendor VPN grant V-119', remaining: '3h 18m', state: 'Watching' },
  { label: 'Release signing backup', remaining: '52m', state: 'Urgent' },
  { label: 'Support macro role', remaining: 'Blocked', state: 'Blocked' }
];

const auditTrail = [
  { time: '14:02', event: 'BI extract analyst regrant approved', actor: 'Rina Patel' },
  { time: '13:48', event: 'Support macro role dependency flagged', actor: 'Jon Bell' },
  { time: '13:21', event: 'Vendor VPN firewall evidence attached', actor: 'Marisol Chen' },
  { time: '12:57', event: 'Release signing quorum note requested', actor: 'Priya Rao' }
];

const guardrails = [
  'Set TTL before temporary regrant is issued',
  'Attach dependency evidence and owner acknowledgement',
  'Constrain rollback scope to the removed entitlement set',
  'Archive requester reason and approval chain',
  'Schedule automatic revocation before the exception expires'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <section className="masthead" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access governance</p>
          <h1 id="page-title">Reopen exception console</h1>
          <p className="lede">
            Inspect access reopen requests, temporary regrant approvals, dependency evidence,
            expiry timers, owner acknowledgements, rollback scope, and audit-ready exception trails.
          </p>
        </div>
        <div className="decisionPanel" aria-label="Decision queue">
          <span>Decision queue</span>
          <strong>12</strong>
          <small>Requests can be approved once acknowledgement and rollback scope align.</small>
        </div>
      </section>

      <section className="metrics" aria-label="Reopen exception metrics">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="mainGrid">
        <article className="panel requestPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Requests</p>
              <h2>Temporary regrant queue</h2>
            </div>
            <button type="button">Create decision packet</button>
          </div>

          <div className="requestList" aria-label="Access reopen requests">
            {requests.map((request) => (
              <article className="request" key={request.subject}>
                <div className="requestTop">
                  <div>
                    <span className={`status ${statusClass(request.status)}`}>{request.status}</span>
                    <h3>{request.subject}</h3>
                  </div>
                  <strong>{request.ttl}</strong>
                </div>
                <p>{request.reason}</p>
                <dl>
                  <div>
                    <dt>Requester</dt>
                    <dd>{request.requester}</dd>
                  </div>
                  <div>
                    <dt>Owner</dt>
                    <dd>{request.owner}</dd>
                  </div>
                  <div>
                    <dt>Dependency</dt>
                    <dd>{request.dependency}</dd>
                  </div>
                  <div>
                    <dt>Rollback</dt>
                    <dd>{request.rollback}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </article>

        <aside className="panel timerPanel" aria-labelledby="timer-title">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Expiry</p>
              <h2 id="timer-title">Regrant timers</h2>
            </div>
          </div>
          <div className="timerList">
            {timers.map((timer) => (
              <div className="timer" key={timer.label}>
                <div>
                  <strong>{timer.label}</strong>
                  <span>{timer.remaining}</span>
                </div>
                <b className={statusClass(timer.state)}>{timer.state}</b>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="threeColumn">
        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Owners</p>
              <h2>Acknowledgements</h2>
            </div>
          </div>
          <div className="approvalList">
            {approvals.map((approval) => (
              <div className="approval" key={approval.approver}>
                <div>
                  <strong>{approval.approver}</strong>
                  <span>{approval.scope}</span>
                </div>
                <small>{approval.pending} pending · expires {approval.expires}</small>
                <b className={statusClass(approval.ack)}>{approval.ack}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Evidence</p>
              <h2>Dependency proof</h2>
            </div>
          </div>
          <div className="evidenceList">
            {dependencyEvidence.map((item) => (
              <div className="evidence" key={item.name}>
                <span className={`status ${statusClass(item.state)}`}>{item.state}</span>
                <strong>{item.name}</strong>
                <small>{item.request}</small>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel auditPanel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Audit trail</p>
              <h2>Exception events</h2>
            </div>
          </div>
          <div className="auditList">
            {auditTrail.map((item) => (
              <div className="audit" key={`${item.time}-${item.event}`}>
                <code>{item.time}</code>
                <div>
                  <strong>{item.event}</strong>
                  <span>{item.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel guardrailPanel" aria-labelledby="guardrail-title">
        <div className="panelHeader compact">
          <div>
            <p className="eyebrow">Controls</p>
            <h2 id="guardrail-title">Approval guardrails</h2>
          </div>
        </div>
        <ul>
          {guardrails.map((item) => (
            <li key={item}>
              <span aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
