type ResolverState = 'routed' | 'review' | 'leak';

type ResolverPolicy = {
  workspace: string;
  intent: string;
  resolver: string;
  domains: string;
  rollback: string;
  state: ResolverState;
};

type ResolverLane = {
  name: string;
  scope: string;
  score: number;
  state: ResolverState;
};

type ResolverChange = {
  mode: string;
  behavior: string;
  rollback: string;
  state: ResolverState;
};

type ResolverProbe = {
  target: string;
  action: string;
  command: string;
  state: ResolverState;
};

const policies: ResolverPolicy[] = [
  {
    workspace: 'VPN research',
    intent: 'split-horizon domains',
    resolver: 'wg0 dns route',
    domains: '~corp.example, ~internal.lan',
    rollback: 'remove link domains',
    state: 'routed'
  },
  {
    workspace: 'Build bench',
    intent: 'repo resolver pin',
    resolver: 'systemd-resolved fallback',
    domains: 'repo mirrors and package cdn',
    rollback: 'restore global fallback',
    state: 'review'
  },
  {
    workspace: 'Browser vault',
    intent: 'privacy dns',
    resolver: 'dns-over-tls profile',
    domains: 'default route only',
    rollback: 'disable dot override',
    state: 'review'
  },
  {
    workspace: 'Secrets desk',
    intent: 'no direct resolver',
    resolver: 'blocked outside vpn',
    domains: 'unknown public lookup',
    rollback: 'reapply vpn-only policy',
    state: 'leak'
  }
];

const lanes: ResolverLane[] = [
  {
    name: 'Resolver routing',
    scope: 'per-link domains, default routes, and fallback dns',
    score: 84,
    state: 'routed'
  },
  {
    name: 'Split-horizon VPN',
    scope: 'private suffixes and workspace-specific search domains',
    score: 73,
    state: 'review'
  },
  {
    name: 'Leak coverage',
    scope: 'public lookups, captive portals, and dns-over-tls drift',
    score: 58,
    state: 'leak'
  }
];

const changes: ResolverChange[] = [
  {
    mode: 'VPN domain route',
    behavior: 'send private suffixes over the WireGuard resolver only',
    rollback: 'revert resolvectl domain wg0 entries',
    state: 'routed'
  },
  {
    mode: 'Fallback cleanup',
    behavior: 'remove stale public fallback resolvers before sensitive sessions',
    rollback: 'restore saved resolved.conf copy',
    state: 'review'
  },
  {
    mode: 'Leak block',
    behavior: 'deny direct public lookups while secrets workspace is active',
    rollback: 'return to global default route',
    state: 'leak'
  }
];

const probes: ResolverProbe[] = [
  {
    target: 'Resolved status',
    action: 'Inspect per-link DNS servers, default route flags, and routed domains',
    command: 'resolvectl status',
    state: 'routed'
  },
  {
    target: 'VPN suffix',
    action: 'Confirm split-horizon names resolve through the VPN link',
    command: 'resolvectl query host.corp.example',
    state: 'review'
  },
  {
    target: 'Public leak',
    action: 'Check whether sensitive workspaces still reach public resolvers',
    command: 'dig +short whoami.cloudflare @1.1.1.1',
    state: 'leak'
  },
  {
    target: 'Config rollback',
    action: 'Keep a reversible copy before changing systemd-resolved policy',
    command: 'sudo cp /etc/systemd/resolved.conf resolved.conf.before',
    state: 'review'
  }
];

const stateLabels: Record<ResolverState, string> = {
  routed: 'Routed',
  review: 'Review',
  leak: 'Leak'
};

const routedCount = policies.filter((policy) => policy.state === 'routed').length;
const reviewCount = policies.filter((policy) => policy.state === 'review').length;
const leakCount = policies.filter((policy) => policy.state === 'leak').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Resolver policy</p>
            <h1 id="page-title">DNS Policy Lab</h1>
          </div>
          <button type="button">Stage Resolver Change</button>
        </header>

        <section className="metrics" aria-label="DNS resolver policy summary">
          <article>
            <span>{policies.length}</span>
            <p>workspace policies</p>
          </article>
          <article>
            <span>{routedCount}</span>
            <p>routed</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{leakCount}</span>
            <p>leak risk</p>
          </article>
        </section>

        <section className="layout">
          <section className="policyPanel" aria-label="DNS resolver policy matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Policy matrix</p>
                <h2>Resolver routing, split-horizon VPN domains, leak checks, and rollback changes</h2>
              </div>
              <div className="policyBadge">
                <span />
                per-link dns
              </div>
            </div>

            <div className="policyRows" role="list">
              {policies.map((policy) => (
                <article className="policyRow" data-state={policy.state} key={policy.workspace} role="listitem" tabIndex={0}>
                  <div className="policyTitle">
                    <span>{stateLabels[policy.state]}</span>
                    <h3>{policy.workspace}</h3>
                    <p>{policy.intent}</p>
                  </div>
                  <div className="policyMeta">
                    <div>
                      <small>resolver</small>
                      <strong>{policy.resolver}</strong>
                    </div>
                    <div>
                      <small>domains</small>
                      <strong>{policy.domains}</strong>
                    </div>
                    <div>
                      <small>rollback</small>
                      <strong>{policy.rollback}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="DNS resolver route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Resolver route</h2>
                </div>
              </div>
              <pre aria-label="DNS resolver route preview">{`workspace policy
  -> link resolver selected
  -> routed domains assigned
  -> vpn split horizon checked
  -> leak probe compared
  -> rollback copy retained`}</pre>
            </section>

            <section className="lanePanel" aria-label="DNS resolver planning lanes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Coverage</p>
                  <h2>Routing lanes</h2>
                </div>
              </div>
              <div className="laneList">
                {lanes.map((lane) => (
                  <article data-state={lane.state} key={lane.name}>
                    <div>
                      <span>{stateLabels[lane.state]}</span>
                      <h3>{lane.name}</h3>
                      <p>{lane.scope}</p>
                    </div>
                    <meter min="0" max="100" value={lane.score} aria-label={`${lane.name} coverage`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="changePanel" aria-label="Rollback-safe DNS changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Changes</p>
                  <h2>Resolver edits</h2>
                </div>
              </div>
              <div className="changeList">
                {changes.map((change) => (
                  <article data-state={change.state} key={change.mode}>
                    <span>{stateLabels[change.state]}</span>
                    <h3>{change.mode}</h3>
                    <p>{change.behavior}</p>
                    <strong>{change.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="probePanel" aria-label="Staged DNS resolver probes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged probes</p>
                  <h2>Review commands</h2>
                </div>
              </div>
              <div className="probeList">
                {probes.map((probe) => (
                  <article data-state={probe.state} key={probe.target}>
                    <span>{stateLabels[probe.state]}</span>
                    <h3>{probe.target}</h3>
                    <p>{probe.action}</p>
                    <code>{probe.command}</code>
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
