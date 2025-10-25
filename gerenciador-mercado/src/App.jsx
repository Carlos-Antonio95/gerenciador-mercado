//componente pai
import './App.css'
import './index.css'
import FunctionalComponent from './components/FunctionalComponent.jsx'
function App() {

  return (
    <>
  <>
  <div className="layout">
    <aside className="menu-lateral">
      <h2>Menu</h2>
      <nav>
        <ul><a href="#">Home</a></ul>
        <ul><a href="#">Produtos</a></ul>
        <ul><a href="#">Contato</a></ul>
      </nav>
    </aside>

    <main className="conteudo">
      <h1>Hello world React</h1>
    </main>
  </div>
</>

    </>
  )
}

export default App
