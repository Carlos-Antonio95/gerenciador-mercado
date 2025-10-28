import { useState, useEffect } from "react";

export default function SellModal({ isOpen, onClose, product, onConfirm }) {
  const [qtd, setQtd] = useState(1);

  useEffect(() => {
    if(product) setQtd(1);
  }, [product]);

  if(!isOpen || !product) return null;

  const handleConfirm = () => {
    const n = parseInt(qtd, 10);
    if(Number.isNaN(n) || n <= 0){ alert('Quantidade inválida'); return; }
    if(product.estoque < n){ alert('Estoque insuficiente'); return; }
    onConfirm(product, n);
  }

  return (
    <div className="modal-backdrop" onClick={e=>{ if(e.target===e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Vender produto">
        <h3>Vender: {product.nome}</h3>

        <div className="form-row">
          <div className="col">
            <label>Quantidade (estoque: {product.estoque})</label>
            <input type="number" min="1" step="1" value={qtd} onChange={e=>setQtd(e.target.value)} />
          </div>
          <div className="col">
            <label>Preço unitário</label>
            <input type="text" value={`R$ ${Number(product.preco).toFixed(2)}`} readOnly />
          </div>
        </div>

        <div style={{marginTop:8}}>
          <label>Subtotal</label>
          <div style={{fontWeight:700}}>R$ {(Number(product.preco) * (Number(qtd)||0)).toFixed(2)}</div>
        </div>

        <div className="modal-footer">
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn" onClick={handleConfirm}>Confirmar venda</button>
        </div>
      </div>
    </div>
  )
}
