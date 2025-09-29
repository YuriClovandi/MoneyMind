import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Input from '../../componentes/common/Input';
import Button from '../../componentes/common/Button';
import './style.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica da API para enviar o email de recuperação iria aqui
    console.log('Solicitação de recuperação para o email:', email);

    // Simula o envio com uma mensagem para o usuário
    setMessage(`Se um usuário com o e-mail ${email} existir, um link de recuperação foi enviado.`);
    setEmail(''); // Limpa o campo
  };

  return (
    <AuthLayout>
      <h2 className="form-title">Esqueceu a senha?</h2>
      <p className="form-info">
        Sem problemas! Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
      </p>

      {!message ? (
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" fullWidth>Enviar link de recuperação</Button>
        </form>
      ) : (
        <p className="form-success-message">{message}</p>
      )}

      <div className="form-links">
        <Link to="/">Voltar para o Login</Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;