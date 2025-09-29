import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './style.css';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Adicionar lógica de logout (limpar token, etc)
    console.log("Usuário deslogado");
    navigate('/');
  };

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-content">
          <h1 className="logo">MoneyMind</h1>
          <nav>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/add-expense">Adicionar Despesa</NavLink>
            <NavLink to="/reports">Relatórios</NavLink>
            <button onClick={handleLogout} className="logout-button">Sair</button>
          </nav>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;