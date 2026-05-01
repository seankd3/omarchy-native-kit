const metrics = [
  { label: 'Planned removals', value: '184', detail: '42 high-risk grants' },
  { label: 'Dependency holds', value: '11', detail: '5 require app owner sign-off' },
  { label: 'Dry-run failures', value: '8', detail: '3 missing rollback commands' },
  { label: 'Evidence ready', value: '76%', detail: '19 packets sealed' }
];

const batches = [
  {
    name: 'Finance warehouse cleanup',
    owner: 'Rina Patel',
    stage: 'Ready',
    window: 'Tonight 22:00',
    removals: 46,
    dependencies: 'Snowflake role mirror',
    dryRun: '44 pass / 2 warn',
    rollback: 'Prepared',
    risk: 'Critical'
  },
  {
    name: 'Support console contractors',
    owner: 'Jon Bell',
    stage: 'Blocked',
    window: 'May 3 09:30',
    removals: 31,
    dependencies: 'Zendesk group export',
    dryRun: '27 pass / 4 fail',
    rollback: 'Missing',
    risk: 'High'
  },
  {
    name: 'Legacy VPN vendor grants',
    owner: 'Marisol Chen',
    stage: 'Review',
    window: 'May 2 18:00',
    removals: 58,
    dependencies: 'Firewall policy shadow',
    dryRun: '56 pass / 2 warn',
    rollback: 'Prepared',
    risk: 'High'
  },
  {
    name: 'Release signing backup group',
    owner: 'Priya Rao',
    stage: 'Queued',
    window: 'May 4 21:00',
    removals: 49,
    dependencies: 'Key ceremony rota',
    dryRun: '49 pass / 0 fail',
    rollback: 'Prepared',
    risk: 'Medium'
  }
];

const dependencyMap = [
  { system: 'Finance warehouse', blocker: 'Snapshot replicated grants', state: 'Cleared', count: 2 },
  { system: 'Support console', blocker: 'Owner export mismatch', state: 'Blocked', count: 4 },
  { system: 'VPN concentrator', blocker: 'Nested vendor role', state: 'Watching', count: 3 },
  { system: 'Signing vault', blocker: 'Break-glass quorum', state: 'Cleared', count: 2 }
];

const ownerWindows = [
  { owner: 'Rina Patel', scope: 'Revenue analytics', window: '22:00-23:15', channel: '#fin-access', status: 'Confirmed' },
  { owner: 'Jon Bell', scope: 'Support tooling', window: '09:30-10:10', channel: '#cx-ops', status: 'Needs export' },
  { owner: 'Marisol Chen', scope: 'Vendor access', window: '18:00-18:45', channel: '#netsec', status: 'Confirmed' },
  { owner: 'Priya Rao', scope: 'Release keys', window: '21:00-21:25', channel: '#release', status: 'Quorum check' }
];

const dryRuns = [
  { batch: 'Finance A', result: '2 warnings', reason: 'BI extract depends on one stale analyst role' },
  { batch: 'Support B', result: '4 failures', reason: 'Contractor aliases still mapped to escalation macros' },
  { batch: 'VPN C', result: '2 warnings', reason: 'Vendor nested role expands into two firewall groups' },
  { batch: 'Signing D', result: 'Clean', reason: 'Backup group has replacement owners and sealed snapshot' }
];

const rollbackCommands = [
  'restore-entitlements --batch finance-a --snapshot 2026-05-01T18:20Z',
  'grant-group --target support-contractors-legacy --ttl 4h --reason rollback-window',
  'vpn-policy replay --bundle vendor-cleanup-c --mode revert',
  'vault-membership restore --group release-signing-backup --ticket REL-1442'
];

const evidence = [
  'Pre-removal entitlement snapshot attached',
  'Owner acknowledgement linked to each batch',
  'Dry-run output retained with blocker annotations',
  'Rollback command checksum recorded',
  'Communication window and channel archived'
];

