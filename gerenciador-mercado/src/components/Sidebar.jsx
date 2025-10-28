export default function Sidebar({ onNavigate = () => {} }) {
  const handle = (e, dest) => { e.preventDefault(); onNavigate(dest); };

  return (
    <aside className="sidebar" aria-label="Menu">
      <div className="brand">
        <div className="logo">MS</div>
        <div>
          <div style={{ fontWeight: 700 }}>Mercado Simples</div>
          <div className="small">Painel Administrativo</div>
        </div>
      </div>
      <nav className="nav" aria-label="Navegação principal">
        <a href="#" onClick={e => handle(e, 'home')}>Tela Inicial</a>
        <a href="#" onClick={e => handle(e, 'sell')}>Produtos</a>
        <a href="#" onClick={e => handle(e, 'report')}>Relatório</a>
        <a href="#" onClick={e => handle(e, 'settings')}>Configurações</a>
      </nav>
    </aside>
  )
}
