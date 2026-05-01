type ProfileState = 'enforce' | 'review' | 'deny';

type AppArmorProfile = {
  app: string;
  intent: string;
  denied: string;
  portal: string;
  override: string;
  state: ProfileState;
};

type CoverageProfile = {
  name: string;
  scope: string;
  score: number;
  state: ProfileState;
};

type ConfinementChange = {
  mode: string;
  behavior: string;
  rollback: string;
  state: ProfileState;
};

type ReviewProbe = {
  target: string;
  action: string;
  command: string;
  state: ProfileState;
};

const profiles: AppArmorProfile[] = [
  {
    app: 'Research browser',
    intent: 'web sandbox',
    denied: 'home write outside downloads',
    portal: 'FileChooser document handoff',
    override: 'local deny rule staged',
    state: 'review'
  },
  {
    app: 'Docs reader',
    intent: 'read-only docs',
    denied: 'network access',
    portal: 'document portal',
    override: 'none',
    state: 'enforce'
  },
  {
    app: 'Package builder',
    intent: 'build workspace',
    denied: 'keyring and browser state',
    portal: 'none',
    override: 'cache path allowlist',
    state: 'review'
  },
  {
    app: 'Legacy helper',
    intent: 'unknown helper',
    denied: 'unconfined home traversal',
    portal: 'missing',
    override: 'block launcher',
    state: 'deny'
  }
];

const coverage: CoverageProfile[] = [
  {
    name: 'Denied operations',
    scope: 'file, network, dbus, keyring',
    score: 79,
    state: 'review'
  },
  {
    name: 'Portal alternatives',
    scope: 'FileChooser, Documents, OpenURI',
    score: 86,
    state: 'enforce'
  },
  {
    name: 'Local overrides',
    scope: 'profile.d snippets and rollback copies',
    score: 61,
    state: 'review'
  }
];

const changes: ConfinementChange[] = [
  {
    mode: 'Browser write deny',
    behavior: 'deny broad home writes and route selected files through document portal',
    rollback: 'remove local deny snippet',
    state: 'review'
  },
  {
    mode: 'Docs offline',
    behavior: 'enforce read-only docs access without network capability',
    rollback: 'switch profile to complain',
    state: 'enforce'
  },
  {
    mode: 'Legacy block',
    behavior: 'keep helper disabled until intent and portal alternative are documented',
    rollback: 'restore launcher after review',
    state: 'deny'
  }
];

const probes: ReviewProbe[] = [
  {
    target: 'Profile status',
    action: 'Inspect loaded profiles and modes before editing local overrides',
    command: 'aa-status',
    state: 'enforce'
  },
  {
    target: 'Denied operations',
    action: 'Review recent AppArmor denials before choosing a portal alternative',
    command: 'journalctl -k -g apparmor',
    state: 'review'
  },
  {
    target: 'Local override',
    action: 'Stage profile snippets as reversible local changes, then reload explicitly',
    command: 'sudo apparmor_parser -r /etc/apparmor.d/<profile>',
    state: 'review'
  },
  {
    target: 'Unconfined helper',
    action: 'Block launchers that still require unconfined home traversal',
    command: 'grep -R \"unconfined\" /etc/apparmor.d',
    state: 'deny'
  }
];

const stateLabels: Record<ProfileState, string> = {
  enforce: 'Enforce',
  review: 'Review',
  deny: 'Deny'
};

const enforceCount = profiles.filter((profile) => profile.state === 'enforce').length;
const reviewCount = profiles.filter((profile) => profile.state === 'review').length;
const denyCount = profiles.filter((profile) => profile.state === 'deny').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">AppArmor policy</p>
            <h1 id="page-title">Profile Workbench</h1>
          </div>
          <button type="button">Stage Override</button>
        </header>

        <section className="metrics" aria-label="AppArmor profile summary">
          <article>
            <span>{profiles.length}</span>
            <p>profiles inspected</p>
          </article>
          <article>
            <span>{enforceCount}</span>
            <p>enforce</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{denyCount}</span>
            <p>deny</p>
          </article>
        </section>

        <section className="layout">
          <section className="profilePanel" aria-label="AppArmor profile matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Profile matrix</p>
                <h2>Profile intents, denied operations, portal alternatives, and local overrides</h2>
              </div>
              <div className="profileBadge">
                <span />
                local rollback
              </div>
            </div>

            <div className="profileRows" role="list">
              {profiles.map((profile) => (
                <article className="profileRow" data-state={profile.state} key={profile.app} role="listitem" tabIndex={0}>
                  <div className="profileTitle">
                    <span>{stateLabels[profile.state]}</span>
                    <h3>{profile.app}</h3>
                    <p>{profile.intent}</p>
                  </div>
                  <div className="profileMeta">
                    <div>
                      <small>denied</small>
                      <strong>{profile.denied}</strong>
                    </div>
                    <div>
                      <small>portal</small>
                      <strong>{profile.portal}</strong>
                    </div>
                    <div>
                      <small>override</small>
                      <strong>{profile.override}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="AppArmor confinement route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Confinement route</h2>
                </div>
              </div>
              <pre aria-label="AppArmor profile route preview">{`profile intent
  -> denied operation reviewed
  -> portal alternative selected
  -> local override staged
  -> parser reload planned
  -> rollback copy retained`}</pre>
            </section>

            <section className="coveragePanel" aria-label="AppArmor coverage profiles">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Coverage</p>
                  <h2>Readiness</h2>
                </div>
              </div>
              <div className="coverageList">
                {coverage.map((item) => (
                  <article data-state={item.state} key={item.name}>
                    <div>
                      <span>{stateLabels[item.state]}</span>
                      <h3>{item.name}</h3>
                      <p>{item.scope}</p>
                    </div>
                    <meter min="0" max="100" value={item.score} aria-label={`${item.name} coverage`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="changePanel" aria-label="Rollback-safe AppArmor changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Changes</p>
                  <h2>Confinement edits</h2>
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

            <section className="probePanel" aria-label="Staged AppArmor probes">
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
