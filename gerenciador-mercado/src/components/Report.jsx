import React from 'react';

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function arrayToCSV(items, columns) {
  const header = columns.map(c => c.label).join(',');
  const rows = items.map(item => columns.map(c => {
    const v = typeof c.key === 'function' ? c.key(item) : (item[c.key] ?? '');
    const cell = String(v).replace(/"/g, '""');
    return `"${cell}"`;
  }).join(','));
  return [header, ...rows].join('\n');
}

export default function Report({ vendas = [], novos = [], onClearVendas = () => {}, onClearNovos = () => {} }) {
  const exportVendas = () => {
    if(!vendas.length) return alert('Nenhuma venda registrada');
    const cols = [
      { label: 'ID Produto', key: 'productId' },
      { label: 'Nome', key: 'nome' },
      { label: 'Quantidade', key: 'quantidade' },
      { label: 'Preço unitário', key: 'preco' },
      { label: 'Total', key: 'total' },
      { label: 'Data', key: 'date' }
    ];
    const csv = arrayToCSV(vendas, cols);
    download('vendas.csv', csv);
  }

  const exportNovos = () => {
    if(!novos.length) return alert('Nenhum produto novo registrado');
    const cols = [
      { label: 'ID', key: 'id' },
      { label: 'Nome', key: 'nome' },
      { label: 'Categoria', key: 'categoria' },
      { label: 'Preço', key: 'preco' },
      { label: 'Estoque', key: 'estoque' },
      { label: 'Descrição', key: 'descricao' },
      { label: 'Criado em', key: 'createdAt' }
    ];
    const csv = arrayToCSV(novos, cols);
    download('produtos_novos.csv', csv);
  }

  return (
    <section className="panel" aria-labelledby="report-title">
      <h2 id="report-title">Relatório</h2>
      <p style={{ color: 'var(--muted)' }}>Exportar registros de vendas e produtos adicionados.</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 400, padding: 10 }} className="card-hover hover-transition">
          <h3 style={{ marginTop: 0 }}>Produtos Vendidos</h3>
          <p style={{ color: 'var(--muted)' }}>Registros: {vendas.length}</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={exportVendas}>Exportar CSV (vendas)</button>
            <button className="btn ghost" onClick={onClearVendas} style={{ marginLeft: 8 }}>Limpar</button>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }} className="card-hover hover-transition">
          <h3 style={{ marginTop: 0 }}>Produtos Cadastrados</h3>
          <p style={{ color: 'var(--muted)' }}>Registros: {novos.length}</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={exportNovos}>Exportar CSV (produtos novos)</button>
            <button className="btn ghost" onClick={onClearNovos} style={{ marginLeft: 8 }}>Limpar</button>
          </div>
        </div>
      </div>
    </section>
  )
}
