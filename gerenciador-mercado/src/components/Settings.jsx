import { useState, useEffect } from 'react';

const THEME_KEY = 'app_theme_v1';

export default function Settings() {
  const [pageBg, setPageBg] = useState('');
  const [sidebarStart, setSidebarStart] = useState('');
  const [sidebarEnd, setSidebarEnd] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(THEME_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setPageBg(parsed.pageBg || getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
        setSidebarStart(parsed.sidebarStart || getComputedStyle(document.documentElement).getPropertyValue('--sidebar-start').trim());
        setSidebarEnd(parsed.sidebarEnd || getComputedStyle(document.documentElement).getPropertyValue('--sidebar-end').trim());
        applyTheme(parsed);
      } else {
        // read current css vars
        setPageBg(getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#f4f6fb');
        setSidebarStart(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-start').trim() || '#118ca1');
        setSidebarEnd(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-end').trim() || '#212c1d');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function applyTheme({ pageBg: p, sidebarStart: s1, sidebarEnd: s2 } = {}) {
    if (p) document.documentElement.style.setProperty('--bg', p);
    if (s1) document.documentElement.style.setProperty('--sidebar-start', s1);
    if (s2) document.documentElement.style.setProperty('--sidebar-end', s2);
  }

  // handlers que aplicam tema imediatamente para preview
  const handlePageBgChange = (value) => {
    setPageBg(value);
    applyTheme({ pageBg: value, sidebarStart, sidebarEnd });
  }

  const handleSidebarStartChange = (value) => {
    setSidebarStart(value);
    applyTheme({ pageBg, sidebarStart: value, sidebarEnd });
  }

  const handleSidebarEndChange = (value) => {
    setSidebarEnd(value);
    applyTheme({ pageBg, sidebarStart, sidebarEnd: value });
  }

  function saveTheme() {
    const obj = { pageBg, sidebarStart, sidebarEnd };
    localStorage.setItem(THEME_KEY, JSON.stringify(obj));
    applyTheme(obj);
    alert('Configurações salvas');
  }

  function resetTheme() {
    const defaults = { pageBg: '#f4f6fb', sidebarStart: '#118ca1', sidebarEnd: '#212c1d' };
    setPageBg(defaults.pageBg);
    setSidebarStart(defaults.sidebarStart);
    setSidebarEnd(defaults.sidebarEnd);
    localStorage.removeItem(THEME_KEY);
    applyTheme(defaults);
  }

  return (
    <section className="panel" aria-labelledby="settings-title">
      <h2 id="settings-title">Configurações</h2>
      <p style={{ color: 'var(--muted)' }}>Personalize as cores do sistema.</p>

      <div className="settings-grid" style={{ marginTop: 16 }}>
        <div className="settings-controls">
          <div className="form-row">
            <div className="col">
              <label>Cor de fundo da página</label>
              <div className="color-row">
                <input className="color-input" type="color" value={pageBg} onChange={e => handlePageBgChange(e.target.value)} />
                <div className="swatch" style={{ background: pageBg }} aria-hidden />
                <div className="swatch-label">{pageBg}</div>
              </div>
            </div>
            <div className="col">
              <label>Cor inicial do Sidebar</label>
              <div className="color-row">
                <input className="color-input" type="color" value={sidebarStart} onChange={e => handleSidebarStartChange(e.target.value)} />
                <div className="swatch" style={{ background: sidebarStart }} aria-hidden />
                <div className="swatch-label">{sidebarStart}</div>
              </div>
            </div>
            <div className="col">
              <label>Cor final do Sidebar</label>
              <div className="color-row">
                <input className="color-input" type="color" value={sidebarEnd} onChange={e => handleSidebarEndChange(e.target.value)} />
                <div className="swatch" style={{ background: sidebarEnd }} aria-hidden />
                <div className="swatch-label">{sidebarEnd}</div>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: 18 }}>
            <button className="btn ghost" onClick={resetTheme}>Restaurar padrão</button>
            <button className="btn" onClick={saveTheme}>Salvar</button>
          </div>
        </div>

        <aside className="settings-preview" aria-hidden>
          <div className="preview-sidebar" style={{ background: `linear-gradient(180deg, ${sidebarStart}, ${sidebarEnd})` }}>
            <div className="preview-logo">MS</div>
            <nav className="preview-nav">
              <div className="preview-item active">Tela Inicial</div>
              <div className="preview-item">Produtos</div>
              <div className="preview-item">Relatório</div>
            </nav>
          </div>
          <div className="preview-content" style={{ background: pageBg }}>
            <div style={{ padding: 18 }}>
              <h3 style={{ margin: 0 }}>Pré-visualização</h3>
              <p style={{ color: 'var(--muted)' }}>Veja como suas escolhas afetam a interface.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
