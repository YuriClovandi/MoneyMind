import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Input from '../../componentes/common/Input';
import Button from '../../componentes/common/Button';
import './style.css';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log('Cadastro com:', { name, email, password });
    navigate('/');
  };

  return (
    <AuthLayout>
      <h2>Crie sua conta</h2>
      <form onSubmit={handleSignUp}>
        <Input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <Button type="submit" fullWidth>Cadastrar</Button>
      </form>
      <Link to="/">Já tem uma conta? Faça login</Link>
    </AuthLayout>
  );
};

export default SignUpPage;