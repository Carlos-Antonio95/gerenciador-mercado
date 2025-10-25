export default function ProductTable({ produtos, onEdit, onDelete, q, setQ, filter, setFilter }) {

  const filtered = produtos.filter(p => {
    const matchQ = !q || p.nome.toLowerCase().includes(q.toLowerCase()) || (p.descricao||'').toLowerCase().includes(q.toLowerCase());
    const matchF = !filter || p.categoria === filter;
    return matchQ && matchF;
  });

  const exportJson = () => {
    const data = JSON.stringify(produtos, null, 2);
    const blob = new Blob([data], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='produtos.json'; a.click();
    URL.revokeObjectURL(url);
  }

  const escapeHtml = s => String(s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  return (
    <section className="panel" aria-labelledby="prod-list">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <strong id="prod-list">Lista de produtos</strong>
        <small style={{color:'var(--muted)'}}>Itens: {produtos.length}</small>
      </div>

      <div className="controls">
        <div className="search">
          <input type="text" placeholder="Pesquisar por nome ou descrição..." value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="">Filtrar por categoria</option>
          <option>Sabonetes</option>
          <option>Óleos</option>
          <option>Kits</option>
        </select>
        <button className="btn ghost" onClick={exportJson}>Exportar JSON</button>
      </div>

      <div style={{overflow:'auto'}}>
        <table aria-describedby="prod-list">
          <thead>
            <tr><th>Nome</th><th>Categoria</th><th>Estoque</th><th>Preço</th><th>Descrição</th><th style={{width:150}}>Ações</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>{escapeHtml(p.nome)}</td>
                <td>{escapeHtml(p.categoria)}</td>
                <td>{p.estoque}</td>
                <td className="price">R$ {Number(p.preco).toFixed(2)}</td>
                <td>{escapeHtml(p.descricao||'')}</td>
                <td className="actions-cell">
                  <button className="btn ghost" style={{padding:'6px 8px'}} onClick={()=>onEdit(p)}>Editar</button>
                  <button className="btn" style={{padding:'6px 8px', background:'#ef4444'}} onClick={()=>onDelete(p.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
