type RestartRisk = 'ready' | 'watch' | 'blocked';

type RestartBatch = {
  name: string;
  scope: string;
  services: string;
  risk: RestartRisk;
  window: string;
  impact: string;
};

type Dependency = {
  unit: string;
  dependsOn: string;
  effect: string;
  risk: RestartRisk;
};

type Guardrail = {
  label: string;
  detail: string;
  owner: string;
};

const batches: RestartBatch[] = [
  {
    name: 'Portal services',
    scope: 'user',
    services: 'xdg-desktop-portal, portal-hyprland',
    risk: 'watch',
    window: 'After active calls',
    impact: 'Screen share and file picker sessions pause'
  },
  {
    name: 'Audio graph',
    scope: 'user',
    services: 'wireplumber, pipewire, pipewire-pulse',
    risk: 'ready',
    window: 'Ready now',
    impact: 'Audio routes renegotiate for 8 seconds'
  },
  {
    name: 'Network posture',
    scope: 'system',
    services: 'NetworkManager, systemd-resolved',
    risk: 'blocked',
    window: 'Hold for upload',
    impact: 'VPN and DNS state may flap'
  },
  {
    name: 'Notification lane',
    scope: 'user',
    services: 'mako, notification-daemon',
    risk: 'ready',
    window: 'Quiet hours',
    impact: 'Queued notifications replay after restart'
  }
];

const dependencies: Dependency[] = [
  {
    unit: 'xdg-desktop-portal-hyprland',
    dependsOn: 'hyprland session bus',
    effect: 'Restart only after compositor is stable',
    risk: 'watch'
  },
  {
    unit: 'pipewire-pulse',
    dependsOn: 'pipewire socket',
    effect: 'Socket activation restores clients in order',
    risk: 'ready'
  },
  {
    unit: 'NetworkManager',
    dependsOn: 'active VPN tunnel',
    effect: 'Would interrupt current upload workspace',
    risk: 'blocked'
  }
];

const guardrails: Guardrail[] = [
  {
    label: 'Snapshot current unit states',
    detail: 'Capture failed, active, and user units before applying any batch.',
    owner: 'Journal Timeline Inspector'
  },
  {
    label: 'Defer network restarts',
    detail: 'Wait until package uploads and remote sessions are idle.',
    owner: 'Network Profile Mapper'
  },
  {
    label: 'Replay smoke checks',
    detail: 'Run portal, audio, and notification checks after every batch.',
    owner: 'App Health Monitor'
  }
];

const riskLabels: Record<RestartRisk, string> = {
  ready: 'Ready',
  watch: 'Watch',
  blocked: 'Blocked'
};

const readyBatches = batches.filter((batch) => batch.risk === 'ready').length;
const blockedBatches = batches.filter((batch) => batch.risk === 'blocked').length;
const userBatches = batches.filter((batch) => batch.scope === 'user').length;

export function App() {
  return (
    <main className="shell">
      <section className="orchestrator" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Service restarts</p>
            <h1 id="page-title">Restart Orchestrator</h1>
          </div>
          <div className="statusBadge">
            <span />
            dependency preview armed
          </div>
        </header>

        <section className="metrics" aria-label="Restart summary">
          <article>
            <span>{batches.length}</span>
            <p>restart batches</p>
          </article>
          <article>
            <span>{readyBatches}</span>
            <p>ready now</p>
          </article>
          <article>
            <span>{userBatches}</span>
            <p>user scope</p>
          </article>
          <article>
            <span>{blockedBatches}</span>
            <p>blocked batch</p>
          </article>
        </section>

        <section className="layout">
          <div className="batchPanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Restart plan</p>
                <h2>Batch units by scope, dependency impact, and safe window</h2>
              </div>
              <button type="button">Stage Batch</button>
            </div>

            <div className="batchList" role="list" aria-label="Service restart batches">
              {batches.map((batch) => (
                <article className="batch" data-risk={batch.risk} key={batch.name} role="listitem" tabIndex={0}>
                  <div className="batchMain">
                    <span>{riskLabels[batch.risk]}</span>
                    <div>
                      <h3>{batch.name}</h3>
                      <p>{batch.services}</p>
                    </div>
                  </div>
                  <div className="batchMeta">
                    <strong>{batch.scope}</strong>
                    <span>{batch.window}</span>
                    <small>{batch.impact}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="dependencyPanel" aria-label="Dependency impact preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Dependency impact</p>
                  <h2>Unit order checks</h2>
                </div>
              </div>
              <div className="dependencyList">
                {dependencies.map((dependency) => (
                  <article data-risk={dependency.risk} key={dependency.unit}>
                    <span>{riskLabels[dependency.risk]}</span>
                    <h3>{dependency.unit}</h3>
                    <p>{dependency.effect}</p>
                    <small>{dependency.dependsOn}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="guardPanel" aria-label="Restart guardrails">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Guardrails</p>
                  <h2>Safe restart runbook</h2>
                </div>
              </div>
              <div className="guardList">
                {guardrails.map((guardrail) => (
                  <article key={guardrail.label}>
                    <h3>{guardrail.label}</h3>
                    <p>{guardrail.detail}</p>
                    <small>{guardrail.owner}</small>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
