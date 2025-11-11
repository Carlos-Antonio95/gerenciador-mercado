# 📦 Gerenciador de Mercado - Documentação Completa

## 🎯 Visão Geral

**Gerenciador de Mercado** é uma aplicação web 100% HTML puro para gerenciar produtos, vendas e relatórios de uma loja. Desenvolvida sem dependências externas, funciona completamente offline usando localStorage do navegador.

---

## 🏗️ Arquitetura do Projeto

```
gerenciador-mercado/
├── index-puro.html          # Arquivo HTML principal (estrutura semântica)
├── styles-puro.css          # Estilos CSS (design system com variáveis)
├── script-puro.js           # Lógica JavaScript (state management)
└── DOCUMENTACAO.md          # Este arquivo
```

### **Princípios de Design:**
- ✅ **HTML Semântico** - Uso de tags `<article>`, `<section>`, `<header>`, `<footer>`
- ✅ **CSS Modular** - Variáveis CSS, flexbox, grid layout
- ✅ **JavaScript Vanilla** - Zero dependências, Estado único centralizado
- ✅ **Mobile-First** - Design responsivo com media queries
- ✅ **Offline-First** - LocalStorage para persistência de dados

---

## 🎨 Funcionalidades Principais

### 1. **Tela Inicial (Home)**
- Cards com ações rápidas
- Acesso direto para "Vender produtos" e "Cadastrar novo produto"
- Layout centralizado e responsivo

### 2. **Gerenciamento de Produtos**
- ✅ **Listar produtos** em grid layout (3 colunas desktop, 1 mobile)
- ✅ **Pesquisar** produtos por nome ou descrição
- ✅ **Filtrar** por categoria (Sabonetes, Óleos, Kits, Presentes)
- ✅ **Criar novo** produto com modal
- ✅ **Editar** produto existente
- ✅ **Deletar** produto com confirmação
- ✅ **Exportar** como JSON

**Campos de Produto:**
```javascript
{
  id: number,           // ID único auto-gerado
  nome: string,         // Nome do produto
  categoria: string,    // Categoria (select)
  preco: number,        // Preço em R$
  estoque: number,      // Quantidade em estoque
  descricao: string     // Descrição (justificada nos cards)
}
```

### 3. **Registro de Vendas**
- ✅ **Modal de venda** com quantidade
- ✅ **Validação** de estoque disponível
- ✅ **Atualização automática** do estoque
- ✅ **Log de vendas** com data e hora
- ✅ **Exportação CSV** de relatório de vendas

**Dados de Venda:**
```javascript
{
  productId: number,
  nome: string,
  quantidade: number,
  preco: number,
  total: number,
  date: ISO8601 timestamp
}
```

### 4. **Relatórios**
- ✅ **Relatório de Vendas** - CSV com histórico completo
- ✅ **Relatório de Novos Produtos** - Produtos recém-adicionados
- ✅ **Limpar históricos** com confirmação
- ✅ **Contagem** de registros em tempo real

### 5. **Personalização de Temas**
- ✅ **Cor de fundo** da página
- ✅ **Cores do Sidebar** (gradiente inicial e final)
- ✅ **Pré-visualização** em tempo real
- ✅ **Salvar temas** no localStorage
- ✅ **Restaurar padrões** customizável

**Temas Salvos:**
```javascript
{
  pageBg: "#f4f6fb",           // Cor fundo página
  sidebarStart: "#118ca1",     // Gradiente topo
  sidebarEnd: "#212c1d"        // Gradiente base
}
```

---

## 🛠️ Stack Técnico

### **Frontend**
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **HTML5** | - | Estrutura semântica |
| **CSS3** | - | Estilos, Grid, Flexbox |
| **JavaScript ES6+** | - | Lógica da aplicação |

### **Armazenamento**
| API | Descrição |
|-----|-----------|
| **LocalStorage** | Persistência de dados no navegador |
| **JSON** | Formato de dados |

### **Recursos Nativos do Navegador**
| Recurso | Uso |
|--------|-----|
| **Blob** | Criar arquivos para download |
| **URL.createObjectURL** | Gerar links de download |
| **localStorage** | Persistência local |
| **Document Object Model (DOM)** | Manipulação de elementos |
| **Event Listeners** | Interatividade |

---

## 💾 Estrutura de Dados

### **Estado Global (State)**
```javascript
let state = {
  produtos: [],              // Array de produtos
  vendas: [],                // Histórico de vendas
  novos: [],                 // Produtos recém-criados
  currentView: 'home',       // View atual (home, sell, report, settings)
  editingProduct: null,      // Produto sendo editado
  sellingProduct: null,      // Produto sendo vendido
  searchQuery: '',           // Query de busca
  filterCategory: ''         // Filtro por categoria
}
```

