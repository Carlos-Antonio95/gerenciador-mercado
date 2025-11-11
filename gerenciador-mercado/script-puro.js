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

    // Inicialização por página: se o elemento existir, roda a função relacionada
    if (document.getElementById('products-container')) {
        renderProducts();
    }
    if (document.getElementById('sales-count')) {
        updateReportCounts();
    }
    if (document.getElementById('color-page-bg')) {
        loadSettings();
    }
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
    // Navigation links: only attach SPA behavior if data-view exists (backwards compatible)
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset && link.dataset.view) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchView(link.dataset.view);
            });
        }
    });

    // Topbar buttons (só se existirem)
    const btnBack = document.getElementById('btn-back');
    if (btnBack) btnBack.addEventListener('click', () => switchView('home'));
    const btnNew = document.getElementById('btn-new-product');
    if (btnNew) btnNew.addEventListener('click', openProductModal);

    // Search and filter (produtos)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderProducts();
        });
    }
    const filterCategory = document.getElementById('filter-category');
    if (filterCategory) {
        filterCategory.addEventListener('change', (e) => {
            state.filterCategory = e.target.value;
            renderProducts();
        });
    }

    // Settings color inputs (só se existirem)
    const colorPageBg = document.getElementById('color-page-bg');
    if (colorPageBg) colorPageBg.addEventListener('change', (e) => updatePreview('page-bg', e.target.value));
    const colorSidebarStart = document.getElementById('color-sidebar-start');
    if (colorSidebarStart) colorSidebarStart.addEventListener('change', (e) => updatePreview('sidebar-start', e.target.value));
    const colorSidebarEnd = document.getElementById('color-sidebar-end');
    if (colorSidebarEnd) colorSidebarEnd.addEventListener('change', (e) => updatePreview('sidebar-end', e.target.value));

    // Modal backdrop clicks (só se existirem)
    const productModal = document.getElementById('product-modal');
    if (productModal) productModal.addEventListener('click', (e) => { if (e.target === e.currentTarget) closeProductModal(); });
    const sellModal = document.getElementById('sell-modal');
    if (sellModal) sellModal.addEventListener('click', (e) => { if (e.target === e.currentTarget) closeSellModal(); });
}

// Switch view
function switchView(view) {
    state.currentView = view;
    // Update nav active state (safe)
    document.querySelectorAll('.nav-link').forEach(link => {
        try {
            link.classList.toggle('active', link.dataset && link.dataset.view === view);
        } catch (e) {
            // ignore
        }
    });

    // Update content visibility (if SPA is still used)
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
    const breadcrumbsEl = document.getElementById('breadcrumbs');
    if (breadcrumbsEl) breadcrumbsEl.textContent = breadcrumbText[view] || 'Tela Inicial';

    // Update topbar buttons safely
    const btnBack = document.getElementById('btn-back');
    const btnNew = document.getElementById('btn-new-product');
    if (btnBack) btnBack.style.display = view !== 'home' ? 'block' : 'none';
    if (btnNew) btnNew.style.display = view === 'sell' ? 'block' : 'none';

    // Update content
    if (view === 'sell') {
        if (document.getElementById('products-container')) renderProducts();
    } else if (view === 'report') {
        if (document.getElementById('sales-count')) updateReportCounts();
    } else if (view === 'settings') {
        if (document.getElementById('color-page-bg')) loadSettings();
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
    if (!container) return;
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

    const productCountEl = document.getElementById('product-count');
    if (productCountEl) productCountEl.textContent = state.produtos.length;
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
    if (document.getElementById('products-container')) renderProducts();
}

function deleteProduct(id) {
    if (!confirm('Excluir esse produto?')) return;
    state.produtos = state.produtos.filter(p => p.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(state.produtos));
    if (document.getElementById('products-container')) renderProducts();
}

// Sell operations
function openSellModal(productId) {
    const product = state.produtos.find(p => p.id === productId);
    if (!product) return;
    state.sellingProduct = product;
    const sellName = document.getElementById('sell-product-name'); if (sellName) sellName.textContent = product.nome;
    const sellEst = document.getElementById('sell-estoque'); if (sellEst) sellEst.textContent = product.estoque;
    const sellQty = document.getElementById('sell-quantidade'); if (sellQty) sellQty.value = '';
    const sellModal = document.getElementById('sell-modal'); if (sellModal) sellModal.classList.remove('hidden');
}

function closeSellModal() {
    const sellModal = document.getElementById('sell-modal'); if (sellModal) sellModal.classList.add('hidden');
}

function confirmSell() {
    const sellQtyEl = document.getElementById('sell-quantidade');
    const quantidade = sellQtyEl ? (parseInt(sellQtyEl.value) || 0) : 0;
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
    if (document.getElementById('products-container')) renderProducts();
    if (document.getElementById('sales-count')) updateReportCounts();
}

// Report operations
function updateReportCounts() {
    const salesEl = document.getElementById('sales-count'); if (salesEl) salesEl.textContent = state.vendas.length;
    const novosEl = document.getElementById('new-products-count'); if (novosEl) novosEl.textContent = state.novos.length;
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
        const pageBg = document.getElementById('color-page-bg'); if (pageBg) pageBg.value = theme.pageBg || '#f4f6fb';
        const sideStart = document.getElementById('color-sidebar-start'); if (sideStart) sideStart.value = theme.sidebarStart || '#118ca1';
        const sideEnd = document.getElementById('color-sidebar-end'); if (sideEnd) sideEnd.value = theme.sidebarEnd || '#212c1d';
    }
}

function updatePreview(type, value) {
    if (type === 'page-bg') {
        const cp = document.getElementById('color-page-bg'); if (cp) cp.value = value;
        const sw = document.getElementById('swatch-page-bg'); if (sw) sw.style.background = value;
        const lb = document.getElementById('label-page-bg'); if (lb) lb.textContent = value;
        const preview = document.getElementById('preview-content'); if (preview) preview.style.background = value;
    } else if (type === 'sidebar-start') {
        const cs = document.getElementById('color-sidebar-start'); if (cs) cs.value = value;
        const sws = document.getElementById('swatch-sidebar-start'); if (sws) sws.style.background = value;
        const lbs = document.getElementById('label-sidebar-start'); if (lbs) lbs.textContent = value;
        updateSidebarPreview();
    } else if (type === 'sidebar-end') {
        const ce = document.getElementById('color-sidebar-end'); if (ce) ce.value = value;
        const swse = document.getElementById('swatch-sidebar-end'); if (swse) swse.style.background = value;
        const lbse = document.getElementById('label-sidebar-end'); if (lbse) lbse.textContent = value;
        updateSidebarPreview();
    }
}

function updateSidebarPreview() {
    const startEl = document.getElementById('color-sidebar-start');
    const endEl = document.getElementById('color-sidebar-end');
    const preview = document.getElementById('preview-sidebar');
    const start = startEl ? startEl.value : null;
    const end = endEl ? endEl.value : null;
    if (preview && start && end) preview.style.background = `linear-gradient(180deg, ${start}, ${end})`;
}

function saveTheme() {
    const theme = {
        pageBg: (document.getElementById('color-page-bg') || {}).value,
        sidebarStart: (document.getElementById('color-sidebar-start') || {}).value,
        sidebarEnd: (document.getElementById('color-sidebar-end') || {}).value
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
    const pg = document.getElementById('color-page-bg'); if (pg) pg.value = defaults.pageBg;
    const ss = document.getElementById('color-sidebar-start'); if (ss) ss.value = defaults.sidebarStart;
    const se = document.getElementById('color-sidebar-end'); if (se) se.value = defaults.sidebarEnd;
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
