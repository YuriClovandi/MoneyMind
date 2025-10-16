// src/pages/Dashboard/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import Button from '../../componentes/common/Button';
import api from '../../services/api';
import './style.css';

// 1. O componente agora aceita a prop 'balance'
const Dashboard = ({ balance }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('current_month');
    const [filteredExpenses, setFilteredExpenses] = useState([]);

    // Verificar se está logado e carregar dados
    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            if (!token) {
                navigate('/');
                return;
            }
            
            if (userData) {
                setUser(JSON.parse(userData));
            }

            // Carregar despesas do usuário
            try {
                setLoading(true);
                const response = await api.get('/expenses');
                
                if (response.data.success) {
                    setExpenses(response.data.data || []);
                    console.log('Despesas carregadas:', response.data.data);
                } else {
                    console.error('Erro ao carregar despesas:', response.data.message);
                }
            } catch (error) {
                console.error('Erro ao carregar despesas:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    // Função para recarregar despesas
    const loadExpenses = async () => {
        try {
            const response = await api.get('/expenses');
            if (response.data.success) {
                setExpenses(response.data.data || []);
                console.log('Despesas recarregadas:', response.data.data);
            }
        } catch (error) {
            console.error('Erro ao recarregar despesas:', error);
        }
    };

    // Recarregar despesas quando necessário
    useEffect(() => {
        const handleFocus = () => {
            loadExpenses();
        };

        const handleExpenseAdded = () => {
            loadExpenses();
        };

        // Recarregar quando a página recebe foco ou quando uma despesa é adicionada
        window.addEventListener('focus', handleFocus);
        window.addEventListener('expenseAdded', handleExpenseAdded);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('expenseAdded', handleExpenseAdded);
        };
    }, []);

    // Função para calcular gastos por categoria
    const calculateCategories = (expensesList) => {
        const categoryTotals = {};
        
        expensesList.forEach(expense => {
            const category = expense.category || 'Outros';
            const amount = parseFloat(expense.amount) || 0;
            
            if (categoryTotals[category]) {
                categoryTotals[category] += amount;
            } else {
                categoryTotals[category] = amount;
            }
        });

        return Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value: `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        }));
    };

    // Função para filtrar despesas por período
    const filterExpensesByPeriod = (expensesList, filter) => {
        const now = new Date();
        const filtered = [];

        expensesList.forEach(expense => {
            const expenseDate = new Date(expense.date);
            let include = false;

            switch (filter) {
                case 'today':
                    include = expenseDate.toDateString() === now.toDateString();
                    break;
                case 'current_week':
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    startOfWeek.setHours(0, 0, 0, 0);
                    include = expenseDate >= startOfWeek;
                    break;
                case 'current_month':
                    include = expenseDate.getMonth() === now.getMonth() && 
                             expenseDate.getFullYear() === now.getFullYear();
                    break;
                case 'current_year':
                    include = expenseDate.getFullYear() === now.getFullYear();
                    break;
                default:
                    include = true;
            }

            if (include) {
                filtered.push(expense);
            }
        });

        return filtered;
    };

    // Atualizar despesas filtradas e categorias quando mudar o filtro ou despesas
    useEffect(() => {
        const filtered = filterExpensesByPeriod(expenses, filterType);
        setFilteredExpenses(filtered);
        setCategories(calculateCategories(filtered));
    }, [expenses, filterType]);

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
                                    Editar
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
                            <select 
                                className="filter-select"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="today">Hoje</option>
                                <option value="current_week">Esta Semana</option>
                                <option value="current_month">Este Mês</option>
                                <option value="current_year">Este Ano</option>
                            </select>
                        </div>
                        <ul className="list">
                            {categories.length === 0 ? (
                                <li className="list-item">
                                    <span>Nenhuma despesa neste período</span>
                                </li>
                            ) : (
                                categories.map((cat, index) => (
                                    <li key={index} className="list-item">
                                        <span>{cat.name}</span>
                                        <span>{cat.value}</span>
                                    </li>
                                ))
                            )}
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
                            {loading ? (
                                <li className="list-item">
                                    <span>Carregando despesas...</span>
                                </li>
                            ) : filteredExpenses.length === 0 ? (
                                <li className="list-item">
                                    <span>Nenhuma despesa encontrada neste período</span>
                                </li>
                            ) : (
                                filteredExpenses.slice(0, 5).map((expense) => (
                                    <li key={expense.id} className="list-item">
                                        <span>
                                            {new Date(expense.date).toLocaleDateString('pt-BR')} - {expense.description}
                                        </span>
                                        <span className="expense-value">
                                            R$ {parseFloat(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </li>
                                ))
                            )}
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