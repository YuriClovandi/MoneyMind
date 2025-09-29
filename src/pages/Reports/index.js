import React from 'react';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import './style.css';

const ReportsPage = () => {
    // Dados de exemplo para o resumo
    const summaryData = {
        totalGasto: 880.00,
        totalGanho: 3500.00,
        saldoFinal: 2620.00
    };

    return (
        <MainLayout>
            <div className="page-title">
                <h2>Relatório Mensal</h2>
            </div>
            <div className="reports-grid">
                <Card>
                    <h3 className="card-title">Evolução do Saldo</h3>
                    <div className="chart-placeholder">
                        <p>(Aqui entrará o gráfico de barras)</p>
                    </div>
                </Card>
                <Card>
                    <h3 className="card-title">Resumo (Mês Atual)</h3>
                    <table className="summary-table">
                        <tbody>
                            <tr>
                                <td>Total Ganho</td>
                                <td className="value gain">R$ {summaryData.totalGanho.toFixed(2).replace('.', ',')}</td>
                            </tr>
                            <tr>
                                <td>Total Gasto</td>
                                <td className="value expense">R$ {summaryData.totalGasto.toFixed(2).replace('.', ',')}</td>
                            </tr>
                            <tr>
                                <td>Saldo Final</td>
                                <td className="value final-balance">R$ {summaryData.saldoFinal.toFixed(2).replace('.', ',')}</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </div>
        </MainLayout>
    );
};

export default ReportsPage;