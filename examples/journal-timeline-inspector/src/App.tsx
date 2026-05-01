type Severity = 'ok' | 'warn' | 'fail';

type JournalEvent = {
  time: string;
  unit: string;
  message: string;
  boot: string;
  severity: Severity;
};

type Correlation = {
  label: string;
  source: string;
  detail: string;
  severity: Severity;
};

type Annotation = {
  title: string;
  body: string;
  owner: string;
};

const events: JournalEvent[] = [
  {
    time: '08:14:03',
    unit: 'pacman',
    message: 'upgraded xdg-desktop-portal-hyprland 1.3.8-1 -> 1.3.9-1',
    boot: 'current',
    severity: 'warn'
  },
  {
    time: '08:16:21',
    unit: 'xdg-desktop-portal',
    message: 'request timed out while negotiating screencast session',
    boot: 'current',
    severity: 'fail'
  },
  {
    time: '08:18:44',
    unit: 'hyprland',
    message: 'reloaded monitor layout from display profile work-dock',
    boot: 'current',
    severity: 'ok'
  },
  {
    time: 'Yesterday',
    unit: 'wireplumber',
    message: 'fallback audio route selected after USB dock resume',
    boot: 'previous',
    severity: 'warn'
  }
];

const correlations: Correlation[] = [
  {
    label: 'Portal timeout after package update',
    source: 'Package Update Coordinator',
    detail: 'Failure begins two minutes after portal package upgrade.',
    severity: 'fail'
  },
  {
    label: 'Display reload cleared compositor warning',
    source: 'Display Layout Planner',
    detail: 'Monitor profile reload follows the Hyprland notice and restores stable layout.',
    severity: 'ok'
  },
  {
    label: 'Audio fallback repeats after dock resume',
    source: 'Audio Device Mixer',
    detail: 'Same warning appears in three previous boots with the same device path.',
    severity: 'warn'
  }
];

const annotations: Annotation[] = [
  {
    title: 'Incident note',
    body: 'Portal timeout is reproducible only after the current package batch.',
    owner: 'Package Update Coordinator'
  },
  {
    title: 'Rollback candidate',
    body: 'Pin portal package and rerun screencast smoke check before next boot.',
    owner: 'Portal Permission Center'
  },
  {
    title: 'Saved query',
    body: 'journalctl --boot 0 --unit xdg-desktop-portal --priority warning',
    owner: 'Docs Reader'
  }
];

const severityLabels: Record<Severity, string> = {
  ok: 'Stable',
  warn: 'Warn',
  fail: 'Fail'
};

const failureCount = events.filter((event) => event.severity === 'fail').length;
const warningCount = events.filter((event) => event.severity === 'warn').length;

export function App() {
  return (
    <main className="shell">
      <section className="inspector" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Journal timeline</p>
            <h1 id="page-title">Incident Inspector</h1>
          </div>
          <div className="captureBadge">
            <span />
            current boot indexed
          </div>
        </header>

        <section className="metrics" aria-label="Journal summary">
          <article>
            <span>{events.length}</span>
            <p>timeline events</p>
          </article>
          <article>
            <span>{failureCount}</span>
            <p>service failure</p>
          </article>
          <article>
            <span>{warningCount}</span>
            <p>warnings linked</p>
          </article>
          <article>
            <span>{annotations.length}</span>
            <p>saved notes</p>
          </article>
        </section>

        <section className="layout">
          <div className="timelinePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Boot lane</p>
                <h2>Correlate failures with updates and service restarts</h2>
              </div>
              <button type="button">Save Incident</button>
            </div>

            <div className="timeline" role="list" aria-label="Journal events">
              {events.map((event) => (
                <article className="event" data-severity={event.severity} key={`${event.time}-${event.unit}`} role="listitem" tabIndex={0}>
                  <div className="eventTime">
                    <span>{event.time}</span>
                    <small>{event.boot}</small>
                  </div>
                  <div className="eventBody">
                    <span>{severityLabels[event.severity]}</span>
                    <h3>{event.unit}</h3>
                    <p>{event.message}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="correlationPanel" aria-label="Detected correlations">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Correlations</p>
                  <h2>Likely causes</h2>
                </div>
              </div>
              <div className="correlationList">
                {correlations.map((item) => (
                  <article data-severity={item.severity} key={item.label}>
                    <span>{severityLabels[item.severity]}</span>
                    <h3>{item.label}</h3>
                    <p>{item.detail}</p>
                    <small>{item.source}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="annotationPanel" aria-label="Incident annotations">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Annotations</p>
                  <h2>Saved timeline notes</h2>
                </div>
              </div>
              <div className="annotationList">
                {annotations.map((annotation) => (
                  <article key={annotation.title}>
                    <h3>{annotation.title}</h3>
                    <p>{annotation.body}</p>
                    <small>{annotation.owner}</small>
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
