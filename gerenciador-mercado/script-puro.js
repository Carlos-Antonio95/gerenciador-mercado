// Constants
const LS_KEY = 'produtos_v1';
const LS_VENDAS = 'vendas_v1';
const LS_NOVOS = 'novos_v1';
const THEME_KEY = 'app_theme_v1';

// Sample data
const SAMPLE_DATA = [
    { id: 1, nome: 'Sabonete de Lavanda', categoria: 'Sabonetes', estoque: 12, preco: 19.9, descricao: 'Suave e relaxante.' },
    { id: 2, nome: 'Óleo de Eucalipto', categoria: 'Óleos', estoque: 8, preco: 29.9, descricao: 'Puro e aromático.' },
    { id: 3, nome: 'Kit Bem-estar', categoria: 'Kits', estoque: 5, preco: 59.9, descricao: 'Sabonete + óleo + caixa presente.' }
];

// State
let state = {
    produtos: [],
    vendas: [],
    novos: [],
    currentView: 'home',
    editingProduct: null,
    sellingProduct: null,
    searchQuery: '',
    filterCategory: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    applyTheme();
    switchView('home');
});

// Load data from localStorage
function loadData() {
    const raw = localStorage.getItem(LS_KEY);
    state.produtos = raw ? JSON.parse(raw) : SAMPLE_DATA;
    if (!raw) localStorage.setItem(LS_KEY, JSON.stringify(SAMPLE_DATA));

    try {
        state.vendas = JSON.parse(localStorage.getItem(LS_VENDAS) || '[]');
    } catch {
        state.vendas = [];
    }

    try {
        state.novos = JSON.parse(localStorage.getItem(LS_NOVOS) || '[]');
    } catch {
        state.novos = [];
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(link.dataset.view);
        });
    });

    // Topbar buttons
    document.getElementById('btn-back').addEventListener('click', () => switchView('home'));
    document.getElementById('btn-new-product').addEventListener('click', openProductModal);

    // Search and filter
    document.getElementById('search-input').addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderProducts();
    });

    document.getElementById('filter-category').addEventListener('change', (e) => {
        state.filterCategory = e.target.value;
        renderProducts();
    });

    // Settings color inputs
    document.getElementById('color-page-bg').addEventListener('change', (e) => {
        updatePreview('page-bg', e.target.value);
    });
    document.getElementById('color-sidebar-start').addEventListener('change', (e) => {
        updatePreview('sidebar-start', e.target.value);
    });
    document.getElementById('color-sidebar-end').addEventListener('change', (e) => {
        updatePreview('sidebar-end', e.target.value);
    });

    // Modal backdrop clicks
    document.getElementById('product-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeProductModal();
    });
    document.getElementById('sell-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeSellModal();
    });
}

// Switch view
function switchView(view) {
    state.currentView = view;

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.view === view);
    });

    // Update content visibility
    document.querySelectorAll('.view-content').forEach(el => {
        el.style.display = el.id === `view-${view}` ? 'flex' : 'none';
    });

    // Update breadcrumbs
    const breadcrumbText = {
        home: 'Tela Inicial',
        sell: 'Produtos',
        report: 'Relatório',
        settings: 'Configurações'
    };
    document.getElementById('breadcrumbs').textContent = breadcrumbText[view] || 'Tela Inicial';

    // Update topbar buttons
    const btnBack = document.getElementById('btn-back');
    const btnNew = document.getElementById('btn-new-product');
    btnBack.style.display = view !== 'home' ? 'block' : 'none';
    btnNew.style.display = view === 'sell' ? 'block' : 'none';

    // Update content
    if (view === 'sell') {
        renderProducts();
    } else if (view === 'report') {
        updateReportCounts();
    } else if (view === 'settings') {
        loadSettings();
    }
}

// Render products table
function renderProducts() {
    const filtered = state.produtos.filter(p => {
        const matchQ = !state.searchQuery || 
                      p.nome.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                      (p.descricao || '').toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchF = !state.filterCategory || p.categoria === state.filterCategory;
        return matchQ && matchF;
    });

    const container = document.getElementById('products-container');
    container.innerHTML = filtered.map(p => `
        <article class="product-card">
            <div class="product-card-header">
                <div class="product-card-title">
                    <h3>${escapeHtml(p.nome)}</h3>
                    <span class="product-card-category">${escapeHtml(p.categoria)}</span>
                </div>
            </div>
            
            <p class="product-card-description">${escapeHtml(p.descricao || 'Sem descrição')}</p>
            
            <div class="product-card-meta">
                <div class="product-card-info">
                    <div class="product-card-info-item">
                        <span class="product-card-info-label">Estoque</span>
                        <span class="product-card-info-value">${p.estoque} un.</span>
                    </div>
                    <div class="product-card-info-item">
                        <span class="product-card-info-label">Preço</span>
                        <span class="product-card-info-value price">R$ ${Number(p.preco).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div class="product-card-actions">
                <button class="btn ghost" onclick="editProduct(${p.id})">✏️ Editar</button>
                <button class="btn ghost" style="background: #10b981; color: #fff;" onclick="openSellModal(${p.id})">
                    ${p.estoque > 0 ? '💰 Vender' : 'Sem estoque'}
                </button>
                <button class="btn" style="background: #ef4444;" onclick="deleteProduct(${p.id})">🗑️ Excluir</button>
            </div>
        </article>
    `).join('');

    document.getElementById('product-count').textContent = state.produtos.length;
}

