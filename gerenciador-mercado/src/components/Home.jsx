export default function Home({ onSell, onAdd }) {
  return (
    <section className="panel" aria-labelledby="home-title">
      <h2 id="home-title">Bem-vindo ao Gerenciador</h2>
      <p style={{ color: 'var(--muted)' }}>Escolha uma ação abaixo para começar:</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        <div
          className="card-hover hover-transition"
          style={{ flex: 1, minWidth: 240, padding: 18, cursor: 'pointer' }}
          onClick={onSell}
        >
          <h3 style={{ marginTop: 0 }}>Vender produtos</h3>
          <p style={{ color: 'var(--muted)' }}>Acesse a lista de produtos para registrar vendas e gerenciar estoque.</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={e => { e.stopPropagation(); onSell(); }}>Ir para vendas</button>
          </div>
        </div>

        <div
          className="card-hover hover-transition"
          style={{ flex: 1, minWidth: 240, padding: 18, cursor: 'pointer' }}
          onClick={onAdd}
        >
          <h3 style={{ marginTop: 0 }}>Cadastrar novo produto</h3>
          <p style={{ color: 'var(--muted)' }}>Abra o formulário para adicionar um produto ao catálogo.</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={e => { e.stopPropagation(); onAdd(); }}>Cadastrar</button>
          </div>
        </div>
      </div>
    </section>
  )
}
