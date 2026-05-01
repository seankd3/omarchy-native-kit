import { useMemo, useState } from 'react';

type RestoreStep = {
  app: string;
  workspace: string;
  command: string;
  waitsFor: string;
  status: 'ready' | 'wait' | 'review';
  seconds: number;
};

const steps: RestoreStep[] = [
  { app: 'Signal Desk', workspace: '1', command: 'npm run preview', waitsFor: 'network', status: 'ready', seconds: 3 },
  { app: 'Docs Reader', workspace: '2', command: 'npm run preview', waitsFor: 'files', status: 'ready', seconds: 5 },
  { app: 'Theme Forge', workspace: '3', command: 'npm run preview', waitsFor: 'theme sync', status: 'wait', seconds: 8 },
  { app: 'Config Diff Studio', workspace: '4', command: 'npm run preview', waitsFor: 'git clean', status: 'review', seconds: 12 }
];

const statusClass: Record<RestoreStep['status'], string> = {
  ready: 'ready',
  wait: 'wait',
  review: 'review'
};

export function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex];
  const readyCount = steps.filter((step) => step.status === 'ready').length;
  const totalSeconds = useMemo(() => steps.reduce((sum, step) => sum + step.seconds, 0), []);

  return (
    <main className="shell">
      <section className="workspace" aria-label="Session restore planner">
        <div className="topbar">
          <span className="app-id">session.restore</span>
          <span className="state">{readyCount}/{steps.length} ready</span>
        </div>

        <section className="brief" aria-labelledby="brief-title">
          <div>
            <p className="eyebrow">Startup choreography</p>
            <h1 id="brief-title">Plan restore order before automation runs.</h1>
          </div>
          <div className="metricPair" aria-label="Session plan summary">
            <div>
              <strong>{steps.length}</strong>
              <span>apps</span>
            </div>
            <div>
              <strong>{totalSeconds}s</strong>
              <span>boot</span>
            </div>
          </div>
        </section>

        <div className="plannerGrid">
          <div className="stepList" role="list" aria-label="Restore steps">
            {steps.map((step, index) => (
              <button
                className={`stepRow ${index === activeIndex ? 'selected' : ''}`}
                key={step.app}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span className="order">{index + 1}</span>
                <span>
                  <strong>{step.app}</strong>
                  <small>workspace {step.workspace}</small>
                </span>
                <em className={statusClass[step.status]}>{step.status}</em>
              </button>
            ))}
          </div>

          <section className="timeline" aria-label="Restore timeline">
            {steps.map((step, index) => (
              <div className={`timelineStep ${index <= activeIndex ? 'reached' : ''}`} key={step.app}>
                <span>{step.seconds}s</span>
                <strong>{step.app}</strong>
                <small>{step.waitsFor}</small>
              </div>
            ))}
          </section>

          <aside className="inspector" aria-label="Restore step inspector">
            <div className="stepCard">
              <span>workspace {activeStep.workspace}</span>
              <strong>{activeStep.app}</strong>
            </div>

            <dl>
              <div>
                <dt>Command</dt>
                <dd><code>{activeStep.command}</code></dd>
              </div>
              <div>
                <dt>Waits for</dt>
                <dd>{activeStep.waitsFor}</dd>
              </div>
              <div>
                <dt>Automation cue</dt>
                <dd>{automationCue(activeStep)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}

function automationCue(step: RestoreStep) {
  if (step.status === 'ready') return 'Safe to include in the first restore pass.';
  if (step.status === 'wait') return 'Add a readiness check before launching this app.';
  return 'Review the working tree or state dependency before automation.';
}
