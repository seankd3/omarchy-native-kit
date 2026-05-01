type SettingState = 'aligned' | 'review' | 'drift';

type SettingRow = {
  name: string;
  shell: string;
  desktop: string;
  service: string;
  state: SettingState;
};

type ChangePlan = {
  target: string;
  action: string;
  command: string;
  state: SettingState;
};

type Impact = {
  surface: string;
  detail: string;
  owner: string;
};

const settings: SettingRow[] = [
  {
    name: 'Locale',
    shell: 'en_US.UTF-8',
    desktop: 'en_US.UTF-8',
    service: 'en_US.UTF-8',
    state: 'aligned'
  },
  {
    name: 'Timezone',
    shell: 'America/Chicago',
    desktop: 'America/Chicago',
    service: 'UTC',
    state: 'drift'
  },
  {
    name: 'Keyboard layout',
    shell: 'us',
    desktop: 'us intl',
    service: 'us',
    state: 'review'
  },
  {
    name: 'Clock sync',
    shell: 'systemd-timesyncd active',
    desktop: 'synced',
    service: 'synced',
    state: 'aligned'
  }
];

const changes: ChangePlan[] = [
  {
    target: 'system timezone',
    action: 'Align service timers with desktop session',
    command: 'timedatectl set-timezone America/Chicago',
    state: 'drift'
  },
  {
    target: 'keyboard variant',
    action: 'Review intl variant before applying to login shell',
    command: 'localectl set-x11-keymap us pc105 intl',
    state: 'review'
  },
  {
    target: 'locale exports',
    action: 'Keep UTF-8 locale in shell and desktop activation environment',
    command: 'systemctl --user import-environment LANG LC_ALL',
    state: 'aligned'
  }
];

const impacts: Impact[] = [
  {
    surface: 'Timers and cron-like jobs',
    detail: 'Changing timezone affects service timers and scheduled maintenance windows.',
    owner: 'Service Restart Orchestrator'
  },
  {
    surface: 'Keyboard shortcuts',
    detail: 'Layout variants can change characters used in practiced key chords.',
    owner: 'Shortcut Trainer'
  },
  {
    surface: 'Package logs',
    detail: 'Clock and timezone alignment keeps journal and package events comparable.',
    owner: 'Journal Timeline Inspector'
  }
];

const stateLabels: Record<SettingState, string> = {
  aligned: 'Aligned',
  review: 'Review',
  drift: 'Drift'
};

const alignedCount = settings.filter((setting) => setting.state === 'aligned').length;
const reviewCount = settings.filter((setting) => setting.state === 'review').length;
const driftCount = settings.filter((setting) => setting.state === 'drift').length;

export function App() {
  return (
    <main className="shell">
      <section className="manager" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Locale and time</p>
            <h1 id="page-title">Locale Manager</h1>
          </div>
          <div className="statusBadge">
            <span />
            change plan staged
          </div>
        </header>

        <section className="metrics" aria-label="Locale summary">
          <article>
            <span>{settings.length}</span>
            <p>settings compared</p>
          </article>
          <article>
            <span>{alignedCount}</span>
            <p>aligned</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{driftCount}</span>
            <p>drift found</p>
          </article>
        </section>

        <section className="layout">
          <div className="settingsPanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Comparison matrix</p>
                <h2>Locale, timezone, keyboard, and clock state by runtime</h2>
              </div>
              <button type="button">Preview Apply</button>
            </div>

            <div className="settingsList" role="list" aria-label="Locale and timezone settings">
              {settings.map((setting) => (
                <article className="setting" data-state={setting.state} key={setting.name} role="listitem" tabIndex={0}>
                  <div className="settingTitle">
                    <span>{stateLabels[setting.state]}</span>
                    <h3>{setting.name}</h3>
                  </div>
                  <div className="valueGrid">
                    <div>
                      <small>shell</small>
                      <code>{setting.shell}</code>
                    </div>
                    <div>
                      <small>desktop</small>
                      <code>{setting.desktop}</code>
                    </div>
                    <div>
                      <small>service</small>
                      <code>{setting.service}</code>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="changePanel" aria-label="Staged locale changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged changes</p>
                  <h2>Apply order</h2>
                </div>
              </div>
              <div className="changeList">
                {changes.map((change) => (
                  <article data-state={change.state} key={change.target}>
                    <span>{stateLabels[change.state]}</span>
                    <h3>{change.target}</h3>
                    <p>{change.action}</p>
                    <code>{change.command}</code>
                  </article>
                ))}
              </div>
            </section>

            <section className="impactPanel" aria-label="Change impact">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Impact</p>
                  <h2>What shifts afterward</h2>
                </div>
              </div>
              <div className="impactList">
                {impacts.map((impact) => (
                  <article key={impact.surface}>
                    <h3>{impact.surface}</h3>
                    <p>{impact.detail}</p>
                    <small>{impact.owner}</small>
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
