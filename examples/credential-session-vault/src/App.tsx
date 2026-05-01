type Exposure = 'sealed' | 'session' | 'review';

type CredentialLane = {
  name: string;
  exposure: Exposure;
  workspace: string;
  source: string;
  ttl: string;
  policy: string;
};

type AgentStatus = {
  label: string;
  value: string;
  detail: string;
  exposure: Exposure;
};

type Guardrail = {
  trigger: string;
  action: string;
  owner: string;
};

const lanes: CredentialLane[] = [
  {
    name: 'SSH Deploy Key',
    exposure: 'session',
    workspace: 'Build',
    source: 'ssh-agent',
    ttl: '45 min',
    policy: 'Expose only after release verifier passes'
  },
  {
    name: 'GitHub Token',
    exposure: 'sealed',
    workspace: 'Ops',
    source: 'secret-tool',
    ttl: 'manual unlock',
    policy: 'Read-only status by default'
  },
  {
    name: 'Package Signing Key',
    exposure: 'review',
    workspace: 'AUR',
    source: 'gpg-agent',
    ttl: '10 min',
    policy: 'Require explicit signing intent'
  },
  {
    name: 'Cloud Session',
    exposure: 'session',
    workspace: 'Network',
    source: 'keyring',
    ttl: '25 min',
    policy: 'Drop when VPN posture changes'
  }
];

const agentStatuses: AgentStatus[] = [
  {
    label: 'Keyring',
    value: 'Ready',
    detail: 'Unlocked for current user session',
    exposure: 'session'
  },
  {
    label: 'SSH agent',
    value: '2 keys',
    detail: 'Deploy key requires workspace match',
    exposure: 'session'
  },
  {
    label: 'GPG agent',
    value: 'Review',
    detail: 'Signing key still needs confirmation',
    exposure: 'review'
  },
  {
    label: 'Clipboard',
    value: 'Sealed',
    detail: 'Secret copy is disabled by policy',
    exposure: 'sealed'
  }
];

const guardrails: Guardrail[] = [
  {
    trigger: 'Workspace loses VPN trust',
    action: 'Revoke cloud session and clear agents',
    owner: 'Network Profile Mapper'
  },
  {
    trigger: 'Signing key requested',
    action: 'Require focused AUR Packager window',
    owner: 'AUR Packager'
  },
  {
    trigger: 'Automation asks for secrets',
    action: 'Require rollback recipe before export',
    owner: 'Workspace Automation Builder'
  }
];

const exposureLabels: Record<Exposure, string> = {
  sealed: 'Sealed',
  session: 'Session',
  review: 'Review'
};

const sessionLanes = lanes.filter((lane) => lane.exposure === 'session').length;
const sealedLanes = lanes.filter((lane) => lane.exposure === 'sealed').length;
const reviewLanes = lanes.filter((lane) => lane.exposure === 'review').length;

export function App() {
  return (
    <main className="shell">
      <section className="vault" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Credential sessions</p>
            <h1 id="page-title">Vault Studio</h1>
          </div>
          <div className="syncBadge">
            <span />
            exposure policy armed
          </div>
        </header>

        <section className="metrics" aria-label="Credential summary">
          <article>
            <span>{lanes.length}</span>
            <p>credential lanes</p>
          </article>
          <article>
            <span>{sessionLanes}</span>
            <p>session scoped</p>
          </article>
          <article>
            <span>{sealedLanes}</span>
            <p>sealed</p>
          </article>
          <article>
            <span>{reviewLanes}</span>
            <p>needs review</p>
          </article>
        </section>

        <section className="layout">
          <div className="lanePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Exposure lanes</p>
                <h2>Workspace credential map</h2>
              </div>
              <button type="button">Stage Policy</button>
            </div>

            <div className="laneList" role="list" aria-label="Credential exposure lanes">
              {lanes.map((lane) => (
                <article className="lane" data-exposure={lane.exposure} key={lane.name} role="listitem">
                  <div className="laneTitle">
                    <span>{exposureLabels[lane.exposure]}</span>
                    <h3>{lane.name}</h3>
                    <p>{lane.policy}</p>
                  </div>
                  <div className="laneMeta">
                    <span>{lane.workspace}</span>
                    <span>{lane.source}</span>
                    <span>{lane.ttl}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="agentPanel" aria-label="Agent readiness">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Agent readiness</p>
                  <h2>Session state</h2>
                </div>
              </div>
              <div className="agentList">
                {agentStatuses.map((status) => (
                  <article data-exposure={status.exposure} key={status.label}>
                    <div>
                      <h3>{status.label}</h3>
                      <p>{status.detail}</p>
                    </div>
                    <strong>{status.value}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="guardPanel" aria-label="Vault guardrails">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Guardrails</p>
                  <h2>Revocation checks</h2>
                </div>
              </div>
              <div className="guardList">
                {guardrails.map((guardrail) => (
                  <article key={guardrail.trigger}>
                    <span />
                    <div>
                      <h3>{guardrail.trigger}</h3>
                      <p>{guardrail.action}</p>
                      <small>{guardrail.owner}</small>
                    </div>
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
