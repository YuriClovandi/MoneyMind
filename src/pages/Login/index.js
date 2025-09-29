import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Input from '../../componentes/common/Input';
import Button from '../../componentes/common/Button';
import './style.css'; // Importa nosso arquivo de estilo

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login com:', { email, password });
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      {/* Adicionamos uma className para o título */}
      <h2 className="form-title">Bem-vindo de volta!</h2>

      <form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" fullWidth>Entrar</Button>
      </form>

      {/* Adicionamos uma div para agrupar os links */}
      <div className="form-links">
        <Link to="/forgot-password">Esqueci minha senha</Link>
        <Link to="/signup">Não tem uma conta? Crie uma agora</Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;