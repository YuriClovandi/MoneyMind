// src/pages/Reports/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import Button from '../../componentes/common/Button';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import './style.css';

const Reports = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [summary, setSummary] = useState({
        totalGasto: 0,
        mediaDiaria: 0,
        categoriaMaiorGasto: '-',
        totalTransacoes: 0
    });

    // Carregar dados quando o componente monta
    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);
                const response = await api.get('/expenses');
                
                if (response.data.success) {
                    const expensesData = response.data.data || [];
                    setExpenses(expensesData);
                    
                    // Calcular dados do gráfico por categoria
                    const categoryTotals = {};
                    expensesData.forEach(expense => {
                        const category = expense.category || 'Outros';
                        const amount = parseFloat(expense.amount) || 0;
                        
                        if (categoryTotals[category]) {
                            categoryTotals[category] += amount;
                        } else {
                            categoryTotals[category] = amount;
                        }
                    });

                    const chartDataFormatted = Object.entries(categoryTotals).map(([name, gasto]) => ({
                        name,
                        gasto: Math.round(gasto)
                    }));

                    setChartData(chartDataFormatted);

                    // Calcular resumo
                    const totalGasto = expensesData.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
                    const totalTransacoes = expensesData.length;
                    
                    // Calcular média diária do mês atual
                    const now = new Date();
                    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                    const currentDay = now.getDate();
                    const mediaDiaria = currentDay > 0 ? totalGasto / currentDay : 0;

                    // Encontrar categoria com maior gasto
                    const categoriaMaiorGasto = Object.entries(categoryTotals).reduce((max, [name, amount]) => 
                        amount > (categoryTotals[max] || 0) ? name : max, '-'
                    );

                    setSummary({
                        totalGasto,
                        mediaDiaria,
                        categoriaMaiorGasto,
                        totalTransacoes
                    });

                }
            } catch (error) {
                console.error('Erro ao carregar relatórios:', error);
            } finally {
                setLoading(false);
            }
        };

        // Verificar autenticação
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        loadReports();
    }, [navigate]);

    return (
        <MainLayout>
            <button onClick={() => navigate(-1)} className="back-button">
                &#x2190;
            </button>
            <div className="reports-container">
                <h1 className="reports-title">Relatório Mensal</h1>

                <div className="reports-content">
                    {/* ... (Os dois cards continuam aqui) ... */}
                    <Card>
                        <h3 className="card-title">Despesas por Categoria</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="gasto" fill="#00bf63" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card>
                         <h3 className="card-title">Resumo dos Gastos</h3>
                         <div className="summary-container">
                            {loading ? (
                                <div className="summary-item">
                                    <span className="summary-label">Carregando dados...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="summary-item">
                                        <span className="summary-label">Total Gasto no Mês</span>
                                        <span className="summary-value total">
                                            R$ {summary.totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Média Diária</span>
                                        <span className="summary-value">
                                            R$ {summary.mediaDiaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Categoria com Maior Gasto</span>
                                        <span className="summary-value">{summary.categoriaMaiorGasto}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Total de Transações</span>
                                        <span className="summary-value">{summary.totalTransacoes}</span>
                                    </div>
                                </>
                            )}
                         </div>
                    </Card>
                </div>

                {/* BOTÃO ADICIONADO AQUI */}
                <div className="export-button-container">
                    <Button variant="primary" onClick={() => navigate('/export-reports')}>
                        Exportar Relatórios
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
};

export default Reports;