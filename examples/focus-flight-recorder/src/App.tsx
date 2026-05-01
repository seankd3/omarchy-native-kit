import { useMemo, useState } from 'react';

type FocusEvent = {
  time: string;
  surface: 'Launcher' | 'Panel' | 'Inspector' | 'Dialog';
  target: string;
  action: string;
  result: 'landed' | 'skipped' | 'looped' | 'blocked';
};

const events: FocusEvent[] = [
  {
    time: '09:14:02',
    surface: 'Launcher',
    target: 'Search input',
    action: 'Super Space',
    result: 'landed'
  },
  {
    time: '09:14:04',
    surface: 'Launcher',
    target: 'Command row',
    action: 'Arrow Down',
    result: 'landed'
  },
  {
    time: '09:14:05',
    surface: 'Panel',
    target: 'Workspace switcher',
    action: 'Tab',
    result: 'skipped'
  },
  {
    time: '09:14:08',
    surface: 'Inspector',
    target: 'Detail action',
    action: 'Enter',
    result: 'landed'
  },
  {
    time: '09:14:11',
    surface: 'Dialog',
    target: 'Cancel button',
    action: 'Shift Tab',
    result: 'looped'
  }
];

const resultClass: Record<FocusEvent['result'], string> = {
  landed: 'success',
  skipped: 'warning',
  looped: 'info',
  blocked: 'danger'
};

const surfaces = ['All', 'Launcher', 'Panel', 'Inspector', 'Dialog'] as const;
type SurfaceFilter = (typeof surfaces)[number];

export function App() {
  const [surfaceFilter, setSurfaceFilter] = useState<SurfaceFilter>('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleEvents = useMemo(
    () => events.filter((event) => surfaceFilter === 'All' || event.surface === surfaceFilter),
    [surfaceFilter]
  );
  const activeEvent = visibleEvents[activeIndex] ?? visibleEvents[0] ?? events[0];
  const landedCount = visibleEvents.filter((event) => event.result === 'landed').length;
  const attentionCount = visibleEvents.length - landedCount;

  return (
    <main className="shell">
      <section className="workspace" aria-label="Focus flight recorder">
        <div className="topbar">
          <span className="app-id">focus.flight</span>
          <span className="state">{attentionCount === 0 ? 'clear route' : `${attentionCount} review`}</span>
        </div>

        <section className="brief" aria-labelledby="brief-title">
          <div>
            <p className="eyebrow">Keyboard trace</p>
            <h1 id="brief-title">Record where focus actually lands.</h1>
          </div>
          <div className="scoreStrip" aria-label="Focus route summary">
            <div>
              <strong>{visibleEvents.length}</strong>
              <span>events</span>
            </div>
            <div>
              <strong>{landedCount}</strong>
              <span>landed</span>
            </div>
          </div>
        </section>

        <div className="surfaceTabs" aria-label="Surface filter">
          {surfaces.map((surface) => (
            <button
              className={surface === surfaceFilter ? 'active' : ''}
              key={surface}
              onClick={() => {
                setSurfaceFilter(surface);
                setActiveIndex(0);
              }}
              type="button"
            >
              {surface}
            </button>
          ))}
        </div>

        <div className="recorderGrid">
          <div className="timeline" role="list" aria-label="Recorded focus events">
            {visibleEvents.map((event, index) => (
              <button
                className={`eventRow ${index === activeIndex ? 'selected' : ''}`}
                key={`${event.time}-${event.target}`}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span className="time">{event.time}</span>
                <span className="route">
                  <strong>{event.surface}</strong>
                  <small>{event.action}</small>
                </span>
                <span className={`badge ${resultClass[event.result]}`}>{event.result}</span>
              </button>
            ))}
          </div>

          <aside className="inspector" aria-label="Focus event inspector">
            <div className="targetBox">
              <span>{activeEvent.surface}</span>
              <strong>{activeEvent.target}</strong>
            </div>

            <dl>
              <div>
                <dt>Action</dt>
                <dd>{activeEvent.action}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{activeEvent.result}</dd>
              </div>
              <div>
                <dt>Review cue</dt>
                <dd>{reviewCue(activeEvent)}</dd>
              </div>
            </dl>

            <div className="focusMap" aria-label="Focus landing map">
              {['Start', 'Command', 'Panel', 'Inspector'].map((step, index) => (
                <span className={index <= activeIndex ? 'reached' : ''} key={step}>
                  {step}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function reviewCue(event: FocusEvent) {
  if (event.result === 'landed') return 'Keep this route as a reference pass.';
  if (event.result === 'skipped') return 'Check tab order and missing focusable controls.';
  if (event.result === 'looped') return 'Confirm the escape path and reverse tab order.';
  return 'Look for disabled controls or trapped modal focus.';
}
