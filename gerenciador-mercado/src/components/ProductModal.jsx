import { useState, useEffect } from "react";

export default function ProductModal({ isOpen, onClose, onSave, product }) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Sabonetes');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if(product){
      setNome(product.nome || '');
      setCategoria(product.categoria || 'Sabonetes');
      setPreco(product.preco || '');
      setEstoque(product.estoque || '');
      setDescricao(product.descricao || '');
    } else {
      setNome(''); setCategoria('Sabonetes'); setPreco(''); setEstoque(''); setDescricao('');
    }
  }, [product]);

  if(!isOpen) return null;

  const handleSave = () => {
    if(!nome.trim()){ alert('Nome é obrigatório'); return; }
    onSave({ id: product?.id, nome, categoria, preco: parseFloat(preco)||0, estoque: parseInt(estoque)||0, descricao });
  }

  return (
    <div className="modal-backdrop" onClick={e=>{ if(e.target===e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Formulário produto">
        <h3>{product ? 'Editar produto' : 'Novo produto'}</h3>

        <div className="form-row">
          <div className="col">
            <label>Nome</label>
            <input type="text" value={nome} onChange={e=>setNome(e.target.value)} />
          </div>
          <div className="col">
            <label>Categoria</label>
            <select value={categoria} onChange={e=>setCategoria(e.target.value)}>
              <option>Sabonetes</option>
              <option>Óleos</option>
              <option>Kits</option>
              <option>Presentes</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="col">
            <label>Preço (R$)</label>
            <input type="number" min="0" step="0.01" value={preco} onChange={e=>setPreco(e.target.value)} />
          </div>
          <div className="col">
            <label>Estoque</label>
            <input type="number" min="0" step="1" value={estoque} onChange={e=>setEstoque(e.target.value)} />
          </div>
        </div>

        <div>
          <label>Descrição</label>
          <textarea value={descricao} onChange={e=>setDescricao(e.target.value)} />
        </div>

        <div className="modal-footer">
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn" onClick={handleSave}>Salvar produto</button>
        </div>
      </div>
    </div>
  )
}
