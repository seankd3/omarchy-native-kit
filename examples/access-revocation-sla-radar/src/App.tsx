const metrics = [
  { label: 'Overdue removals', value: '23', detail: '9 breached by more than 24h' },
  { label: 'SLA at risk', value: '41', detail: 'next six hours' },
  { label: 'Paused exceptions', value: '12', detail: '5 without owner renewal' },
  { label: 'Breach packets', value: '18', detail: 'audit evidence ready' }
];

const lanes = [
  {
    name: 'Finance warehouse',
    owner: 'Rina Patel',
    overdue: 6,
    aging: '31h',
    blocker: 'Revenue close exception',
    escalation: 'Director notified',
    pause: '2 active',
    state: 'Breach'
  },
  {
    name: 'Support console',
    owner: 'Jon Bell',
    overdue: 9,
    aging: '44h',
    blocker: 'Contractor alias export',
    escalation: 'VP queue',
    pause: '4 active',
    state: 'Critical'
  },
  {
    name: 'Vendor VPN',
    owner: 'Marisol Chen',
    overdue: 5,
    aging: '19h',
    blocker: 'Firewall dependency',
    escalation: 'Security lead',
    pause: '3 active',
    state: 'At risk'
  },
  {
    name: 'Release signing',
    owner: 'Priya Rao',
    overdue: 3,
    aging: '8h',
    blocker: 'Quorum acknowledgement',
    escalation: 'Team lead',
    pause: '3 active',
    state: 'Watching'
  }
];

const escalations = [
  { owner: 'Jon Bell', path: 'Manager -> VP CX', due: '15:45', reason: 'Macro role export failed twice', state: 'Critical' },
  { owner: 'Rina Patel', path: 'Manager -> Finance Dir', due: '17:00', reason: 'Close exception extended', state: 'Breach' },
  { owner: 'Marisol Chen', path: 'Security lead', due: '18:30', reason: 'Firewall dependency unresolved', state: 'At risk' },
  { owner: 'Priya Rao', path: 'Release lead', due: '20:00', reason: 'Quorum note pending', state: 'Watching' }
];

const blockers = [
  { system: 'Zendesk', blocker: 'Alias export mismatch', count: 7, age: '44h', state: 'Blocked' },
  { system: 'Snowflake', blocker: 'Revenue close hold', count: 6, age: '31h', state: 'Paused' },
  { system: 'VPN concentrator', blocker: 'Firewall shadow rule', count: 5, age: '19h', state: 'Blocked' },
  { system: 'Vault', blocker: 'Quorum acknowledgement', count: 3, age: '8h', state: 'Watching' }
];

const pauses = [
  { request: 'BI extract analyst', owner: 'Rina Patel', expires: '4h 12m', reason: 'Quarter close' },
  { request: 'Vendor support VPN', owner: 'Marisol Chen', expires: '2h 48m', reason: 'Invoice support' },
  { request: 'Support macro role', owner: 'Jon Bell', expires: 'Expired', reason: 'Escalation macro' },
  { request: 'Signing backup group', owner: 'Priya Rao', expires: '5h 20m', reason: 'Release quorum' }
];

const evidence = [
  'Original revocation ticket and SLA clock',
  'Owner escalation chain and timestamps',
  'Dependency blocker proof with retry history',
  'Exception pause approval and expiry',
  'Final breach summary for audit packet'
];

const timeline = [
  { time: '09:10', event: 'Support console crossed 40h queue age', tone: 'critical' },
  { time: '10:25', event: 'Finance exception pause renewed for close window', tone: 'warning' },
  { time: '12:05', event: 'VPN firewall dependency moved to security lead', tone: 'risk' },
  { time: '13:40', event: 'Release signing quorum acknowledgement requested', tone: 'watching' }
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
          <h1 id="page-title">Revocation SLA radar</h1>
          <p className="lede">
            Inspect revocation SLA windows, overdue removals, queue aging, ownership escalations,
            dependency blockers, exception pauses, and audit-ready breach evidence.
          </p>
        </div>
        <div className="breachPanel" aria-label="Breach posture">
          <span>Breach posture</span>
          <strong>23</strong>
          <small>Overdue removals require escalation or pause evidence before the next audit export.</small>
        </div>
      </section>

      <section className="metrics" aria-label="Revocation SLA metrics">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="mainGrid">
        <article className="panel lanePanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Queues</p>
              <h2>Revocation SLA lanes</h2>
            </div>
            <button type="button">Export breach packet</button>
          </div>
          <div className="laneList" aria-label="Revocation SLA lanes">
            {lanes.map((lane) => (
              <article className="lane" key={lane.name}>
                <div className="laneTop">
                  <div>
                    <span className={`status ${statusClass(lane.state)}`}>{lane.state}</span>
                    <h3>{lane.name}</h3>
                  </div>
                  <strong>{lane.aging}</strong>
                </div>
                <dl>
                  <div>
                    <dt>Owner</dt>
                    <dd>{lane.owner}</dd>
                  </div>
                  <div>
                    <dt>Overdue</dt>
                    <dd>{lane.overdue}</dd>
                  </div>
                  <div>
                    <dt>Blocker</dt>
                    <dd>{lane.blocker}</dd>
                  </div>
                  <div>
                    <dt>Escalation</dt>
                    <dd>{lane.escalation}</dd>
                  </div>
                  <div>
                    <dt>Pauses</dt>
                    <dd>{lane.pause}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </article>

        <aside className="panel timelinePanel" aria-labelledby="timeline-title">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Signal</p>
              <h2 id="timeline-title">SLA timeline</h2>
            </div>
          </div>
          <div className="timelineList">
            {timeline.map((item) => (
              <div className="timeline" key={`${item.time}-${item.event}`}>
                <code>{item.time}</code>
                <p>{item.event}</p>
                <b className={statusClass(item.tone)}>{item.tone}</b>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="threeColumn">
        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Escalations</p>
              <h2>Ownership paths</h2>
            </div>
          </div>
          <div className="escalationList">
            {escalations.map((item) => (
              <div className="escalation" key={`${item.owner}-${item.due}`}>
                <div>
                  <strong>{item.owner}</strong>
                  <span>{item.path}</span>
                </div>
                <p>{item.reason}</p>
                <div className="rowFooter">
                  <small>Due {item.due}</small>
                  <b className={statusClass(item.state)}>{item.state}</b>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Blockers</p>
              <h2>Dependency holds</h2>
            </div>
          </div>
          <div className="blockerList">
            {blockers.map((item) => (
              <div className="blocker" key={item.system}>
                <span className={`status ${statusClass(item.state)}`}>{item.state}</span>
                <strong>{item.system}</strong>
                <p>{item.blocker}</p>
                <small>{item.count} removals · {item.age}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Pauses</p>
              <h2>Exception clocks</h2>
            </div>
          </div>
          <div className="pauseList">
            {pauses.map((pause) => (
              <div className="pause" key={pause.request}>
                <div>
                  <strong>{pause.request}</strong>
                  <span>{pause.reason}</span>
                </div>
                <div>
                  <b className={statusClass(pause.expires)}>{pause.expires}</b>
                  <small>{pause.owner}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel evidencePanel" aria-labelledby="evidence-title">
        <div className="panelHeader compact">
          <div>
            <p className="eyebrow">Audit packet</p>
            <h2 id="evidence-title">Breach evidence checklist</h2>
          </div>
        </div>
        <ul>
          {evidence.map((item) => (
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
