type RiskLevel = 'safe' | 'watch' | 'hold';

type UpdateBatch = {
  name: string;
  scope: string;
  packages: number;
  risk: RiskLevel;
  window: string;
  rollback: string;
};

type Hold = {
  packageName: string;
  reason: string;
  owner: string;
  until: string;
};

type Checkpoint = {
  label: string;
  value: string;
  detail: string;
  risk: RiskLevel;
};

const batches: UpdateBatch[] = [
  {
    name: 'Core desktop refresh',
    scope: 'hyprland, waybar, xdg-desktop-portal',
    packages: 18,
    risk: 'watch',
    window: 'Tonight 21:30',
    rollback: 'Snapshot omarchy-2026-05-01-a'
  },
  {
    name: 'Browser security lane',
    scope: 'chromium, firefox, nss',
    packages: 6,
    risk: 'safe',
    window: 'Ready now',
    rollback: 'Package cache retained'
  },
  {
    name: 'Kernel and driver set',
    scope: 'linux, mesa, nvidia-utils',
    packages: 9,
    risk: 'hold',
    window: 'Hold 48h',
    rollback: 'Boot fallback entry required'
  },
  {
    name: 'Developer toolchain',
    scope: 'nodejs, rust, go, pnpm',
    packages: 14,
    risk: 'safe',
    window: 'Tomorrow 08:00',
    rollback: 'Pinned lockfile restore'
  }
];

const holds: Hold[] = [
  {
    packageName: 'linux',
    reason: 'Wait for module rebuild confirmation',
    owner: 'Power Profile Switchboard',
    until: 'May 3'
  },
  {
    packageName: 'nvidia-utils',
    reason: 'Driver and compositor smoke test pending',
    owner: 'Display Layout Planner',
    until: 'May 3'
  },
  {
    packageName: 'xdg-desktop-portal-hyprland',
    reason: 'Portal permission regression watch',
    owner: 'Portal Permission Center',
    until: 'Tonight'
  }
];

const checkpoints: Checkpoint[] = [
  {
    label: 'Updates queued',
    value: '47',
    detail: 'Across pacman and AUR lanes',
    risk: 'watch'
  },
  {
    label: 'Pinned holds',
    value: String(holds.length),
    detail: 'Require explicit release',
    risk: 'hold'
  },
  {
    label: 'Rollback points',
    value: '4',
    detail: 'Snapshots and package cache ready',
    risk: 'safe'
  },
  {
    label: 'Maintenance window',
    value: '38m',
    detail: 'Estimated reboot-safe runtime',
    risk: 'safe'
  }
];

const riskLabels: Record<RiskLevel, string> = {
  safe: 'Safe',
  watch: 'Watch',
  hold: 'Hold'
};

const totalPackages = batches.reduce((sum, batch) => sum + batch.packages, 0);
const safeBatches = batches.filter((batch) => batch.risk === 'safe').length;

export function App() {
  return (
    <main className="shell">
      <section className="coordinator" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Package maintenance</p>
            <h1 id="page-title">Update Coordinator</h1>
          </div>
          <div className="statusBadge" aria-label="Rollback readiness">
            <span />
            rollback plan armed
          </div>
        </header>

        <section className="metrics" aria-label="Update summary">
          {checkpoints.map((checkpoint) => (
            <article data-risk={checkpoint.risk} key={checkpoint.label}>
              <span>{checkpoint.value}</span>
              <h2>{checkpoint.label}</h2>
              <p>{checkpoint.detail}</p>
            </article>
          ))}
        </section>

        <section className="layout">
          <div className="batchPanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Upgrade batches</p>
                <h2>{totalPackages} packages staged across rollback-safe lanes</h2>
              </div>
              <button type="button">Dry Run</button>
            </div>

            <div className="batchList" role="list" aria-label="Package update batches">
              {batches.map((batch) => (
                <article className="batch" data-risk={batch.risk} key={batch.name} role="listitem" tabIndex={0}>
                  <div className="batchMain">
                    <span>{riskLabels[batch.risk]}</span>
                    <div>
                      <h3>{batch.name}</h3>
                      <p>{batch.scope}</p>
                    </div>
                  </div>
                  <div className="batchMeta" aria-label={`${batch.name} schedule and rollback`}>
                    <strong>{batch.packages} pkgs</strong>
                    <span>{batch.window}</span>
                    <small>{batch.rollback}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="holdPanel" aria-label="Pinned package holds">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Pinned holds</p>
                  <h2>{safeBatches} batches ready after holds clear</h2>
                </div>
              </div>
              <div className="holdList">
                {holds.map((hold) => (
                  <article key={hold.packageName}>
                    <div>
                      <h3>{hold.packageName}</h3>
                      <p>{hold.reason}</p>
                    </div>
                    <div className="holdMeta">
                      <span>{hold.until}</span>
                      <small>{hold.owner}</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="runbookPanel" aria-label="Maintenance runbook">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Runbook</p>
                  <h2>Pre-flight order</h2>
                </div>
              </div>
              <ol className="runbook">
                <li>Refresh mirrors and compare package diffs.</li>
                <li>Apply safe browser and toolchain batches first.</li>
                <li>Snapshot before compositor, portal, or driver lanes.</li>
                <li>Reboot only after verifier and app smoke checks pass.</li>
              </ol>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
