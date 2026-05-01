type AgentState = 'clean' | 'watch' | 'risk';

type AgentSocket = {
  name: string;
  path: string;
  owner: string;
  forwarded: string;
  state: AgentState;
};

type Identity = {
  label: string;
  fingerprint: string;
  lifetime: string;
  destination: string;
  state: AgentState;
};

type Exposure = {
  surface: string;
  route: string;
  policy: string;
  rollback: string;
  state: AgentState;
};

type Probe = {
  label: string;
  command: string;
  result: string;
  state: AgentState;
};

const sockets: AgentSocket[] = [
  {
    name: 'Desktop session',
    path: '/run/user/1000/keyring/ssh',
    owner: 'gnome-keyring-daemon',
    forwarded: 'no remote forwarding',
    state: 'clean'
  },
  {
    name: 'Terminal override',
    path: '/tmp/ssh-agent.shell/agent.sock',
    owner: 'ssh-agent',
    forwarded: 'one tmux pane',
    state: 'watch'
  },
  {
    name: 'Remote workspace',
    path: '/tmp/ssh-remote/agent.4121',
    owner: 'forwarded socket',
    forwarded: 'build host active',
    state: 'risk'
  }
];

const identities: Identity[] = [
  {
    label: 'work-github-ed25519',
    fingerprint: 'SHA256:a92d...work',
    lifetime: '2h remaining',
    destination: 'github.com',
    state: 'clean'
  },
  {
    label: 'deploy-prod-rsa',
    fingerprint: 'SHA256:f31c...prod',
    lifetime: 'no expiry',
    destination: 'deploy shell',
    state: 'risk'
  },
  {
    label: 'homelab-admin',
    fingerprint: 'SHA256:b78a...lab',
    lifetime: '45m remaining',
    destination: 'tailscale hosts',
    state: 'watch'
  },
  {
    label: 'signing-only',
    fingerprint: 'SHA256:7ab0...sign',
    lifetime: 'locked',
    destination: 'git signatures',
    state: 'clean'
  }
];

const exposures: Exposure[] = [
  {
    surface: 'SSH forwarding',
    route: 'laptop -> build host',
    policy: 'allow only for named workspace',
    rollback: 'unset ForwardAgent for build alias',
    state: 'watch'
  },
  {
    surface: 'No-expiry key',
    route: 'deploy-prod-rsa',
    policy: 'require confirm plus 30 minute lifetime',
    rollback: 'restore previous ssh-add cache',
    state: 'risk'
  },
  {
    surface: 'Socket ownership',
    route: 'desktop keyring socket',
    policy: 'prefer keyring-owned socket for local apps',
    rollback: 'export SSH_AUTH_SOCK override',
    state: 'clean'
  }
];

const probes: Probe[] = [
  {
    label: 'Socket',
    command: 'printf "%s\\n" "$SSH_AUTH_SOCK"',
    result: 'compare shell, launcher, and service environments',
    state: 'clean'
  },
  {
    label: 'Identities',
    command: 'ssh-add -l -E sha256',
    result: 'list loaded identities without exposing private key material',
    state: 'watch'
  },
  {
    label: 'Lifetime',
    command: 'ssh-add -T ~/.ssh/id_ed25519.pub',
    result: 'test agent-held key before changing expiry policy',
    state: 'clean'
  },
  {
    label: 'Forwarding',
    command: 'ssh -G build-host | rg forwardagent',
    result: 'find host aliases with agent forwarding enabled',
    state: 'risk'
  }
];

const stateLabels: Record<AgentState, string> = {
  clean: 'Clean',
  watch: 'Watch',
  risk: 'Risk'
};

const cleanCount = identities.filter((identity) => identity.state === 'clean').length;
const watchCount = identities.filter((identity) => identity.state === 'watch').length;
const riskCount = identities.filter((identity) => identity.state === 'risk').length;
const forwardedCount = sockets.filter((socket) => socket.state !== 'clean').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">SSH agent</p>
            <h1 id="page-title">Session Monitor</h1>
          </div>
          <button type="button">Stage Key Hygiene</button>
        </header>

        <section className="metrics" aria-label="SSH agent summary">
          <article>
            <span>{identities.length}</span>
            <p>loaded identities</p>
          </article>
          <article>
            <span>{cleanCount}</span>
            <p>clean keys</p>
          </article>
          <article>
            <span>{watchCount}</span>
            <p>watch items</p>
          </article>
          <article>
            <span>{riskCount + forwardedCount}</span>
            <p>forwarding risks</p>
          </article>
        </section>

        <section className="layout">
          <section className="socketPanel" aria-label="SSH agent sockets">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Socket map</p>
                <h2>SSH agent sockets, loaded identities, forwarding exposure, lifetime policies, and rollback-safe key hygiene</h2>
              </div>
              <div className="statusBadge">
                <span />
                session scoped
              </div>
            </div>

            <div className="socketRows" role="list">
              {sockets.map((socket) => (
                <article className="socketRow" data-state={socket.state} key={socket.path} role="listitem" tabIndex={0}>
                  <div className="socketTitle">
                    <span>{stateLabels[socket.state]}</span>
                    <h3>{socket.name}</h3>
                    <p>{socket.path}</p>
                  </div>
                  <div className="socketMeta">
                    <div>
                      <small>owner</small>
                      <strong>{socket.owner}</strong>
                    </div>
                    <div>
                      <small>forwarding</small>
                      <strong>{socket.forwarded}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="identityPanel" aria-label="Loaded SSH identities">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Keys</p>
                  <h2>Loaded identities</h2>
                </div>
              </div>
              <div className="identityList">
                {identities.map((identity) => (
                  <article data-state={identity.state} key={identity.fingerprint}>
                    <span>{stateLabels[identity.state]}</span>
                    <h3>{identity.label}</h3>
                    <p>{identity.fingerprint}</p>
                    <strong>{identity.lifetime}</strong>
                    <small>{identity.destination}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="exposurePanel" aria-label="SSH agent forwarding exposure">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Exposure</p>
                  <h2>Policy changes</h2>
                </div>
              </div>
              <div className="exposureList">
                {exposures.map((exposure) => (
                  <article data-state={exposure.state} key={exposure.surface}>
                    <span>{stateLabels[exposure.state]}</span>
                    <h3>{exposure.surface}</h3>
                    <p>{exposure.route}</p>
                    <strong>{exposure.policy}</strong>
                    <small>{exposure.rollback}</small>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="probePanel" aria-label="SSH agent inspection commands">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Inspection queue</p>
              <h2>Command probes</h2>
            </div>
          </div>
          <div className="probeGrid">
            {probes.map((probe) => (
              <article data-state={probe.state} key={probe.label}>
                <span>{stateLabels[probe.state]}</span>
                <h3>{probe.label}</h3>
                <code>{probe.command}</code>
                <p>{probe.result}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
