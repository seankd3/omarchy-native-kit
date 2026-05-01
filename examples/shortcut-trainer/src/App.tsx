import { useMemo, useState } from 'react';

type Shortcut = {
  keys: string;
  label: string;
  context: string;
  check: string;
  status: 'Ready' | 'Focus' | 'Theme' | 'Habit';
};

const shortcuts: Shortcut[] = [
  {
    keys: 'Super Space',
    label: 'Open launcher',
    context: 'Start commands without leaving the keyboard.',
    check: 'Focus returns to the active surface after launch.',
    status: 'Ready'
  },
  {
    keys: 'Super Enter',
    label: 'Open terminal',
    context: 'Drop into a shell on the current workspace.',
    check: 'Terminal receives focus immediately.',
    status: 'Focus'
  },
  {
    keys: 'Super Shift R',
    label: 'Reload theme',
    context: 'Refresh generated Omarchy tokens after editing colors.',
    check: 'Visible colors update without hard-coded fallback values.',
    status: 'Theme'
  },
  {
    keys: 'Super H',
    label: 'Move left',
    context: 'Practice workspace movement with a directional mnemonic.',
    check: 'The active window stays visually obvious after the move.',
    status: 'Habit'
  },
  {
    keys: 'Super Shift Q',
    label: 'Close window',
    context: 'Use a deliberate chord for destructive window actions.',
    check: 'The next focus target is predictable.',
    status: 'Focus'
  }
];

const statusClass: Record<Shortcut['status'], string> = {
  Ready: 'ready',
  Focus: 'focus',
  Theme: 'theme',
  Habit: 'habit'
};

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [attempt, setAttempt] = useState('');
  const activeShortcut = shortcuts[activeIndex];
  const isMatch = normalize(attempt) === normalize(activeShortcut.keys);
  const completedCount = useMemo(
    () => shortcuts.filter((shortcut) => normalize(attempt) === normalize(shortcut.keys)).length,
    [attempt]
  );

  return (
    <main className="shell">
      <section className="workspace" aria-label="Shortcut trainer">
        <div className="topbar">
          <span className="app-id">shortcut.trainer</span>
          <span className="state">{isMatch ? 'matched' : 'practice'}</span>
        </div>

        <section className="practice" aria-labelledby="practice-title">
          <div>
            <p className="eyebrow">Command rehearsal</p>
            <h1 id="practice-title">Train the chord, then check the focus.</h1>
          </div>

          <div className="meter" aria-label={`${completedCount} matching shortcuts`}>
            <strong>{completedCount}</strong>
            <span>exact match</span>
          </div>
        </section>

        <div className="trainerGrid">
          <div className="commandMenu" role="list" aria-label="Practice shortcuts">
            {shortcuts.map((shortcut, index) => (
              <button
                className={`command ${index === activeIndex ? 'selected' : ''}`}
                key={shortcut.keys}
                onClick={() => {
                  setActiveIndex(index);
                  setAttempt('');
                }}
                type="button"
              >
                <kbd>{shortcut.keys}</kbd>
                <span>{shortcut.label}</span>
                <small className={statusClass[shortcut.status]}>{shortcut.status}</small>
              </button>
            ))}
          </div>

          <aside className="inspector" aria-label="Active shortcut check">
            <div className="keyPreview">
              <kbd>{activeShortcut.keys}</kbd>
              <span>{activeShortcut.label}</span>
            </div>

            <label htmlFor="attempt">Type the shortcut chord</label>
            <input
              autoComplete="off"
              id="attempt"
              onChange={(event) => setAttempt(event.target.value)}
              placeholder="Super Space"
              spellCheck={false}
              value={attempt}
            />

            <div className={`result ${isMatch ? 'pass' : 'pending'}`} role="status">
              {isMatch ? 'Chord matches the active drill.' : 'Waiting for an exact chord match.'}
            </div>

            <dl>
              <div>
                <dt>Context</dt>
                <dd>{activeShortcut.context}</dd>
              </div>
              <div>
                <dt>Focus check</dt>
                <dd>{activeShortcut.check}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}
