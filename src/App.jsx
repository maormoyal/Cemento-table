import cementoLogo from './assets/cemento-logo.png';
import './App.css';
import Table from './components/table/Table';

function App() {
  return (
    <>
      <div className='page-header'>
        <a href='https://www.cemento.ai/' target='blank'>
          <img src={cementoLogo} className='logo' alt='Vite logo' />
        </a>
        <h1>Cemento - Customers Table</h1>
      </div>

      <div>
        <Table />
      </div>
    </>
  );
}

export default App;
