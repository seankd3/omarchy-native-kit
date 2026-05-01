import { useMemo, useState } from 'react';

type ConfigPatch = {
  file: string;
  summary: string;
  current: string[];
  proposed: string[];
  risk: 'safe' | 'review' | 'rollback';
};

const patches: ConfigPatch[] = [
  {
    file: '~/.config/hypr/hyprland.conf',
    summary: 'Move docs apps to workspace 2',
    current: ['windowrulev2 = workspace 1, class:^(docs-reader)$'],
    proposed: ['windowrulev2 = workspace 2, class:^(docs-reader)$'],
    risk: 'safe'
  },
  {
    file: '~/.config/omarchy/theme/theme.toml',
    summary: 'Stage accent token experiment',
    current: ['accent = "current"'],
    proposed: ['accent = "candidate-blue"'],
    risk: 'review'
  },
  {
    file: '~/.config/hypr/keybindings.conf',
    summary: 'Replace launcher chord',
    current: ['bind = SUPER, SPACE, exec, walker'],
    proposed: ['bind = SUPER, D, exec, walker'],
    risk: 'rollback'
  }
];

const riskClass: Record<ConfigPatch['risk'], string> = {
  safe: 'safe',
  review: 'review',
  rollback: 'rollback'
};

export function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePatch = patches[activeIndex];
  const changedLines = useMemo(
    () => activePatch.current.length + activePatch.proposed.length,
    [activePatch.current.length, activePatch.proposed.length]
  );
  const safeCount = patches.filter((patch) => patch.risk === 'safe').length;

  return (
    <main className="shell">
      <section className="workspace" aria-label="Config diff studio">
        <div className="topbar">
          <span className="app-id">config.diff</span>
          <span className="state">{patches.length} staged</span>
        </div>

        <section className="brief" aria-labelledby="brief-title">
          <div>
            <p className="eyebrow">Reversible config edits</p>
            <h1 id="brief-title">Compare the patch before it reaches disk.</h1>
          </div>
          <div className="meter" aria-label={`${safeCount} safe staged patches`}>
            <strong>{safeCount}</strong>
            <span>safe</span>
          </div>
        </section>

        <div className="studioGrid">
          <div className="patchList" role="list" aria-label="Staged config patches">
            {patches.map((patch, index) => (
              <button
                className={`patchRow ${index === activeIndex ? 'selected' : ''}`}
                key={patch.file}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span>
                  <strong>{patch.summary}</strong>
                  <small>{patch.file}</small>
                </span>
                <em className={riskClass[patch.risk]}>{patch.risk}</em>
              </button>
            ))}
          </div>

          <section className="diffPane" aria-label="Patch diff preview">
            <div className="diffHeader">
              <span>{activePatch.file}</span>
              <strong>{changedLines} lines</strong>
            </div>

            <div className="diffBody">
              {activePatch.current.map((line) => (
                <code className="removed" key={`old-${line}`}>
                  - {line}
                </code>
              ))}
              {activePatch.proposed.map((line) => (
                <code className="added" key={`new-${line}`}>
                  + {line}
                </code>
              ))}
            </div>
          </section>

          <aside className="inspector" aria-label="Patch safety inspector">
            <div className="patchCard">
              <span>{activePatch.risk}</span>
              <strong>{activePatch.summary}</strong>
            </div>

            <dl>
              <div>
                <dt>Target file</dt>
                <dd>{activePatch.file}</dd>
              </div>
              <div>
                <dt>Rollback cue</dt>
                <dd>{rollbackCue(activePatch)}</dd>
              </div>
              <div>
                <dt>Apply mode</dt>
                <dd>Preview only; export a patch after review.</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}

function rollbackCue(patch: ConfigPatch) {
  if (patch.risk === 'rollback') return 'Save the previous binding and keep an alternate launcher chord reachable.';
  if (patch.risk === 'review') return 'Review against the active theme and check the downstream generated CSS.';
  return 'Narrow file target and one-line change make this easy to revert.';
}
