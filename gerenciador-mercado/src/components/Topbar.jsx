export default function Topbar({ onNew, view = 'home', onBack }) {
  const breadcrumbs = view === 'home' ? 'Tela Inicial' : (view === 'sell' ? 'Tela Inicial / Produtos' : 'Tela Inicial');
  const heading = view === 'home' ? 'Painel' : (view === 'sell' ? 'Gerenciar Produtos' : 'Gerenciar Produtos');

  return (
    <div className="topbar">
      <div>
        <div className="breadcrumbs">{breadcrumbs}</div>
        <h2 style={{ margin: '6px 0 0' }}>{heading}</h2>
      </div>
      <div className="actions">
        {onBack && view !== 'home' && view !== 'settings' && view !== 'report' ? (
          <button className="btn ghost" onClick={onBack} style={{ marginRight: 8 }}>Voltar</button>
        ) : null}
        {view !== 'home' && view !== 'settings' && view !== 'report' ? (
          <button className="btn" onClick={onNew}>+ Novo produto</button>
        ) : null}
      </div>
    </div>
  )
}
