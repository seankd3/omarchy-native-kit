const metrics = [
  { label: 'Backup coverage', value: '87%', detail: '14 apps fully covered' },
  { label: 'Coverage gaps', value: '9', detail: '4 high-risk systems' },
  { label: 'Stale delegations', value: '13', detail: 'older than 90 days' },
  { label: 'Emergency approvers', value: '22', detail: '6 need review evidence' }
];

const roster = [
  {
    system: 'Support console',
    primary: 'Jon Bell',
    backup: 'Kara Singh',
    emergency: 'Maya Frost',
    coverage: 'Partial',
    readiness: 'Needs export',
    evidence: 'Manager memo missing',
    state: 'Gap'
  },
  {
    system: 'Finance warehouse',
    primary: 'Rina Patel',
    backup: 'Theo Marin',
    emergency: 'Nia Brooks',
    coverage: 'Covered',
    readiness: 'Ready',
    evidence: 'Quarterly review attached',
    state: 'Ready'
  },
  {
    system: 'Vendor VPN',
    primary: 'Marisol Chen',
    backup: 'Lee Novak',
    emergency: 'Omar Saleh',
    coverage: 'Stale',
    readiness: 'Renewal due',
    evidence: 'Expired attestation',
    state: 'Stale'
  },
  {
    system: 'Release signing',
    primary: 'Priya Rao',
    backup: 'Owen Grant',
    emergency: 'Iris Tan',
    coverage: 'Covered',
    readiness: 'Quorum ready',
    evidence: 'Vault snapshot sealed',
    state: 'Watching'
  }
];

const gaps = [
  { area: 'Customer escalations', missing: 'Backup lacks macro export permission', owner: 'Jon Bell', due: 'Today 16:00', state: 'Open' },
  { area: 'Vendor access', missing: 'Delegation older than review policy', owner: 'Marisol Chen', due: 'May 2 10:00', state: 'Stale' },
  { area: 'Finance close', missing: 'Emergency approver needs test grant', owner: 'Rina Patel', due: 'May 2 12:30', state: 'Queued' },
  { area: 'Release keys', missing: 'Backup quorum note needs countersign', owner: 'Priya Rao', due: 'May 3 09:00', state: 'Watching' }
];

const handoffs = [
  { backup: 'Kara Singh', scope: 'Support tooling', readiness: '54%', blocker: 'Zendesk export permission' },
  { backup: 'Theo Marin', scope: 'Finance analytics', readiness: '92%', blocker: 'None' },
  { backup: 'Lee Novak', scope: 'Network security', readiness: '68%', blocker: 'VPN policy renewal' },
  { backup: 'Owen Grant', scope: 'Release engineering', readiness: '81%', blocker: 'Quorum countersign' }
];

const evidence = [
  { packet: 'Delegation attestation', complete: '31/44', note: '13 stale delegations need renewal' },
  { packet: 'Emergency approver test', complete: '16/22', note: '6 tests missing audit screenshots' },
  { packet: 'Handoff readiness', complete: '35/44', note: '9 backups blocked by permissions' },
  { packet: 'Accountability trail', complete: '38/44', note: '6 owner memos missing' }
];

const activity = [
  { time: '14:21', event: 'Support backup coverage marked partial', actor: 'Access bot' },
  { time: '13:50', event: 'Finance emergency approver test passed', actor: 'Theo Marin' },
  { time: '13:12', event: 'VPN delegation renewal requested', actor: 'Marisol Chen' },
  { time: '12:44', event: 'Release signing backup quorum snapshot sealed', actor: 'Priya Rao' }
];

const controls = [
  'Assign backup owner for every critical access system',
  'Renew stale delegations before SLA escalation',
  'Verify emergency approver permissions with a dry-run',
  'Attach review evidence to each backup handoff',
  'Seal accountability trail before audit export'
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
          <h1 id="page-title">Delegation backup roster</h1>
          <p className="lede">
            Inspect delegated access backup owners, coverage gaps, stale delegations, handoff readiness,
            emergency approvers, review evidence, and rollback-safe accountability trails.
          </p>
        </div>
        <div className="coveragePanel" aria-label="Backup coverage">
          <span>Roster coverage</span>
          <strong>87%</strong>
          <small>Nine systems need backup-owner repair before the next revocation SLA review.</small>
        </div>
      </section>

      <section className="metrics" aria-label="Delegation roster metrics">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="mainGrid">
        <article className="panel rosterPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Roster</p>
              <h2>Backup owner assignments</h2>
            </div>
            <button type="button">Export roster</button>
          </div>
          <div className="rosterList" aria-label="Delegated backup owners">
            {roster.map((item) => (
              <article className="rosterCard" key={item.system}>
                <div className="cardTop">
                  <div>
                    <span className={`status ${statusClass(item.state)}`}>{item.state}</span>
                    <h3>{item.system}</h3>
                  </div>
                  <strong>{item.coverage}</strong>
                </div>
                <dl>
                  <div>
                    <dt>Primary</dt>
                    <dd>{item.primary}</dd>
                  </div>
                  <div>
                    <dt>Backup</dt>
                    <dd>{item.backup}</dd>
                  </div>
                  <div>
                    <dt>Emergency</dt>
                    <dd>{item.emergency}</dd>
                  </div>
                  <div>
                    <dt>Readiness</dt>
                    <dd>{item.readiness}</dd>
                  </div>
                  <div>
                    <dt>Evidence</dt>
                    <dd>{item.evidence}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </article>

        <aside className="panel activityPanel" aria-labelledby="activity-title">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Trail</p>
              <h2 id="activity-title">Roster activity</h2>
            </div>
          </div>
          <div className="activityList">
            {activity.map((item) => (
              <div className="activity" key={`${item.time}-${item.event}`}>
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
              <p className="eyebrow">Gaps</p>
              <h2>Coverage repairs</h2>
            </div>
          </div>
          <div className="gapList">
            {gaps.map((gap) => (
              <div className="gap" key={gap.area}>
                <span className={`status ${statusClass(gap.state)}`}>{gap.state}</span>
                <strong>{gap.area}</strong>
                <p>{gap.missing}</p>
                <small>{gap.owner} · due {gap.due}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Handoffs</p>
              <h2>Backup readiness</h2>
            </div>
          </div>
          <div className="handoffList">
            {handoffs.map((handoff) => (
              <div className="handoff" key={handoff.backup}>
                <div>
                  <strong>{handoff.backup}</strong>
                  <span>{handoff.scope}</span>
                </div>
                <b>{handoff.readiness}</b>
                <small>{handoff.blocker}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Evidence</p>
              <h2>Review packets</h2>
            </div>
          </div>
          <div className="evidenceList">
            {evidence.map((item) => (
              <div className="evidence" key={item.packet}>
                <strong>{item.packet}</strong>
                <span>{item.complete}</span>
                <p>{item.note}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel controlPanel" aria-labelledby="control-title">
        <div className="panelHeader compact">
          <div>
            <p className="eyebrow">Controls</p>
            <h2 id="control-title">Accountability controls</h2>
          </div>
        </div>
        <ul>
          {controls.map((item) => (
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
