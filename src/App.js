// src/App.js
import React, { useState } from 'react'; // 1. Importar o useState
import AppRoutes from './routes';
import './assets/styles/global.css';

function App() {
  // 2. Criar o estado do saldo aqui, no componente principal
  const [balance, setBalance] = useState(2540.75); // Valor inicial

  return (
    // 3. Passar o saldo (balance) e a função para atualizá-lo (setBalance) para as rotas
    <AppRoutes balance={balance} setBalance={setBalance} />
  );
}

export default App;