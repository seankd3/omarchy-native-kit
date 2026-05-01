type RuntimeState = 'healthy' | 'review' | 'blocked';

type RuntimeService = {
  name: string;
  runtime: string;
  socket: string;
  images: string;
  rollback: string;
  state: RuntimeState;
};

type RuntimeLane = {
  name: string;
  scope: string;
  score: number;
  state: RuntimeState;
};

type RuntimeChange = {
  mode: string;
  behavior: string;
  rollback: string;
  state: RuntimeState;
};

type RuntimeProbe = {
  target: string;
  action: string;
  command: string;
  state: RuntimeState;
};

const services: RuntimeService[] = [
  {
    name: 'Podman user socket',
    runtime: 'rootless podman',
    socket: 'user socket enabled for dev workspace',
    images: 'signed base images only',
    rollback: 'systemctl --user disable podman.socket',
    state: 'healthy'
  },
  {
    name: 'Docker compatibility',
    runtime: 'docker context',
    socket: 'unix socket exposed to build tools',
    images: 'mixed provenance',
    rollback: 'switch context back to podman',
    state: 'review'
  },
  {
    name: 'Registry mirror',
    runtime: 'podman pull policy',
    socket: 'no socket exposure',
    images: 'trusted mirror with digest pins',
    rollback: 'restore registries.conf snapshot',
    state: 'healthy'
  },
  {
    name: 'Legacy compose stack',
    runtime: 'docker compose',
    socket: 'root socket required',
    images: 'latest tags and broad mounts',
    rollback: 'block compose autostart',
    state: 'blocked'
  }
];

const lanes: RuntimeLane[] = [
  {
    name: 'Socket exposure',
    scope: 'rootless user sockets, docker.sock, and group membership',
    score: 72,
    state: 'review'
  },
  {
    name: 'Image trust',
    scope: 'signed images, digest pins, registry mirrors, and latest tags',
    score: 84,
    state: 'healthy'
  },
  {
    name: 'Volume mounts',
    scope: 'home mounts, secrets paths, cache volumes, and readonly flags',
    score: 58,
    state: 'blocked'
  }
];

const changes: RuntimeChange[] = [
  {
    mode: 'Rootless default',
    behavior: 'route generated app builds through rootless Podman where possible',
    rollback: 'restore docker context and socket env',
    state: 'healthy'
  },
  {
    mode: 'Digest pinning',
    behavior: 'replace latest tags with digests before scheduled rebuilds',
    rollback: 'restore compose image snapshot',
    state: 'review'
  },
  {
    mode: 'Mount quarantine',
    behavior: 'block containers that mount broad home paths with write access',
    rollback: 'restore stack after mount review',
    state: 'blocked'
  }
];

const probes: RuntimeProbe[] = [
  {
    target: 'Podman socket',
    action: 'Check rootless socket status before enabling build workflows',
    command: 'systemctl --user status podman.socket',
    state: 'healthy'
  },
  {
    target: 'Docker exposure',
    action: 'Inspect whether docker.sock is reachable by desktop sessions',
    command: 'docker context ls && ls -l /var/run/docker.sock',
    state: 'review'
  },
  {
    target: 'Image provenance',
    action: 'List image digests and tags that still need trust review',
    command: 'podman images --digests',
    state: 'review'
  },
  {
    target: 'Broad mounts',
    action: 'Find running containers with writable home or secrets mounts',
    command: 'podman inspect --format "{{.Mounts}}" $(podman ps -q)',
    state: 'blocked'
  }
];

const stateLabels: Record<RuntimeState, string> = {
  healthy: 'Healthy',
  review: 'Review',
  blocked: 'Blocked'
};

const healthyCount = services.filter((service) => service.state === 'healthy').length;
const reviewCount = services.filter((service) => service.state === 'review').length;
const blockedCount = services.filter((service) => service.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="dashboard" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Container runtime</p>
            <h1 id="page-title">Runtime Dashboard</h1>
          </div>
          <button type="button">Stage Runtime Fix</button>
        </header>

        <section className="metrics" aria-label="Container runtime summary">
          <article>
            <span>{services.length}</span>
            <p>services inspected</p>
          </article>
          <article>
            <span>{healthyCount}</span>
            <p>healthy</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked</p>
          </article>
        </section>

        <section className="layout">
          <section className="runtimePanel" aria-label="Container runtime service matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Service matrix</p>
                <h2>Podman and Docker services, socket exposure, image trust, volume mounts, and rollback changes</h2>
              </div>
              <div className="runtimeBadge">
                <span />
                rootless first
              </div>
            </div>

            <div className="runtimeRows" role="list">
              {services.map((service) => (
                <article className="runtimeRow" data-state={service.state} key={service.name} role="listitem" tabIndex={0}>
                  <div className="runtimeTitle">
                    <span>{stateLabels[service.state]}</span>
                    <h3>{service.name}</h3>
                    <p>{service.runtime}</p>
                  </div>
                  <div className="runtimeMeta">
                    <div>
                      <small>socket</small>
                      <strong>{service.socket}</strong>
                    </div>
                    <div>
                      <small>images</small>
                      <strong>{service.images}</strong>
                    </div>
                    <div>
                      <small>rollback</small>
                      <strong>{service.rollback}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Container runtime route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Runtime route</h2>
                </div>
              </div>
              <pre aria-label="Container runtime route preview">{`runtime service
  -> socket exposure checked
  -> image trust reviewed
  -> volume mounts audited
  -> rollback command staged
  -> previous config retained`}</pre>
            </section>

            <section className="lanePanel" aria-label="Container runtime planning lanes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Coverage</p>
                  <h2>Runtime lanes</h2>
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

            <section className="changePanel" aria-label="Rollback-safe container runtime changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Changes</p>
                  <h2>Runtime edits</h2>
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

            <section className="probePanel" aria-label="Staged container runtime probes">
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
