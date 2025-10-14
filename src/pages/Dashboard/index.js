// src/pages/Dashboard/index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import Button from '../../componentes/common/Button';
import './style.css';

// Dados de exemplo
const MOCK_CATEGORIES = [
    { name: 'Alimentação', value: 'R$ 550,00' },
    { name: 'Transporte', value: 'R$ 150,00' },
    { name: 'Lazer', value: 'R$ 200,00' },
    { name: 'Moradia', value: 'R$ 1.200,00' },
];

const MOCK_EXPENSES = [
    { date: '12/10', category: 'Almoço', value: 'R$ 45,00' },
    { date: '11/10', category: 'Uber', value: 'R$ 25,00' },
    { date: '10/10', category: 'Cinema', value: 'R$ 60,00' },
    { date: '09/10', category: 'Supermercado', value: 'R$ 230,00' },
];

// 1. O componente agora aceita a prop 'balance'
const Dashboard = ({ balance }) => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <button onClick={() => navigate(-1)} className="back-button">
                &#x2190;
            </button>

            <div className="dashboard-container">
                {/* Metade Esquerda */}
                <div className="dashboard-left">
                    <h1 className="dashboard-title">Dashboard</h1>
                </div>

                {/* Metade Direita */}
                <div className="dashboard-right">
                    <Card>
                        <div className="balance-card">
                            {/* 2. Estrutura corrigida para alinhar o título e o botão */}
                            <div className="card-header">
                                <h3 className="card-title">Saldo Atual</h3>
                                <button onClick={() => navigate('/edit-balance')} className="edit-button">
                                    ✎
                                </button>
                            </div>
                            {/* 3. Saldo dinâmico e formatado */}
                            <p className="balance-value">
                                {(balance || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </Card>

                    <Card>
                        <div className="card-header">
                            <h3 className="card-title">Categorias</h3>
                            <select className="filter-select">
                                <option>Mês</option>
                                <option>Dia</option>
                                <option>Ano</option>
                            </select>
                        </div>
                        <ul className="list">
                            {MOCK_CATEGORIES.map((cat, index) => (
                                <li key={index} className="list-item">
                                    <span>{cat.name}</span>
                                    <span>{cat.value}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card>
                        <div className="card-header">
                            <h3 className="card-title">Últimas Despesas</h3>
                            <button onClick={() => navigate('/add-expense')} className="add-button">
                                +
                            </button>
                        </div>
                        <ul className="list">
                            {MOCK_EXPENSES.map((exp, index) => (
                                <li key={index} className="list-item">
                                    <span>{exp.date} - {exp.category}</span>
                                    <span className="expense-value">{exp.value}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <div className="reports-button-container">
                        <Button variant="primary" onClick={() => navigate('/reports')}>
                            Relatórios
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;