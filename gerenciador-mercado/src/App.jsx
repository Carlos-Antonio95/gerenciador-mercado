import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import './styles.css';

const LS_KEY = 'produtos_v1';
const sample = [
  {id:1,nome:'Sabonete de Lavanda',categoria:'Sabonetes',estoque:12,preco:19.9,descricao:'Suave e relaxante.'},
  {id:2,nome:'Óleo de Eucalipto',categoria:'Óleos',estoque:8,preco:29.9,descricao:'Puro e aromático.'},
  {id:3,nome:'Kit Bem-estar',categoria:'Kits',estoque:5,preco:59.9,descricao:'Sabonete + óleo + caixa presente.'}
];

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if(!raw){ localStorage.setItem(LS_KEY, JSON.stringify(sample)); setProdutos(sample); }
    else { try { setProdutos(JSON.parse(raw)); } catch { setProdutos(sample); } }
  }, []);

  const saveProdutos = (list) => {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    setProdutos(list);
  }

  const handleSave = (prod) => {
    let updated;
    if(prod.id){
      updated = produtos.map(p => p.id===prod.id ? prod : p);
    } else {
      const id = produtos.length ? Math.max(...produtos.map(p=>p.id))+1 : 1;
      updated = [...produtos, {...prod, id}];
    }
    saveProdutos(updated);
    setModalOpen(false);
  }

  const handleDelete = (id) => {
    if(!window.confirm('Excluir esse produto?')) return;
    saveProdutos(produtos.filter(p=>p.id!==id));
  }

  const handleEdit = (p) => { setEditing(p); setModalOpen(true); }
  const handleNew = () => { setEditing(null); setModalOpen(true); }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Topbar onNew={handleNew} />
        <ProductTable 
          produtos={produtos} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          q={q} setQ={setQ} filter={filter} setFilter={setFilter} 
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
