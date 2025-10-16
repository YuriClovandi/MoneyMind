// src/routes/index.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import EsqueceuSenha from '../pages/EsqueceuSenha';
import AddExpense from '../pages/AddExpense';
import Reports from '../pages/Reports';
import ExportReports from '../pages/ExportReports';
import EditBalance from '../pages/EditBalance';

// Aceita as props balance e setBalance
const AppRoutes = ({ balance, setBalance }) => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
                {/* Envia o saldo para a Dashboard */}
                <Route path="/dashboard" element={<Dashboard balance={balance} />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/add-expense" element={<AddExpense />} />
                <Route path="/export-reports" element={<ExportReports />} />
                {/* Envia o saldo atual e a função de atualização para a tela de edição */}
                <Route path="/edit-balance" element={<EditBalance currentBalance={balance} setBalance={setBalance} />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;