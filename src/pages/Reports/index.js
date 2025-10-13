// src/pages/Reports/index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import Button from '../../componentes/common/Button'; // Importe o botão
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import './style.css';

// ... (o restante do código, como os dados do gráfico, permanece o mesmo) ...
const chartData = [
  { name: 'Comida', gasto: 400 },
  { name: 'Transporte', gasto: 150 },
  { name: 'Lazer', gasto: 300 },
  { name: 'Moradia', gasto: 1200 },
  { name: 'Saúde', gasto: 200 },
];


const Reports = () => {
    const navigate = useNavigate();

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
                            <div className="summary-item">
                                <span className="summary-label">Total Gasto no Mês</span>
                                <span className="summary-value total">R$ 2.250,00</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Média Diária</span>
                                <span className="summary-value">R$ 75,00</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Categoria com Maior Gasto</span>
                                <span className="summary-value">Moradia</span>
                            </div>
                             <div className="summary-item">
                                <span className="summary-label">Total de Transações</span>
                                <span className="summary-value">42</span>
                            </div>
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