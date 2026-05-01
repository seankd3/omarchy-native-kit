type ZoneState = 'trusted' | 'review' | 'isolated';

type TrustZone = {
  workspace: string;
  zone: string;
  portal: string;
  network: string;
  removable: string;
  state: ZoneState;
};

type ZoneProfile = {
  name: string;
  scope: string;
  score: number;
  state: ZoneState;
};

type IsolationRecipe = {
  mode: string;
  behavior: string;
  rollback: string;
  state: ZoneState;
};

type ReviewStep = {
  target: string;
  action: string;
  command: string;
  state: ZoneState;
};

const zones: TrustZone[] = [
  {
    workspace: 'Focus desk',
    zone: 'trusted local',
    portal: 'file chooser + notifications',
    network: 'home DNS + VPN optional',
    removable: 'manual mount only',
    state: 'trusted'
  },
  {
    workspace: 'Calls',
    zone: 'identity exposed',
    portal: 'camera, microphone, screen',
    network: 'work VPN required',
    removable: 'blocked during meetings',
    state: 'review'
  },
  {
    workspace: 'Research',
    zone: 'untrusted web',
    portal: 'browser downloads + location prompts',
    network: 'split DNS sandbox',
    removable: 'quarantine first',
    state: 'isolated'
  },
  {
    workspace: 'Ops',
    zone: 'privileged admin',
    portal: 'terminal helpers only',
    network: 'trusted SSH hosts',
    removable: 'read-only recovery media',
    state: 'review'
  }
];

const profiles: ZoneProfile[] = [
  {
    name: 'Portal exposure',
    scope: 'files, media, screen, location',
    score: 72,
    state: 'review'
  },
  {
    name: 'Network posture',
    scope: 'VPN, DNS, SSH, captive portals',
    score: 81,
    state: 'trusted'
  },
  {
    name: 'Removable media',
    scope: 'USB, recovery disk, quarantine flow',
    score: 56,
    state: 'isolated'
  }
];

const recipes: IsolationRecipe[] = [
  {
    mode: 'Untrusted research',
    behavior: 'route browser downloads through quarantine before opener handoff',
    rollback: 'restore default opener map',
    state: 'isolated'
  },
  {
    mode: 'Call workspace',
    behavior: 'require VPN and block removable media while screen share is active',
    rollback: 'drop VPN route override',
    state: 'review'
  },
  {
    mode: 'Focus local',
    behavior: 'allow local file chooser and notifications without media portals',
    rollback: 'clear temporary portal grants',
    state: 'trusted'
  }
];

const reviewSteps: ReviewStep[] = [
  {
    target: 'Portal exposure',
    action: 'List active portal services before assigning a workspace trust label',
    command: 'busctl --user tree org.freedesktop.portal.Desktop',
    state: 'review'
  },
  {
    target: 'Network posture',
    action: 'Compare VPN and DNS state for workspaces that handle identity or admin tasks',
    command: 'resolvectl status && ip route',
    state: 'trusted'
  },
  {
    target: 'Removable media',
    action: 'Keep untrusted media on a quarantine path until file handlers are reviewed',
    command: 'lsblk -o NAME,RM,RO,MOUNTPOINTS',
    state: 'isolated'
  },
  {
    target: 'Rollback recipe',
    action: 'Stage reversible commands before changing opener, network, or portal policy',
    command: 'git diff -- ~/.config',
    state: 'review'
  }
];

const stateLabels: Record<ZoneState, string> = {
  trusted: 'Trusted',
  review: 'Review',
  isolated: 'Isolated'
};

const trustedCount = zones.filter((zone) => zone.state === 'trusted').length;
const reviewCount = zones.filter((zone) => zone.state === 'review').length;
const isolatedCount = zones.filter((zone) => zone.state === 'isolated').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Workspace trust</p>
            <h1 id="page-title">Zone Mapper</h1>
          </div>
          <button type="button">Stage Isolation Plan</button>
        </header>

        <section className="metrics" aria-label="Workspace trust zone summary">
          <article>
            <span>{zones.length}</span>
            <p>zones mapped</p>
          </article>
          <article>
            <span>{trustedCount}</span>
            <p>trusted</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{isolatedCount}</span>
            <p>isolated</p>
          </article>
        </section>

        <section className="layout">
          <section className="zonePanel" aria-label="Workspace trust zone matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Zone matrix</p>
                <h2>Workspace trust zones, portal exposure, network posture, and removable media</h2>
              </div>
              <div className="zoneBadge">
                <span />
                reversible policy
              </div>
            </div>

            <div className="zoneList" role="list">
              {zones.map((zone) => (
                <article className="zoneRow" data-state={zone.state} key={zone.workspace} role="listitem" tabIndex={0}>
                  <div className="zoneTitle">
                    <span>{stateLabels[zone.state]}</span>
                    <h3>{zone.workspace}</h3>
                    <p>{zone.zone}</p>
                  </div>
                  <div className="zoneMeta">
                    <div>
                      <small>portal</small>
                      <strong>{zone.portal}</strong>
                    </div>
                    <div>
                      <small>network</small>
                      <strong>{zone.network}</strong>
                    </div>
                    <div>
                      <small>media</small>
                      <strong>{zone.removable}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Trust zone route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Isolation route</h2>
                </div>
              </div>
              <pre aria-label="Trust zone isolation route preview">{`workspace selected
  -> trust label checked
  -> portal exposure reviewed
  -> network posture compared
  -> removable media rule applied
  -> rollback recipe staged`}</pre>
            </section>

            <section className="profilePanel" aria-label="Trust zone posture profiles">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Profiles</p>
                  <h2>Posture scores</h2>
                </div>
              </div>
              <div className="profileList">
                {profiles.map((profile) => (
                  <article data-state={profile.state} key={profile.name}>
                    <div>
                      <span>{stateLabels[profile.state]}</span>
                      <h3>{profile.name}</h3>
                      <p>{profile.scope}</p>
                    </div>
                    <meter min="0" max="100" value={profile.score} aria-label={`${profile.name} posture score`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="recipePanel" aria-label="Rollback-safe isolation recipes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Recipes</p>
                  <h2>Safe isolation</h2>
                </div>
              </div>
              <div className="recipeList">
                {recipes.map((recipe) => (
                  <article data-state={recipe.state} key={recipe.mode}>
                    <span>{stateLabels[recipe.state]}</span>
                    <h3>{recipe.mode}</h3>
                    <p>{recipe.behavior}</p>
                    <strong>{recipe.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="reviewPanel" aria-label="Staged trust zone checks">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged checks</p>
                  <h2>Review probes</h2>
                </div>
              </div>
              <div className="reviewList">
                {reviewSteps.map((step) => (
                  <article data-state={step.state} key={step.target}>
                    <span>{stateLabels[step.state]}</span>
                    <h3>{step.target}</h3>
                    <p>{step.action}</p>
                    <code>{step.command}</code>
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