function statusClass(value: string) {
  if (value.includes('warning')) {
    return 'warnings';
  }

  if (value.includes('failure')) {
    return 'failures';
  }

  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <section className="masthead" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access governance</p>
          <h1 id="page-title">Removal batch planner</h1>
          <p className="lede">
            Plan access cleanup batches with entitlement dependencies, dry-run outcomes, delegated
            owners, rollback commands, communication windows, and audit-ready evidence.
          </p>
        </div>
        <div className="releasePanel" aria-label="Next cleanup release">
          <span className="panelLabel">Next release</span>
          <strong>3 batches</strong>
          <small>Ready for controlled removal tonight</small>
        </div>
      </section>

      <section className="metrics" aria-label="Removal batch health">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="grid">
        <article className="panel batchPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Batch queue</p>
              <h2>Ranked removals</h2>
            </div>
            <button type="button">Export plan</button>
          </div>

          <div className="batchList" aria-label="Removal batches">
            {batches.map((batch) => (
              <article className="batch" key={batch.name}>
                <div className="batchTop">
                  <div>
                    <span className={`pill ${statusClass(batch.risk)}`}>{batch.risk}</span>
                    <h3>{batch.name}</h3>
                  </div>
                  <span className={`stage ${statusClass(batch.stage)}`}>{batch.stage}</span>
                </div>
                <dl className="batchFacts">
                  <div>
                    <dt>Owner</dt>
                    <dd>{batch.owner}</dd>
                  </div>
                  <div>
                    <dt>Window</dt>
                    <dd>{batch.window}</dd>
                  </div>
                  <div>
                    <dt>Removals</dt>
                    <dd>{batch.removals}</dd>
                  </div>
                  <div>
                    <dt>Dry run</dt>
                    <dd>{batch.dryRun}</dd>
                  </div>
                  <div>
                    <dt>Dependency</dt>
                    <dd>{batch.dependencies}</dd>
                  </div>
                  <div>
                    <dt>Rollback</dt>
                    <dd>{batch.rollback}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </article>

        <aside className="panel dependencyPanel" aria-labelledby="dependency-title">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Entitlements</p>
              <h2 id="dependency-title">Dependency map</h2>
            </div>
          </div>
          <div className="dependencyList">
            {dependencyMap.map((item) => (
              <div className="dependency" key={item.system}>
                <div>
                  <strong>{item.system}</strong>
                  <span>{item.blocker}</span>
                </div>
                <b className={statusClass(item.state)}>{item.state}</b>
                <small>{item.count} links</small>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="twoColumn">
        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Owners</p>
              <h2>Delegated windows</h2>
            </div>
          </div>
          <div className="ownerList">
            {ownerWindows.map((owner) => (
              <div className="owner" key={owner.owner}>
                <div>
                  <strong>{owner.owner}</strong>
                  <span>{owner.scope}</span>
                </div>
                <div>
                  <b>{owner.window}</b>
                  <small>{owner.channel}</small>
                </div>
                <span className={`stage ${statusClass(owner.status)}`}>{owner.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Simulation</p>
              <h2>Dry-run outcomes</h2>
            </div>
          </div>
          <div className="dryRunList">
            {dryRuns.map((run) => (
              <div className="dryRun" key={run.batch}>
                <span>{run.batch}</span>
                <strong className={statusClass(run.result)}>{run.result}</strong>
                <p>{run.reason}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="bottomGrid">
        <article className="panel commandPanel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Rollback</p>
              <h2>Prepared commands</h2>
            </div>
          </div>
          <div className="commandList" aria-label="Rollback commands">
            {rollbackCommands.map((command) => (
              <button type="button" key={command}>
                <code>{command}</code>
              </button>
            ))}
          </div>
        </article>

        <article className="panel evidencePanel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Audit packet</p>
              <h2>Evidence checklist</h2>
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
        </article>
      </section>
    </main>
  );
}
