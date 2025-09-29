import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe suas páginas aqui
import LoginPage from '../pages/Login';
import SignUpPage from '../pages/SignUp';
import DashboardPage from '../pages/Dashboard';
import AddExpensePage from '../pages/AddExpense';
import ReportsPage from '../pages/Reports';
import ForgotPasswordPage from '../pages/EsqueceuSenha'; // <-- 1. IMPORTE A NOVA PÁGINA

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rotas de Autenticação */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* <-- 2. ADICIONE A NOVA ROTA */}

        {/* Rotas Protegidas (dentro da aplicação) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add-expense" element={<AddExpensePage />} />
        <Route path="/reports" element={<ReportsPage />} />

        {/* Rota para qualquer outro caminho não encontrado */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}