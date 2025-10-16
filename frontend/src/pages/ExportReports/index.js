// src/pages/ExportReports/index.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import Button from '../../componentes/common/Button';
import api from '../../services/api';
import './style.css';

const ExportReports = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastLoadedPeriod, setLastLoadedPeriod] = useState({ start: '', end: '' });

    // Verificar autenticação
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
    }, [navigate]);

    // Função para carregar despesas automaticamente quando as datas mudarem
    const loadExpensesForPeriod = useCallback(async (start, end) => {
        if (!start || !end) return;
        
        // Evitar múltiplas chamadas para o mesmo período
        if (lastLoadedPeriod.start === start && lastLoadedPeriod.end === end) {
            console.log('Período já carregado, pulando...');
            return;
        }
        
        try {
            console.log('Carregando despesas automaticamente de:', start, 'até', end);
            const response = await api.get(`/expenses?startDate=${start}&endDate=${end}`);
            
            if (response.data.success) {
                const expenses = response.data.data || [];
                setFilteredExpenses(expenses);
                setLastLoadedPeriod({ start, end });
                console.log('Despesas carregadas automaticamente:', expenses.length, 'encontradas');
            }
        } catch (error) {
            console.error('Erro ao carregar despesas automaticamente:', error);
        }
    }, [lastLoadedPeriod.start, lastLoadedPeriod.end]);

    // Definir datas padrão baseadas nos gastos do usuário
    useEffect(() => {
        const loadDefaultDates = async () => {
            try {
                // Buscar todas as despesas para encontrar a primeira e última data
                const response = await api.get('/expenses?limit=all');
                if (response.data.success && response.data.data && response.data.data.length > 0) {
                    const expenses = response.data.data;
                    console.log('Despesas encontradas para definir datas padrão:', expenses.length);
                    
                    // Encontrar a data mais antiga e mais recente
                    const dates = expenses.map(expense => new Date(expense.date));
                    const minDate = new Date(Math.min(...dates));
                    const maxDate = new Date(Math.max(...dates));
                    
                    // Usar o primeiro dia real onde houve gastos no mês (não o dia 1)
                    const actualFirstDate = minDate.toISOString().split('T')[0];
                    
                    // Usar o último dia real onde houve gastos
                    const actualLastDate = maxDate.toISOString().split('T')[0];
                    
                    console.log('Primeira data com gastos:', actualFirstDate);
                    console.log('Última data com gastos:', actualLastDate);
                    
                    setStartDate(actualFirstDate);
                    setEndDate(actualLastDate);
                    
                    // Carregar despesas automaticamente para o período definido
                    setTimeout(() => {
                        loadExpensesForPeriod(actualFirstDate, actualLastDate);
                    }, 100);
                } else {
                    // Se não houver despesas, usar o mês atual
                    const now = new Date();
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    
                    setStartDate(startOfMonth.toISOString().split('T')[0]);
                    setEndDate(endOfMonth.toISOString().split('T')[0]);
                }
            } catch (error) {
                console.error('Erro ao carregar datas padrão:', error);
                // Fallback para mês atual em caso de erro
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                
                setStartDate(startOfMonth.toISOString().split('T')[0]);
                setEndDate(endOfMonth.toISOString().split('T')[0]);
            }
        };

        loadDefaultDates();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Carregar despesas automaticamente quando as datas mudarem
    useEffect(() => {
        if (startDate && endDate) {
            loadExpensesForPeriod(startDate, endDate);
        }
    }, [startDate, endDate, loadExpensesForPeriod]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            alert('Por favor, selecione as datas de início e fim!');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('A data de início deve ser anterior à data de fim!');
            return;
        }

        try {
            setLoading(true);
            console.log('Gerando relatório para período:', startDate, 'até', endDate);
            
            // Recarregar as despesas para garantir que os dados estão atualizados
            const response = await api.get(`/expenses?startDate=${startDate}&endDate=${endDate}`);
            
            console.log('Resposta da API:', response.data);
            
            if (response.data.success) {
                const expenses = response.data.data || [];
                setFilteredExpenses(expenses);
                
                if (expenses.length > 0) {
                    alert(`Relatório gerado com ${expenses.length} despesas encontradas!`);
                } else {
                    alert('Nenhuma despesa encontrada no período selecionado.');
                }
            } else {
                console.error('Erro na resposta:', response.data);
                alert('Erro ao gerar relatório: ' + (response.data.message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            
            if (error.response) {
                console.error('Detalhes do erro:', error.response.data);
                alert('Erro ao gerar relatório: ' + (error.response.data.message || 'Erro do servidor'));
            } else if (error.request) {
                alert('Erro de conexão. Verifique se o backend está rodando.');
            } else {
                alert('Erro ao gerar relatório. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        if (filteredExpenses.length === 0) {
            alert('Gere um relatório primeiro antes de exportar!');
            return;
        }

        // Calcular totais
        const total = filteredExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
        
        // Criar conteúdo HTML para o PDF
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Relatório de Despesas - MoneyMind</title>
                <style>
                    @media print {
                        body { margin: 0; }
                        .page-break { page-break-before: always; }
                    }
                    
                    body {
                        font-family: 'Inter', Arial, sans-serif;
                        margin: 20px;
                        color: #121212;
                        line-height: 1.5;
                        background: #ffffff;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 35px;
                        border-bottom: 2px solid #00bf63;
                        padding-bottom: 20px;
                        position: relative;
                    }
                    
                    .header::after {
                        content: '';
                        position: absolute;
                        bottom: -2px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60px;
                        height: 3px;
                        background: #00bf63;
                        border-radius: 2px;
                    }
                    
                    .header h1 {
                        color: #00bf63;
                        margin: 0 0 12px 0;
                        font-size: 32px;
                        font-weight: 700;
                        text-shadow: 0 1px 2px rgba(0,191,99,0.1);
                    }
                    
                    .header p {
                        margin: 0;
                        color: #6c757d;
                        font-size: 15px;
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .summary {
                        background: #F7F7F7;
                        padding: 25px;
                        border-radius: 12px;
                        margin-bottom: 30px;
                        border: 1px solid rgba(0, 191, 99, 0.2);
                        position: relative;
                        box-shadow: 0 4px 12px rgba(0, 191, 99, 0.08);
                    }
                    
                    .summary::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 4px;
                        height: 100%;
                        background: #00bf63;
                        border-radius: 0 2px 2px 0;
                    }
                    
                    .summary h3 {
                        margin: 0 0 20px 0;
                        color: #121212;
                        font-size: 20px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border-bottom: 1px solid rgba(0, 191, 99, 0.2);
                        padding-bottom: 10px;
                    }
                    
                    .summary p {
                        margin: 12px 0;
                        font-size: 14px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .summary strong {
                        color: #6c757d;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        font-size: 12px;
                    }
                    
                    .summary .total {
                        font-weight: 700;
                        color: #00bf63;
                        font-size: 22px;
                        text-shadow: 0 1px 2px rgba(0,191,99,0.1);
                    }
                    
                    .expenses-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 25px;
                        font-size: 14px;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0, 191, 99, 0.1);
                    }
                    
                    .expenses-table th,
                    .expenses-table td {
                        border: none;
                        padding: 15px 12px;
                        text-align: left;
                        vertical-align: middle;
                    }
                    
                    .expenses-table th {
                        background: linear-gradient(135deg, #00bf63, #00a855);
                        color: white;
                        font-weight: 700;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 0.8px;
                        position: relative;
                    }
                    
                    .expenses-table th:first-child {
                        border-top-left-radius: 8px;
                    }
                    
                    .expenses-table th:last-child {
                        border-top-right-radius: 8px;
                    }
                    
                    .expenses-table tbody tr {
                        border-bottom: 1px solid rgba(0, 191, 99, 0.08);
                    }
                    
                    .expenses-table tbody tr:nth-child(even) {
                        background-color: #F7F7F7;
                    }
                    
                    .expenses-table tbody tr:hover {
                        background-color: rgba(0, 191, 99, 0.05);
                    }
                    
                    .expenses-table tbody tr:last-child td:first-child {
                        border-bottom-left-radius: 8px;
                    }
                    
                    .expenses-table tbody tr:last-child td:last-child {
                        border-bottom-right-radius: 8px;
                    }
                    
                    .amount {
                        text-align: right;
                        font-weight: 700;
                        color: #00bf63;
                        white-space: nowrap;
                        font-size: 15px;
                    }
                    
                    .category {
                        text-transform: capitalize;
                        color: #6c757d;
                        font-weight: 500;
                    }
                    
                    .date-cell {
                        font-weight: 600;
                        color: #121212;
                    }
                    
                    .description-cell {
                        font-weight: 600;
                        color: #121212;
                    }
                    
                    .footer {
                        margin-top: 50px;
                        text-align: center;
                        font-size: 12px;
                        color: #6c757d;
                        border-top: 2px solid rgba(0, 191, 99, 0.1);
                        padding-top: 20px;
                        position: relative;
                    }
                    
                    .footer::before {
                        content: '';
                        position: absolute;
                        top: -1px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 40px;
                        height: 2px;
                        background: #00bf63;
                    }
                    
                    .footer p {
                        margin: 8px 0;
                        font-weight: 500;
                    }
                    
                    /* Melhorias para impressão */
                    @media print {
                        body { 
                            margin: 15px;
                            font-size: 12px;
                            color: #000;
                        }
                        .header h1 { font-size: 26px; }
                        .summary { 
                            background: #f9f9f9 !important;
                            box-shadow: none !important;
                        }
                        .expenses-table { 
                            font-size: 11px;
                            box-shadow: none !important;
                        }
                        .expenses-table th, 
                        .expenses-table td { 
                            padding: 8px 6px;
                        }
                        .expenses-table th {
                            background: #00bf63 !important;
                            -webkit-print-color-adjust: exact;
                            color-adjust: exact;
                        }
                        .amount {
                            color: #00bf63 !important;
                            -webkit-print-color-adjust: exact;
                            color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Relatório de Despesas</h1>
                    <p>MoneyMind - Sistema de Controle Financeiro</p>
                </div>

                <div class="summary">
                    <h3>Resumo do Período</h3>
                    <p><strong>Período:</strong> ${new Date(startDate).toLocaleDateString('pt-BR')} até ${new Date(endDate).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Total de Despesas:</strong> ${filteredExpenses.length}</p>
                    <p><strong>Valor Total:</strong> <span class="total">R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
                </div>

                <table class="expenses-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredExpenses.map(expense => `
                            <tr>
                                <td class="date-cell">${new Date(expense.date).toLocaleDateString('pt-BR')}</td>
                                <td class="description-cell">${expense.description}</td>
                                <td class="category">${expense.category}</td>
                                <td class="amount">R$ ${parseFloat(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="footer">
                    <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
                    <p>MoneyMind - Controle suas finanças com inteligência</p>
                </div>
            </body>
            </html>
        `;

        // Método 1: Tentar abrir em nova aba e imprimir automaticamente
        try {
            const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const htmlUrl = URL.createObjectURL(htmlBlob);
            
            // Criar uma nova janela
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            
            if (printWindow) {
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                
                printWindow.onload = function() {
                    setTimeout(() => {
                        // Focar na nova janela
                        printWindow.focus();
                        
                        // Tentar imprimir automaticamente
                        try {
                            printWindow.print();
                            alert('Diálogo de impressão aberto! Selecione "Salvar como PDF" na impressora.');
                        } catch (printError) {
                            // Se não conseguir imprimir automaticamente, mostrar instruções
                            alert('Uma nova aba foi aberta com o relatório. Use Ctrl+P (Cmd+P no Mac) para imprimir e salvar como PDF.');
                        }
                    }, 1000);
                };
            } else {
                // Fallback se popup for bloqueado
                alert('Popup bloqueado pelo navegador. Gerando arquivo HTML para download...');
                
                // Download do arquivo HTML como alternativa
                const link = document.createElement('a');
                link.href = htmlUrl;
                link.download = `relatorio_moneymind_${startDate}_${endDate}.html`;
                link.click();
                
                setTimeout(() => {
                    URL.revokeObjectURL(htmlUrl);
                }, 1000);
                
                alert('Arquivo HTML baixado! Abra o arquivo no navegador e use Ctrl+P para imprimir como PDF.');
            }
            
            // Limpar URL após um tempo
            setTimeout(() => {
                URL.revokeObjectURL(htmlUrl);
            }, 30000);
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF. Tente novamente.');
        }
    };

    return (
        <MainLayout>
            <button onClick={() => navigate(-1)} className="back-button">
                &#x2190;
            </button>
            <div className="export-container">
                <h1 className="export-title">Exportar Relatórios</h1>

                <Card>
                    <div className="export-card-content">
                        <Button variant="primary" onClick={handleExportPDF}>
                            Exportar para PDF
                        </Button>
                    </div>
                </Card>

                <p className="period-label">Selecione o período</p>

                <div className="date-inputs-container">
                    <input 
                        type="date" 
                        className="date-input" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input 
                        type="date" 
                        className="date-input" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div className="generate-button-container">
                    <Button variant="primary" onClick={handleGenerateReport} disabled={loading}>
                        {loading ? 'Gerando...' : 'Gerar Relatório'}
                    </Button>
                </div>

                {/* Exibir card do relatório sempre que há datas ou dados */}
                {(startDate && endDate) && (
                    <Card>
                        <h3 className="card-title">Resumo do Relatório</h3>
                        
                        {loading ? (
                            <div style={{ 
                                padding: '40px', 
                                textAlign: 'center',
                                backgroundColor: '#F7F7F7',
                                borderRadius: '12px',
                                border: '1px solid rgba(0, 191, 99, 0.1)'
                            }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    color: '#6c757d',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid rgba(0, 191, 99, 0.3)',
                                        borderTop: '2px solid #00bf63',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite',
                                        marginRight: '8px'
                                    }}></div>
                                    Carregando dados...
                                </div>
                                <style>{`
                                    @keyframes spin {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                `}</style>
                            </div>
                        ) : startDate && endDate ? (
                            <>
                                <div style={{ 
                                    marginBottom: '25px', 
                                    padding: '24px', 
                                    backgroundColor: '#F7F7F7',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0, 191, 99, 0.2)',
                                    boxShadow: '0 4px 12px rgba(0, 191, 99, 0.08)',
                                    position: 'relative'
                                }}>
                                    {/* Ícone decorativo */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        width: '8px',
                                        height: '8px',
                                        backgroundColor: '#00bf63',
                                        borderRadius: '50%'
                                    }}></div>
                                    
                                    <div style={{ marginBottom: '16px' }}>
                                        <span style={{ 
                                            color: '#6c757d', 
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>Período:</span>
                                        <div style={{ 
                                            color: '#121212', 
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            marginTop: '4px'
                                        }}>
                                            {new Date(startDate).toLocaleDateString('pt-BR')} até {new Date(endDate).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                    
                                    <div style={{ marginBottom: '16px' }}>
                                        <span style={{ 
                                            color: '#6c757d', 
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>Total de Despesas:</span>
                                        <div style={{ 
                                            color: '#121212', 
                                            fontWeight: '700',
                                            fontSize: '20px',
                                            marginTop: '4px'
                                        }}>{filteredExpenses.length}</div>
                                    </div>
                                    
                                    <div>
                                        <span style={{ 
                                            color: '#6c757d', 
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>Valor Total:</span>
                                        <div style={{ 
                                            color: '#00bf63', 
                                            fontWeight: '700',
                                            fontSize: '24px',
                                            marginTop: '4px',
                                            textShadow: '0 1px 2px rgba(0,191,99,0.1)'
                                        }}>
                                            R$ {filteredExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                                
                                {filteredExpenses.length === 0 ? (
                                    <div style={{ 
                                        padding: '40px', 
                                        textAlign: 'center',
                                        backgroundColor: '#F7F7F7',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0, 191, 99, 0.1)'
                                    }}>
                                        <h4 style={{ color: '#121212', marginBottom: '15px', fontWeight: '600' }}>Nenhuma despesa encontrada</h4>
                                        <p style={{ color: '#6c757d', marginBottom: '15px' }}>Não foram encontradas despesas no período selecionado.</p>
                                        <p style={{ color: '#121212', fontWeight: '600', marginBottom: '10px' }}>Verifique se:</p>
                                        <ul style={{ 
                                            textAlign: 'left', 
                                            display: 'inline-block',
                                            color: '#6c757d',
                                            listStyle: 'none',
                                            padding: 0
                                        }}>
                                            <li style={{ marginBottom: '8px', position: 'relative', paddingLeft: '20px' }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    top: '8px',
                                                    width: '4px',
                                                    height: '4px',
                                                    backgroundColor: '#00bf63',
                                                    borderRadius: '50%'
                                                }}></span>
                                                Você tem despesas cadastradas no sistema
                                            </li>
                                            <li style={{ marginBottom: '8px', position: 'relative', paddingLeft: '20px' }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    top: '8px',
                                                    width: '4px',
                                                    height: '4px',
                                                    backgroundColor: '#00bf63',
                                                    borderRadius: '50%'
                                                }}></span>
                                                As datas selecionadas estão corretas
                                            </li>
                                            <li style={{ position: 'relative', paddingLeft: '20px' }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    top: '8px',
                                                    width: '4px',
                                                    height: '4px',
                                                    backgroundColor: '#00bf63',
                                                    borderRadius: '50%'
                                                }}></span>
                                                As despesas estão dentro do período escolhido
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '20px',
                                            paddingBottom: '12px',
                                            borderBottom: '2px solid rgba(0, 191, 99, 0.1)'
                                        }}>
                                            <div style={{
                                                width: '4px',
                                                height: '20px',
                                                backgroundColor: '#00bf63',
                                                borderRadius: '2px',
                                                marginRight: '12px'
                                            }}></div>
                                            <h4 style={{ 
                                                color: '#121212', 
                                                margin: 0,
                                                fontWeight: '600',
                                                fontSize: '16px'
                                            }}>Despesas Encontradas</h4>
                                        </div>
                                        {filteredExpenses.map((expense, index) => (
                                            <div key={expense.id || index} style={{ 
                                                padding: '18px 20px', 
                                                borderBottom: '1px solid rgba(0, 191, 99, 0.08)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                backgroundColor: index % 2 === 0 ? '#ffffff' : '#F7F7F7',
                                                borderRadius: index === filteredExpenses.length - 1 ? '0 0 8px 8px' : '0',
                                                transition: 'background-color 0.2s ease'
                                            }}>
                                                <div style={{ flex: 1, marginRight: '16px' }}>
                                                    <div style={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginBottom: '6px'
                                                    }}>
                                                        <span style={{
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            color: '#00bf63',
                                                            backgroundColor: 'rgba(0, 191, 99, 0.1)',
                                                            padding: '2px 8px',
                                                            borderRadius: '12px',
                                                            marginRight: '10px',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            {new Date(expense.date).toLocaleDateString('pt-BR')}
                                                        </span>
                                                        <span style={{
                                                            fontWeight: '600',
                                                            color: '#121212',
                                                            fontSize: '15px'
                                                        }}>
                                                            {expense.description}
                                                        </span>
                                                    </div>
                                                    <div style={{ 
                                                        fontSize: '13px',
                                                        color: '#6c757d',
                                                        fontWeight: '500',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        Categoria: {expense.category}
                                                    </div>
                                                </div>
                                                <div style={{ 
                                                    fontWeight: '700',
                                                    color: '#00bf63',
                                                    fontSize: '16px',
                                                    textAlign: 'right',
                                                    minWidth: '100px'
                                                }}>
                                                    R$ {parseFloat(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ 
                                padding: '20px', 
                                textAlign: 'center', 
                                color: '#6c757d',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #dee2e6'
                            }}>
                                <p>Selecione um período para gerar o relatório</p>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </MainLayout>
    );
};

export default ExportReports;