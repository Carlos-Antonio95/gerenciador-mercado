import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import Home from "./components/Home";
import Report from "./components/Report";
import SellModal from "./components/SellModal";
import Settings from "./components/Settings";
import './styles.css';

const LS_KEY = 'produtos_v1';
const LS_VENDAS = 'vendas_v1';
const LS_NOVOS = 'novos_v1';
const sample = [
  {id:1,nome:'Sabonete de Lavanda',categoria:'Sabonetes',estoque:12,preco:19.9,descricao:'Suave e relaxante.'},
  {id:2,nome:'Óleo de Eucalipto',categoria:'Óleos',estoque:8,preco:29.9,descricao:'Puro e aromático.'},
  {id:3,nome:'Kit Bem-estar',categoria:'Kits',estoque:5,preco:59.9,descricao:'Sabonete + óleo + caixa presente.'}
];

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState('home'); // 'home' | 'sell'
  const [vendas, setVendas] = useState([]);
  const [novos, setNovos] = useState([]);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [sellingProduct, setSellingProduct] = useState(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if(!raw){ localStorage.setItem(LS_KEY, JSON.stringify(sample)); setProdutos(sample); }
    else { try { setProdutos(JSON.parse(raw)); } catch { setProdutos(sample); } }
    // carregar logs de vendas e novos
    try { const v = JSON.parse(localStorage.getItem(LS_VENDAS) || '[]'); setVendas(v); } catch { setVendas([]); }
    try { const n = JSON.parse(localStorage.getItem(LS_NOVOS) || '[]'); setNovos(n); } catch { setNovos([]); }
    // aplicar tema salvo (se houver)
    try {
      const theme = JSON.parse(localStorage.getItem('app_theme_v1') || 'null');
      if(theme){
        if(theme.pageBg) document.documentElement.style.setProperty('--bg', theme.pageBg);
        if(theme.sidebarStart) document.documentElement.style.setProperty('--sidebar-start', theme.sidebarStart);
        if(theme.sidebarEnd) document.documentElement.style.setProperty('--sidebar-end', theme.sidebarEnd);
      }
    } catch {}
  }, []);

  const saveProdutos = (list) => {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    setProdutos(list);
  }

  const saveVendas = (list) => { localStorage.setItem(LS_VENDAS, JSON.stringify(list)); setVendas(list); }
  const saveNovos = (list) => { localStorage.setItem(LS_NOVOS, JSON.stringify(list)); setNovos(list); }

  const handleSave = (prod) => {
    let updated;
    if(prod.id){
      updated = produtos.map(p => p.id===prod.id ? prod : p);
      saveProdutos(updated);
    } else {
      const id = produtos.length ? Math.max(...produtos.map(p=>p.id))+1 : 1;
      const newProd = {...prod, id};
      updated = [...produtos, newProd];
      saveProdutos(updated);
      // registrar produto novo
      try { saveNovos([...novos, { ...newProd, createdAt: new Date().toISOString() }]); } catch { /* ignore */ }
    }
    setModalOpen(false);
  }

  const handleDelete = (id) => {
    if(!window.confirm('Excluir esse produto?')) return;
    saveProdutos(produtos.filter(p=>p.id!==id));
  }

  const handleEdit = (p) => { setEditing(p); setModalOpen(true); }
  const handleNew = () => { setEditing(null); setModalOpen(true); }

  const handleSell = () => { setView('sell'); }

  const handleBackHome = () => { setView('home'); }

  const handleSellProduct = (product, quantidade) => {
    const qtd = Number(quantidade) || 0;
    if(qtd <= 0) return;
    const p = produtos.find(x => x.id === product.id);
    if(!p) return alert('Produto não encontrado');
    if(p.estoque < qtd) return alert('Estoque insuficiente');
    const updated = produtos.map(x => x.id === p.id ? { ...x, estoque: x.estoque - qtd } : x);
    saveProdutos(updated);
    const venda = { productId: p.id, nome: p.nome, quantidade: qtd, preco: p.preco, total: Number((p.preco * qtd).toFixed(2)), date: new Date().toISOString() };
    saveVendas([...vendas, venda]);
    alert(`Venda registrada: ${qtd} x ${p.nome}`);
    // fechar modal se estiver aberto
    setSellModalOpen(false);
    setSellingProduct(null);
  }

  return (
    <div className="layout">
      <Sidebar onNavigate={(dest) => {
        if(dest === 'sell') handleSell();
        else if(dest === 'home') handleBackHome();
        else if(dest === 'report') setView('report');
        else if(dest === 'settings') setView('settings');
        else {
          // destinos não implementados: apenas volta para home por enquanto
          handleBackHome();
        }
      }} />
      <main className="main">
  <Topbar onNew={handleNew} view={view} onBack={view !== 'home' ? handleBackHome : undefined} />

        {view === 'home' ? (
          <Home onSell={handleSell} onAdd={handleNew} />
        ) : view === 'sell' ? (
          <ProductTable 
            produtos={produtos} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onOpenSell={(p) => { setSellingProduct(p); setSellModalOpen(true); }}
            q={q} setQ={setQ} filter={filter} setFilter={setFilter} 
          />
        ) : view === 'report' ? (
          <Report 
            vendas={vendas} 
            novos={novos}
            onClearVendas={() => { if(!confirm('Limpar todas as vendas?')) return; saveVendas([]); }}
            onClearNovos={() => { if(!confirm('Limpar produtos novos?')) return; saveNovos([]); }}
          />
        ) : view === 'settings' ? (
          <Settings />
        ) : null}
        <SellModal 
          isOpen={sellModalOpen} 
          onClose={() => { setSellModalOpen(false); setSellingProduct(null); }} 
          product={sellingProduct}
          onConfirm={(prod, qtd) => handleSellProduct(prod, qtd)}
        />
        <footer style={{marginTop:12,color:'var(--muted)',fontSize:13}}>
          Dados salvos localmente no navegador (localStorage).
        </footer>
      </main>
      <ProductModal 
        isOpen={modalOpen} 
        onClose={()=>setModalOpen(false)} 
        onSave={handleSave} 
        product={editing} 
      />
    </div>
  )
}