### **LocalStorage Keys**
```javascript
'produtos_v1'     // Array de produtos
'vendas_v1'       // Array de vendas
'novos_v1'        // Array de novos produtos
'app_theme_v1'    // Objeto de tema
```

---

## 🎯 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICAÇÃO                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  HTML (View) │ ◄─────► │  JavaScript  │                  │
│  │              │         │  (State)     │                  │
│  └──────────────┘         └──────────────┘                  │
│         ▲                        │                           │
│         │                        │                           │
│    Renderiza                Manipula                        │
│         │                        │                           │
│         │                        ▼                           │
│         │                 ┌──────────────┐                  │
│         │                 │ LocalStorage │                  │
│         │                 │ (Persistência)│                 │
│         │                 └──────────────┘                  │
│         │                                                    │
│    ┌────┴────────────────┐                                  │
│    │    CSS (Estilo)     │                                  │
│    │   - Variáveis       │                                  │
│    │   - Grid Layout     │                                  │
│    │   - Flexbox         │                                  │
│    └─────────────────────┘                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Principais Funções JavaScript

### **Inicialização**
```javascript
loadData()           // Carrega dados do localStorage
setupEventListeners() // Configura listeners
applyTheme()        // Aplica tema salvo
switchView()        // Troca de aba
```

### **Gerenciamento de Produtos**
```javascript
renderProducts()    // Renderiza grid de cards
openProductModal()  // Abre modal de criação
editProduct(id)     // Modo edição
saveProduct()       // Salva no localStorage
deleteProduct(id)   // Deleta produto
```

### **Vendas**
```javascript
openSellModal()     // Abre modal de venda
confirmSell()       // Registra venda e atualiza estoque
```

### **Relatórios**
```javascript
exportSalesCSV()         // Exporta vendas em CSV
exportNewProductsCSV()   // Exporta novos produtos em CSV
clearSales()            // Limpa histórico de vendas
clearNewProducts()      // Limpa histórico de produtos
```

### **Tema**
```javascript
saveTheme()        // Salva tema no localStorage
resetTheme()       // Restaura padrão
updatePreview()    // Atualiza pré-visualização
applyTheme()       // Aplica tema ao DOM
```

### **Utilitários**
```javascript
escapeHtml()       // Sanitiza strings
arrayToCSV()       // Converte array para CSV
downloadFile()     // Faz download de arquivo
```

---

## 🎨 Sistema de Cores (CSS Variables)

```css
:root {
  --bg: #f4f6fb;              /* Fundo página */
  --card: #fff;               /* Fundo cards */
  --accent: #2a72b4;          /* Cor principal */
  --muted: #6b7280;           /* Cor texto desabilitado */
  --radius: 10px;             /* Border-radius */
  --sidebar-start: #118ca1;   /* Gradiente sidebar */
  --sidebar-end: #212c1d;     /* Gradiente sidebar */
}
```

---

## 📐 Layout e Componentes

### **Estrutura Principal**
- **Sidebar** - Navegação fixa (240px)
- **Main** - Área principal com flex layout
- **Topbar** - Navegação e ações (botões contextuais)
- **Content Area** - Diferentes views (home, sell, report, settings)

### **Componentes CSS**
| Classe | Descrição |
|--------|-----------|
| `.layout` | Container principal (fixed 100vh) |
| `.sidebar` | Menu lateral com gradiente |
| `.panel` | Card principal com shadow |
| `.product-card` | Card de produto com grid |
| `.home-cards` | Grid dos cards iniciais |
| `.modal-backdrop` | Overlay escuro para modais |
| `.btn` | Botão primário |
| `.btn.ghost` | Botão secundário/outline |

### **Grid Responsivo**
```css
/* Desktop (3 colunas) */
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))

/* Tablet/Mobile (1 coluna) */
@media (max-width: 880px) {
  grid-template-columns: 1fr
}
```

---

## 🔐 Segurança e Validações

### **Sanitização**
- ✅ `escapeHtml()` para prevenir XSS
- ✅ Validação de entrada em formulários

### **Confirmações**
- ✅ Exclusão de produtos requer confirmação
- ✅ Limpeza de históricos requer confirmação

### **Validação de Dados**
```javascript
// Exemplo: Salvar produto
if (!nome.trim()) {
  alert('Nome é obrigatório')
  return
}

const preco = parseFloat(document.getElementById('modal-preco').value) || 0
const estoque = parseInt(document.getElementById('modal-estoque').value) || 0
```

---

## 📱 Responsividade

### **Breakpoints**
- **Desktop**: > 880px (Sidebar visível, Grid 3 colunas)
- **Tablet/Mobile**: ≤ 880px (Sidebar escondido, Grid 1 coluna)

### **Ajustes**
```css
@media (max-width: 880px) {
  .sidebar { display: none; }
  .layout { flex-direction: column; }
  .products-grid { grid-template-columns: 1fr; }
  .home-cards { flex-direction: column; }
  .settings-grid { flex-direction: column; }
}
```

