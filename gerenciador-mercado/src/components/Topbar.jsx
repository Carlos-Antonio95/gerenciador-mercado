export default function Topbar({ onNew }) {
  return (
    <div className="topbar">
      <div>
        <div className="breadcrumbs">Tela Inicial / Produtos</div>
        <h2 style={{margin:'6px 0 0'}}>Gerenciar Produtos</h2>
      </div>
      <div className="actions">
        <button className="btn" onClick={onNew}>+ Novo produto</button>
      </div>
    </div>
  )
}
