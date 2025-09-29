import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import './style.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [saldo] = useState(2500.00);
  const [ultimasDespesas] = useState([
    { id: 1, data: 'Hoje', descricao: 'Supermercado', valor: 100.50 },
    { id: 2, data: '14/Fevereiro', descricao: 'Restaurante', valor: 80.50 },
    { id: 3, data: '20/Janeiro', descricao: 'Farmácia', valor: 60.50 },
  ]);
  const [categorias] = useState([
    { id: 1, nome: 'Supermercado', valor: 120.50 },
    { id: 2, nome: 'Restaurantes', valor: 150.50 },
  ]);

  return (
    <MainLayout>
      <div className="page-title">
        <h2>Dashboard</h2>
      </div>
      <div className="dashboard-grid">
        <Card className="saldo-card">
          <h3 className="card-title">Saldo Atual</h3>
          <p className="saldo-valor">R$ {saldo.toFixed(2).replace('.', ',')}</p>
        </Card>
        
        <Card>
          <div className="card-header">
            <h3 className="card-title">Categorias</h3>
            <select className="period-select" defaultValue="mes">
              <option value="mes">Mês</option>
              <option value="ano">Ano</option>
            </select>
          </div>
          <ul className="dashboard-list">
            {categorias.map(cat => (
              <li key={cat.id}>
                <span>{cat.nome}</span>
                <strong>R$ {cat.valor.toFixed(2).replace('.', ',')}</strong>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="card-header">
            <h3 className="card-title">Últimas Despesas</h3>
            <button 
              className="add-button" 
              onClick={() => navigate('/add-expense')}
              title="Adicionar nova despesa"
            >+</button>
          </div>
          <ul className="dashboard-list">
            {ultimasDespesas.map(d => (
              <li key={d.id}>
                <span>{d.data} - {d.descricao}</span>
                <strong>R$ {d.valor.toFixed(2).replace('.', ',')}</strong>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;