---

## 🚀 Performance e Otimizações

### **LocalStorage**
- ✅ Dados salvos automaticamente
- ✅ Sem chamadas HTTP
- ✅ Funciona 100% offline
- ✅ Limite: ~5-10MB por domínio

### **DOM**
- ✅ Renderização eficiente com `innerHTML`
- ✅ Mínimo de reflows
- ✅ Event delegation para botões dinâmicos

### **CSS**
- ✅ Variáveis CSS para temas dinâmicos
- ✅ Grid e Flexbox (GPU accelerated)
- ✅ Transições CSS suaves
- ✅ Media queries otimizadas

---

## 📊 Dados de Exemplo

### **Produto Padrão**
```javascript
{
  id: 1,
  nome: 'Sabonete de Lavanda',
  categoria: 'Sabonetes',
  estoque: 12,
  preco: 19.9,
  descricao: 'Suave e relaxante.'
}
```

### **Venda Registrada**
```javascript
{
  productId: 1,
  nome: 'Sabonete de Lavanda',
  quantidade: 2,
  preco: 19.9,
  total: 39.8,
  date: '2025-11-11T10:30:00.000Z'
}
```

---

## 🔄 Ciclo de Vida da Aplicação

```
1. DOMContentLoaded
   ├─ loadData()          → Carrega localStorage
   ├─ setupEventListeners() → Configura eventos
   ├─ applyTheme()        → Aplica tema salvo
   └─ switchView('home')  → Renderiza primeira view

2. Usuário interage
   ├─ Click evento
   ├─ Função executada
   ├─ State atualizado
   ├─ localStorage.setItem()
   └─ DOM re-renderizado

3. Navegação entre views
   ├─ switchView()
   ├─ Atualiza nav.active
   ├─ Alterna visibilidade
   ├─ Atualiza breadcrumbs
   └─ Renderiza conteúdo
```

---

## 💡 Exemplos de Uso

### **Adicionar Produto**
```javascript
// 1. Usuário clica em "+ Novo Produto"
// 2. openProductModal() é chamado
// 3. Modal se abre
// 4. Usuário preenche formulário
// 5. Clica "Salvar produto"
// 6. saveProduct() é executado
// 7. Novo produto é adicionado ao state.produtos
// 8. localStorage é atualizado
// 9. Grid é re-renderizado
```

### **Registrar Venda**
```javascript
// 1. Usuário clica em "💰 Vender" em um card
// 2. openSellModal(productId) é chamado
// 3. Modal de venda se abre
// 4. Usuário digita quantidade
// 5. Clica "Registrar venda"
// 6. confirmSell() valida e executa
// 7. Estoque é decrementado
// 8. Venda é registrada em state.vendas
// 9. localStorage é atualizado
// 10. Grid é re-renderizado
```

---

## 📈 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Linhas HTML** | ~250 |
| **Linhas CSS** | ~650 |
| **Linhas JavaScript** | ~500 |
| **Tamanho Total** | ~35KB (não minificado) |
| **Dependências Externas** | 0 |
| **Compatibilidade** | IE11+ |

---

## 🔮 Funcionalidades Futuros (Roadmap)

- [ ] **Backup/Restore** - Download e upload de dados
- [ ] **Código de barras** - QR Code para produtos
- [ ] **Multi-usuário** - Sincronização com servidor
- [ ] **Dashboards** - Gráficos e estatísticas
- [ ] **Agendamento** - Alarmes para estoque baixo
- [ ] **Múltiplas lojas** - Suporte a múltiplos negócios
- [ ] **API REST** - Integração com sistemas externos
- [ ] **PWA** - Instalar como aplicativo

---

## 🐛 Troubleshooting

### **Dados não estão sendo salvos**
- Verificar se localStorage está habilitado no navegador
- Verificar console do navegador (F12)

### **Estilo não carregando**
- Verificar se `styles-puro.css` está no mesmo diretório
- Limpar cache do navegador (Ctrl+Shift+Delete)

### **Funcionalidades não funcionando**
- Verificar se `script-puro.js` está carregando
- Abrir console (F12) para ver erros
- Verificar compatibilidade do navegador

---

## 📝 Notas Importantes

- ✅ **Sem servidor necessário** - Funciona 100% offline
- ✅ **Sem banco de dados** - Usa localStorage
- ✅ **Sem dependências** - HTML, CSS e JS puros
- ✅ **Portável** - Abra em qualquer navegador
- ✅ **Responsivo** - Funciona em todos os dispositivos
- ✅ **Tema dinâmico** - Personalize cores em tempo real

---

## 📄 Licença

Este projeto foi desenvolvido como um gerenciador de mercado funcional e educacional. Livre para usar e modificar.

---

**Última atualização:** 11 de novembro de 2025  
**Versão:** 1.0.0 (HTML Puro)

