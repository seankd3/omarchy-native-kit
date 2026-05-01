const metrics = [
  { label: 'Stalled approvals', value: '29', detail: '12 past first escalation' },
  { label: 'Delegated backups', value: '18', detail: '6 need confirmation' },
  { label: 'Breach notices', value: '7', detail: 'sent in the last hour' },
  { label: 'Evidence packets', value: '83%', detail: 'owner trail coverage' }
];

const escalationPaths = [
  {
    team: 'Support operations',
    primary: 'Jon Bell',
    backup: 'Kara Singh',
    path: 'Owner -> Manager -> VP CX',
    stalled: 11,
    handoff: 'Macro role export',
    evidence: 'Slack receipt + ticket chain',
    state: 'Breach'
  },
  {
    team: 'Finance analytics',
    primary: 'Rina Patel',
    backup: 'Theo Marin',
    path: 'Owner -> Finance Director',
    stalled: 7,
    handoff: 'Warehouse close exception',
    evidence: 'Close calendar + approval memo',
    state: 'Escalated'
  },
  {
    team: 'Network security',
    primary: 'Marisol Chen',
    backup: 'Lee Novak',
    path: 'Owner -> Security Lead',
    stalled: 6,
    handoff: 'Vendor VPN dependency',
    evidence: 'Firewall diff + change note',
    state: 'Watching'
  },
  {
    team: 'Release engineering',
    primary: 'Priya Rao',
    backup: 'Owen Grant',
    path: 'Owner -> Release Lead',
    stalled: 5,
    handoff: 'Signing quorum backup',
    evidence: 'Quorum log + vault snapshot',
    state: 'Ready'
  }
];

const notifications = [
  { target: 'VP CX', team: 'Support operations', sent: '14:18', reason: 'Approval stalled 44h', state: 'Sent' },
  { target: 'Finance Director', team: 'Finance analytics', sent: '13:55', reason: 'Close exception renewal', state: 'Acknowledged' },
  { target: 'Security Lead', team: 'Network security', sent: '13:22', reason: 'Firewall blocker unresolved', state: 'Waiting' },
  { target: 'Release Lead', team: 'Release engineering', sent: '12:40', reason: 'Backup quorum evidence', state: 'Ready' }
];

const handoffs = [
  { from: 'Jon Bell', to: 'Kara Singh', scope: 'Support macro role', due: '15:30', state: 'Late' },
  { from: 'Rina Patel', to: 'Theo Marin', scope: 'Warehouse reviewer pool', due: '17:00', state: 'Active' },
  { from: 'Marisol Chen', to: 'Lee Novak', scope: 'Vendor VPN grants', due: '18:20', state: 'Queued' },
  { from: 'Priya Rao', to: 'Owen Grant', scope: 'Release signing backup', due: '20:15', state: 'Active' }
];

const evidence = [
  { item: 'Owner notification receipt', coverage: '24/29', gap: '5 missing direct ack' },
  { item: 'Backup delegation proof', coverage: '18/18', gap: 'All delegated backups mapped' },
  { item: 'Escalation ticket chain', coverage: '21/29', gap: '8 need manager links' },
  { item: 'Rollback accountability note', coverage: '19/29', gap: '10 pending ownership memo' }
];

const accountability = [
  'Map primary and backup owners before escalation',
  'Attach stalled approval age and breached SLA clock',
  'Send breach notification to the next escalation tier',
  'Record team handoff and delegated authority',
  'Seal evidence packet before revocation report export'
];

const trail = [
  { time: '14:18', event: 'VP CX breach notice sent for Support operations', actor: 'Access bot' },
  { time: '13:55', event: 'Finance Director acknowledged close exception', actor: 'Rina Patel' },
  { time: '13:22', event: 'Security Lead notified about VPN blocker', actor: 'Marisol Chen' },
  { time: '12:40', event: 'Release backup evidence attached', actor: 'Priya Rao' }
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
          <h1 id="page-title">Owner escalation map</h1>
          <p className="lede">
            Inspect access owner escalation paths, stalled approvals, delegated backups, breach notifications,
            team handoffs, escalation evidence, and rollback-safe accountability trails.
          </p>
        </div>
        <div className="decisionPanel" aria-label="Escalation coverage">
          <span>Escalation coverage</span>
          <strong>83%</strong>
          <small>Five owner trails need direct acknowledgement before the breach packet is sealed.</small>
        </div>
      </section>

      <section className="metrics" aria-label="Escalation metrics">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="mainGrid">
        <article className="panel pathPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Paths</p>
              <h2>Owner escalation routes</h2>
            </div>
            <button type="button">Export map</button>
          </div>
          <div className="pathList" aria-label="Access owner escalation paths">
            {escalationPaths.map((path) => (
              <article className="path" key={path.team}>
                <div className="pathTop">
                  <div>
                    <span className={`status ${statusClass(path.state)}`}>{path.state}</span>
                    <h3>{path.team}</h3>
                  </div>
                  <strong>{path.stalled} stalled</strong>
                </div>
                <dl>
                  <div>
                    <dt>Primary</dt>
                    <dd>{path.primary}</dd>
                  </div>
                  <div>
                    <dt>Backup</dt>
                    <dd>{path.backup}</dd>
                  </div>
                  <div>
                    <dt>Path</dt>
                    <dd>{path.path}</dd>
                  </div>
                  <div>
                    <dt>Handoff</dt>
                    <dd>{path.handoff}</dd>
                  </div>
                  <div>
                    <dt>Evidence</dt>
                    <dd>{path.evidence}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </article>

        <aside className="panel trailPanel" aria-labelledby="trail-title">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Trail</p>
              <h2 id="trail-title">Accountability events</h2>
            </div>
          </div>
          <div className="trailList">
            {trail.map((item) => (
              <div className="trail" key={`${item.time}-${item.event}`}>
                <code>{item.time}</code>
                <div>
                  <strong>{item.event}</strong>
                  <span>{item.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="threeColumn">
        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Notifications</p>
              <h2>Breach messages</h2>
            </div>
          </div>
          <div className="notificationList">
            {notifications.map((notice) => (
              <div className="notification" key={`${notice.target}-${notice.sent}`}>
                <div>
                  <strong>{notice.target}</strong>
                  <span>{notice.team}</span>
                </div>
                <p>{notice.reason}</p>
                <div className="rowFooter">
                  <small>Sent {notice.sent}</small>
                  <b className={statusClass(notice.state)}>{notice.state}</b>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Handoffs</p>
              <h2>Delegated backups</h2>
            </div>
          </div>
          <div className="handoffList">
            {handoffs.map((handoff) => (
              <div className="handoff" key={handoff.scope}>
                <span className={`status ${statusClass(handoff.state)}`}>{handoff.state}</span>
                <strong>{handoff.scope}</strong>
                <p>{handoff.from} to {handoff.to}</p>
                <small>Due {handoff.due}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Evidence</p>
              <h2>Packet coverage</h2>
            </div>
          </div>
          <div className="evidenceList">
            {evidence.map((item) => (
              <div className="evidence" key={item.item}>
                <strong>{item.item}</strong>
                <span>{item.coverage}</span>
                <p>{item.gap}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel checklistPanel" aria-labelledby="checklist-title">
        <div className="panelHeader compact">
          <div>
            <p className="eyebrow">Controls</p>
            <h2 id="checklist-title">Accountability checklist</h2>
          </div>
        </div>
        <ul>
          {accountability.map((item) => (
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