// Product operations
function openProductModal() {
    state.editingProduct = null;
    document.getElementById('modal-title').textContent = 'Novo produto';
    document.getElementById('modal-nome').value = '';
    document.getElementById('modal-categoria').value = 'Sabonetes';
    document.getElementById('modal-preco').value = '';
    document.getElementById('modal-estoque').value = '';
    document.getElementById('modal-descricao').value = '';
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

function editProduct(id) {
    const product = state.produtos.find(p => p.id === id);
    if (!product) return;
    state.editingProduct = product;
    document.getElementById('modal-title').textContent = 'Editar produto';
    document.getElementById('modal-nome').value = product.nome;
    document.getElementById('modal-categoria').value = product.categoria;
    document.getElementById('modal-preco').value = product.preco;
    document.getElementById('modal-estoque').value = product.estoque;
    document.getElementById('modal-descricao').value = product.descricao || '';
    document.getElementById('product-modal').classList.remove('hidden');
}

function saveProduct() {
    const nome = document.getElementById('modal-nome').value.trim();
    const categoria = document.getElementById('modal-categoria').value;
    const preco = parseFloat(document.getElementById('modal-preco').value) || 0;
    const estoque = parseInt(document.getElementById('modal-estoque').value) || 0;
    const descricao = document.getElementById('modal-descricao').value;

    if (!nome) {
        alert('Nome é obrigatório');
        return;
    }

    const product = { nome, categoria, preco, estoque, descricao };

    if (state.editingProduct) {
        product.id = state.editingProduct.id;
        state.produtos = state.produtos.map(p => p.id === product.id ? product : p);
    } else {
        product.id = state.produtos.length ? Math.max(...state.produtos.map(p => p.id)) + 1 : 1;
        state.produtos.push(product);
        state.novos.push({ ...product, createdAt: new Date().toISOString() });
        localStorage.setItem(LS_NOVOS, JSON.stringify(state.novos));
    }

    localStorage.setItem(LS_KEY, JSON.stringify(state.produtos));
    closeProductModal();
    if (state.currentView === 'sell') renderProducts();
}

function deleteProduct(id) {
    if (!confirm('Excluir esse produto?')) return;
    state.produtos = state.produtos.filter(p => p.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(state.produtos));
    renderProducts();
}

// Sell operations
function openSellModal(productId) {
    const product = state.produtos.find(p => p.id === productId);
    if (!product) return;
    state.sellingProduct = product;
    document.getElementById('sell-product-name').textContent = product.nome;
    document.getElementById('sell-estoque').textContent = product.estoque;
    document.getElementById('sell-quantidade').value = '';
    document.getElementById('sell-modal').classList.remove('hidden');
}

function closeSellModal() {
    document.getElementById('sell-modal').classList.add('hidden');
}

function confirmSell() {
    const quantidade = parseInt(document.getElementById('sell-quantidade').value) || 0;
    if (quantidade <= 0) {
        alert('Quantidade deve ser maior que 0');
        return;
    }
    if (state.sellingProduct.estoque < quantidade) {
        alert('Estoque insuficiente');
        return;
    }

    const product = state.sellingProduct;
    product.estoque -= quantidade;
    state.produtos = state.produtos.map(p => p.id === product.id ? product : p);
    localStorage.setItem(LS_KEY, JSON.stringify(state.produtos));

    const venda = {
        productId: product.id,
        nome: product.nome,
        quantidade,
        preco: product.preco,
        total: Number((product.preco * quantidade).toFixed(2)),
        date: new Date().toISOString()
    };
    state.vendas.push(venda);
    localStorage.setItem(LS_VENDAS, JSON.stringify(state.vendas));

    alert(`Venda registrada: ${quantidade} x ${product.nome}`);
    closeSellModal();
    renderProducts();
    if (state.currentView === 'report') updateReportCounts();
}

// Report operations
function updateReportCounts() {
    document.getElementById('sales-count').textContent = state.vendas.length;
    document.getElementById('new-products-count').textContent = state.novos.length;
}

function exportSalesCSV() {
    if (!state.vendas.length) {
        alert('Nenhuma venda registrada');
        return;
    }
    const csv = arrayToCSV(state.vendas, [
        { label: 'ID Produto', key: 'productId' },
        { label: 'Nome', key: 'nome' },
        { label: 'Quantidade', key: 'quantidade' },
        { label: 'Preço unitário', key: 'preco' },
        { label: 'Total', key: 'total' },
        { label: 'Data', key: 'date' }
    ]);
    downloadFile('vendas.csv', csv);
}

function exportNewProductsCSV() {
    if (!state.novos.length) {
        alert('Nenhum produto novo registrado');
        return;
    }
    const csv = arrayToCSV(state.novos, [
        { label: 'ID', key: 'id' },
        { label: 'Nome', key: 'nome' },
        { label: 'Categoria', key: 'categoria' },
        { label: 'Preço', key: 'preco' },
        { label: 'Estoque', key: 'estoque' },
        { label: 'Descrição', key: 'descricao' },
        { label: 'Criado em', key: 'createdAt' }
    ]);
    downloadFile('produtos_novos.csv', csv);
}

function clearSales() {
    if (!confirm('Limpar todas as vendas?')) return;
    state.vendas = [];
    localStorage.setItem(LS_VENDAS, JSON.stringify(state.vendas));
    updateReportCounts();
}

function clearNewProducts() {
    if (!confirm('Limpar produtos novos?')) return;
    state.novos = [];
    localStorage.setItem(LS_NOVOS, JSON.stringify(state.novos));
    updateReportCounts();
}

function exportJSON() {
    const data = JSON.stringify(state.produtos, null, 2);
    downloadFile('produtos.json', data);
}

// Settings operations
function loadSettings() {
    const theme = JSON.parse(localStorage.getItem(THEME_KEY) || 'null');
    if (theme) {
        document.getElementById('color-page-bg').value = theme.pageBg || '#f4f6fb';
        document.getElementById('color-sidebar-start').value = theme.sidebarStart || '#118ca1';
        document.getElementById('color-sidebar-end').value = theme.sidebarEnd || '#212c1d';
    }
}

function updatePreview(type, value) {
    if (type === 'page-bg') {
        document.getElementById('color-page-bg').value = value;
        document.getElementById('swatch-page-bg').style.background = value;
        document.getElementById('label-page-bg').textContent = value;
        document.getElementById('preview-content').style.background = value;
    } else if (type === 'sidebar-start') {
        document.getElementById('color-sidebar-start').value = value;
        document.getElementById('swatch-sidebar-start').style.background = value;
        document.getElementById('label-sidebar-start').textContent = value;
        updateSidebarPreview();
    } else if (type === 'sidebar-end') {
        document.getElementById('color-sidebar-end').value = value;
        document.getElementById('swatch-sidebar-end').style.background = value;
        document.getElementById('label-sidebar-end').textContent = value;
        updateSidebarPreview();
    }
}

function updateSidebarPreview() {
    const start = document.getElementById('color-sidebar-start').value;
    const end = document.getElementById('color-sidebar-end').value;
    document.getElementById('preview-sidebar').style.background = `linear-gradient(180deg, ${start}, ${end})`;
}

function saveTheme() {
    const theme = {
        pageBg: document.getElementById('color-page-bg').value,
        sidebarStart: document.getElementById('color-sidebar-start').value,
        sidebarEnd: document.getElementById('color-sidebar-end').value
    };
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
    applyTheme();
    alert('Configurações salvas');
}

function resetTheme() {
    const defaults = {
        pageBg: '#f4f6fb',
        sidebarStart: '#118ca1',
        sidebarEnd: '#212c1d'
    };
    document.getElementById('color-page-bg').value = defaults.pageBg;
    document.getElementById('color-sidebar-start').value = defaults.sidebarStart;
    document.getElementById('color-sidebar-end').value = defaults.sidebarEnd;
    localStorage.removeItem(THEME_KEY);
    applyTheme();
}

function applyTheme() {
    const theme = JSON.parse(localStorage.getItem(THEME_KEY) || 'null');
    const pageBg = theme?.pageBg || '#f4f6fb';
    const sidebarStart = theme?.sidebarStart || '#118ca1';
    const sidebarEnd = theme?.sidebarEnd || '#212c1d';

    document.documentElement.style.setProperty('--bg', pageBg);
    document.documentElement.style.setProperty('--sidebar-start', sidebarStart);
    document.documentElement.style.setProperty('--sidebar-end', sidebarEnd);
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
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

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
