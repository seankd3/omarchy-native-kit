type PolicyState = 'safe' | 'review' | 'denied';

type SandboxProfile = {
  app: string;
  profile: string;
  binds: string;
  portals: string;
  network: string;
  state: PolicyState;
};

type SimulationProfile = {
  name: string;
  scope: string;
  score: number;
  state: PolicyState;
};

type PolicyExperiment = {
  mode: string;
  behavior: string;
  rollback: string;
  state: PolicyState;
};

type ReviewProbe = {
  target: string;
  action: string;
  command: string;
  state: PolicyState;
};

const profiles: SandboxProfile[] = [
  {
    app: 'Research browser',
    profile: 'web-untrusted',
    binds: 'Downloads quarantine only',
    portals: 'FileChooser + OpenURI',
    network: 'private namespace',
    state: 'review'
  },
  {
    app: 'Docs reader',
    profile: 'read-mostly',
    binds: 'docs directory read-only',
    portals: 'document portal',
    network: 'offline',
    state: 'safe'
  },
  {
    app: 'Package builder',
    profile: 'build jail',
    binds: 'cache + source checkout',
    portals: 'none',
    network: 'mirror allowlist',
    state: 'review'
  },
  {
    app: 'Legacy helper',
    profile: 'host escape',
    binds: 'home directory writable',
    portals: 'bypassed',
    network: 'host network',
    state: 'denied'
  }
];

const simulations: SimulationProfile[] = [
  {
    name: 'Bind mounts',
    scope: 'read-only, cache, quarantine, host write',
    score: 76,
    state: 'review'
  },
  {
    name: 'Portal holes',
    scope: 'FileChooser, OpenURI, document grants',
    score: 68,
    state: 'review'
  },
  {
    name: 'Network namespace',
    scope: 'offline, private, VPN, mirror allowlist',
    score: 84,
    state: 'safe'
  }
];

const experiments: PolicyExperiment[] = [
  {
    mode: 'Browser quarantine',
    behavior: 'route downloads into an isolated folder before opener handoff',
    rollback: 'restore browser download path',
    state: 'review'
  },
  {
    mode: 'Offline docs',
    behavior: 'drop network access and expose only read-only documentation',
    rollback: 're-enable default namespace',
    state: 'safe'
  },
  {
    mode: 'Legacy helper block',
    behavior: 'deny host-write bind until helper uses portals or explicit paths',
    rollback: 'keep existing launcher disabled',
    state: 'denied'
  }
];

const probes: ReviewProbe[] = [
  {
    target: 'Flatpak override',
    action: 'Inspect bind mounts and portal permissions before simulating a policy change',
    command: 'flatpak override --show',
    state: 'review'
  },
  {
    target: 'Namespace check',
    action: 'Compare network namespace and route assumptions for sandboxed commands',
    command: 'ip netns list && ip route',
    state: 'safe'
  },
  {
    target: 'Portal surface',
    action: 'Map available portals before punching any new document or opener hole',
    command: 'busctl --user tree org.freedesktop.portal.Desktop',
    state: 'review'
  },
  {
    target: 'Host escape',
    action: 'Block writable home binds until a rollback recipe is staged and reviewed',
    command: 'findmnt --target "$HOME"',
    state: 'denied'
  }
];

const stateLabels: Record<PolicyState, string> = {
  safe: 'Safe',
  review: 'Review',
  denied: 'Denied'
};

const safeCount = profiles.filter((profile) => profile.state === 'safe').length;
const reviewCount = profiles.filter((profile) => profile.state === 'review').length;
const deniedCount = profiles.filter((profile) => profile.state === 'denied').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Sandbox policy</p>
            <h1 id="page-title">Policy Simulator</h1>
          </div>
          <button type="button">Stage Experiment</button>
        </header>

        <section className="metrics" aria-label="Sandbox policy summary">
          <article>
            <span>{profiles.length}</span>
            <p>profiles tested</p>
          </article>
          <article>
            <span>{safeCount}</span>
            <p>safe</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{deniedCount}</span>
            <p>denied</p>
          </article>
        </section>

        <section className="layout">
          <section className="policyPanel" aria-label="Sandbox policy matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Policy matrix</p>
                <h2>Sandbox profiles, bind mounts, portal holes, and network namespaces</h2>
              </div>
              <div className="policyBadge">
                <span />
                rollback staged
              </div>
            </div>

            <div className="profileRows" role="list">
              {profiles.map((profile) => (
                <article className="profileRow" data-state={profile.state} key={profile.app} role="listitem" tabIndex={0}>
                  <div className="profileTitle">
                    <span>{stateLabels[profile.state]}</span>
                    <h3>{profile.app}</h3>
                    <p>{profile.profile}</p>
                  </div>
                  <div className="profileMeta">
                    <div>
                      <small>binds</small>
                      <strong>{profile.binds}</strong>
                    </div>
                    <div>
                      <small>portals</small>
                      <strong>{profile.portals}</strong>
                    </div>
                    <div>
                      <small>network</small>
                      <strong>{profile.network}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Sandbox simulation route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Simulation route</h2>
                </div>
              </div>
              <pre aria-label="Sandbox policy simulation route preview">{`policy draft
  -> bind mounts compared
  -> portal holes mapped
  -> network namespace tested
  -> risky host access denied
  -> rollback command staged`}</pre>
            </section>

            <section className="simulationPanel" aria-label="Sandbox simulation readiness">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Profiles</p>
                  <h2>Readiness</h2>
                </div>
              </div>
              <div className="simulationList">
                {simulations.map((simulation) => (
                  <article data-state={simulation.state} key={simulation.name}>
                    <div>
                      <span>{stateLabels[simulation.state]}</span>
                      <h3>{simulation.name}</h3>
                      <p>{simulation.scope}</p>
                    </div>
                    <meter min="0" max="100" value={simulation.score} aria-label={`${simulation.name} readiness`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="experimentPanel" aria-label="Rollback-safe sandbox policy experiments">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Experiments</p>
                  <h2>Policy changes</h2>
                </div>
              </div>
              <div className="experimentList">
                {experiments.map((experiment) => (
                  <article data-state={experiment.state} key={experiment.mode}>
                    <span>{stateLabels[experiment.state]}</span>
                    <h3>{experiment.mode}</h3>
                    <p>{experiment.behavior}</p>
                    <strong>{experiment.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="probePanel" aria-label="Staged sandbox policy probes">
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
