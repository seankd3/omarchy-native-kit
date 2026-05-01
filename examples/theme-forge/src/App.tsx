const swatches = [
  { token: 'background', variable: '--omarchy-background', value: '#101216', role: 'Window' },
  { token: 'foreground', variable: '--omarchy-foreground', value: '#e7eaf0', role: 'Text' },
  { token: 'surface', variable: '--omarchy-surface', value: '#151820', role: 'Panel' },
  { token: 'raised', variable: '--omarchy-surface-raised', value: '#414868', role: 'Hover' },
  { token: 'accent', variable: '--omarchy-accent', value: '#7aa2f7', role: 'Action' },
  { token: 'success', variable: '--omarchy-success', value: '#9ece6a', role: 'Good' },
  { token: 'warning', variable: '--omarchy-warning', value: '#e0af68', role: 'Risk' },
  { token: 'danger', variable: '--omarchy-danger', value: '#f7768e', role: 'Error' },
  { token: 'info', variable: '--omarchy-info', value: '#7dcfff', role: 'Note' }
];

const exports = ['CSS variables', 'Agent JSON', 'Blueprint', 'Verifier report'];

export function App() {
  return (
    <main className="forgeShell">
      <aside className="toolRail" aria-label="Theme tools">
        {['Inspect', 'Contrast', 'Export', 'Verify'].map((tool, index) => (
          <button className={index === 0 ? 'tool active' : 'tool'} key={tool} type="button" title={tool}>
            {tool.slice(0, 1)}
          </button>
        ))}
      </aside>

      <section className="canvas">
        <header className="mast">
          <div>
            <p className="eyebrow">omarchy.theme</p>
            <h1>Theme Forge</h1>
          </div>
          <button className="primary" type="button">
            Export CSS
          </button>
        </header>

        <div className="swatchGrid" aria-label="Semantic theme tokens">
          {swatches.map((swatch) => (
            <button className="swatchCard" key={swatch.token} type="button">
              <span className="sample" style={{ background: `var(${swatch.variable})` }} />
              <strong>{swatch.token}</strong>
              <small>{swatch.variable}</small>
              <em>{swatch.role}</em>
            </button>
          ))}
        </div>
      </section>

      <aside className="properties" aria-label="Selected token properties">
        <div className="panelHeader">
          <h2>Selected</h2>
          <span>accent</span>
        </div>
        <div className="previewBlock">
          <span className="previewSwatch" />
          <div>
            <strong>--omarchy-accent</strong>
            <small>#7aa2f7</small>
          </div>
        </div>
        <div className="propertyList">
          <label>
            Role
            <input value="Primary action and focus" readOnly />
          </label>
          <label>
            Foreground
            <input value="--omarchy-accent-foreground" readOnly />
          </label>
        </div>
        <div className="exportStack">
          {exports.map((item) => (
            <button className="exportButton" key={item} type="button">
              {item}
            </button>
          ))}
        </div>
      </aside>
    </main>
  );
}
