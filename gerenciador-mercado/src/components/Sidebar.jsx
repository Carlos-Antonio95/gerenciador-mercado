export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Menu">
      <div className="brand">
        <div className="logo">MS</div>
        <div>
          <div style={{fontWeight:700}}>Mercado Simples</div>
          <div className="small">Painel administrativo</div>
        </div>
      </div>
      <nav className="nav" aria-label="Navegação principal">
        <a href="#" className="active">Tela Inicial</a>
        <a href="#">Produtos</a>
        <a href="#">Pedidos</a>
        <a href="#">Clientes</a>
        <a href="#">Configurações</a>
      </nav>
      <div style={{marginTop:'auto', fontSize:'13px', opacity:.95}}>Usuário: admin@lojacaiana</div>
    </aside>
  )
}
