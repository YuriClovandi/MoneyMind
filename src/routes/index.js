// src/routes/index.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import EsqueceuSenha from '../pages/EsqueceuSenha';
import AddExpense from '../pages/AddExpense';
import Reports from '../pages/Reports';
import ExportReports from '../pages/ExportReports'; // Importa o novo componente

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/add-expense" element={<AddExpense />} /> {/* Rota para Adicionar Despesa */}
                <Route path="/export-reports" element={<ExportReports />} /> {/* Rota para Exportar Relatórios */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;