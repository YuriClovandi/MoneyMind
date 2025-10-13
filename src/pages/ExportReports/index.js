// src/pages/ExportReports/index.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import Button from '../../componentes/common/Button';
import './style.css';

const ExportReports = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleGenerateReport = () => {
        console.log("Gerando relatório de", startDate, "até", endDate);
    };

    const handleExportPDF = () => {
        console.log("Exportando PDF...");
    }

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
                            <span className="button-icon">📁</span> Exportar para PDF
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
                    <Button variant="primary" onClick={handleGenerateReport}>
                        Gerar Relatório
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
};

export default ExportReports;