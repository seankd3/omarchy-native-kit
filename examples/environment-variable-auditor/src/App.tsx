type Drift = 'aligned' | 'mismatch' | 'missing';

type VariableRow = {
  name: string;
  shell: string;
  desktop: string;
  service: string;
  drift: Drift;
};

type ExportFix = {
  target: string;
  action: string;
  command: string;
  drift: Drift;
};

type Guardrail = {
  label: string;
  detail: string;
  owner: string;
};

const variables: VariableRow[] = [
  {
    name: 'XDG_CURRENT_DESKTOP',
    shell: 'Hyprland',
    desktop: 'Hyprland',
    service: 'missing',
    drift: 'missing'
  },
  {
    name: 'GTK_THEME',
    shell: 'Tokyonight-Dark',
    desktop: 'Tokyonight-Dark',
    service: 'Tokyonight-Dark',
    drift: 'aligned'
  },
  {
    name: 'SSH_AUTH_SOCK',
    shell: '/run/user/1000/ssh-agent.socket',
    desktop: '/run/user/1000/keyring/ssh',
    service: '/run/user/1000/ssh-agent.socket',
    drift: 'mismatch'
  },
  {
    name: 'OMARCHY_THEME',
    shell: 'tokyonight',
    desktop: 'tokyonight',
    service: 'tokyonight',
    drift: 'aligned'
  }
];

const fixes: ExportFix[] = [
  {
    target: 'systemd user environment',
    action: 'Import desktop name before portal restarts',
    command: 'systemctl --user import-environment XDG_CURRENT_DESKTOP',
    drift: 'missing'
  },
  {
    target: 'desktop session',
    action: 'Align SSH agent socket with shell session',
    command: 'dbus-update-activation-environment --systemd SSH_AUTH_SOCK',
    drift: 'mismatch'
  },
  {
    target: 'theme hooks',
    action: 'Keep Omarchy theme export in generated hook scope',
    command: 'omarchy-native theme shell --prefix OMARCHY',
    drift: 'aligned'
  }
];

const guardrails: Guardrail[] = [
  {
    label: 'Do not overwrite login shell files',
    detail: 'Stage export commands for review before touching profile, zshenv, or fish config.',
    owner: 'Config Diff Studio'
  },
  {
    label: 'Restart services only after import',
    detail: 'Import user environment before portal, notification, or audio service restarts.',
    owner: 'Service Restart Orchestrator'
  },
  {
    label: 'Compare active app launchers',
    detail: 'Check .desktop Exec environments before blaming service units.',
    owner: 'Portal Permission Center'
  }
];

const driftLabels: Record<Drift, string> = {
  aligned: 'Aligned',
  mismatch: 'Mismatch',
  missing: 'Missing'
};

const mismatchCount = variables.filter((variable) => variable.drift === 'mismatch').length;
const missingCount = variables.filter((variable) => variable.drift === 'missing').length;
const alignedCount = variables.filter((variable) => variable.drift === 'aligned').length;

export function App() {
  return (
    <main className="shell">
      <section className="auditor" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Environment audit</p>
            <h1 id="page-title">Variable Auditor</h1>
          </div>
          <div className="statusBadge">
            <span />
            exports staged safely
          </div>
        </header>

        <section className="metrics" aria-label="Environment summary">
          <article>
            <span>{variables.length}</span>
            <p>variables compared</p>
          </article>
          <article>
            <span>{alignedCount}</span>
            <p>aligned values</p>
          </article>
          <article>
            <span>{mismatchCount}</span>
            <p>mismatch found</p>
          </article>
          <article>
            <span>{missingCount}</span>
            <p>missing export</p>
          </article>
        </section>

        <section className="layout">
          <div className="variablePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Comparison matrix</p>
                <h2>Shell, desktop, and service environments side by side</h2>
              </div>
              <button type="button">Stage Fixes</button>
            </div>

            <div className="variableList" role="list" aria-label="Environment variable comparison">
              {variables.map((variable) => (
                <article className="variable" data-drift={variable.drift} key={variable.name} role="listitem" tabIndex={0}>
                  <div className="variableTitle">
                    <span>{driftLabels[variable.drift]}</span>
                    <h3>{variable.name}</h3>
                  </div>
                  <div className="valueGrid" aria-label={`${variable.name} values`}>
                    <div>
                      <small>shell</small>
                      <code>{variable.shell}</code>
                    </div>
                    <div>
                      <small>desktop</small>
                      <code>{variable.desktop}</code>
                    </div>
                    <div>
                      <small>service</small>
                      <code>{variable.service}</code>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="fixPanel" aria-label="Staged export fixes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged fixes</p>
                  <h2>Export commands</h2>
                </div>
              </div>
              <div className="fixList">
                {fixes.map((fix) => (
                  <article data-drift={fix.drift} key={fix.target}>
                    <span>{driftLabels[fix.drift]}</span>
                    <h3>{fix.target}</h3>
                    <p>{fix.action}</p>
                    <code>{fix.command}</code>
                  </article>
                ))}
              </div>
            </section>

            <section className="guardPanel" aria-label="Environment guardrails">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Guardrails</p>
                  <h2>Safe export policy</h2>
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
