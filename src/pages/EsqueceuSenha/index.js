// src/pages/EsqueceuSenha/index.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Card from '../../componentes/common/Card';
import Input from '../../componentes/common/Input';
import Button from '../../componentes/common/Button';
import './style.css';

const EsqueceuSenha = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handlePasswordReset = (e) => {
        e.preventDefault();
        // Lógica para enviar o e-mail de recuperação aqui
        console.log('Solicitação de recuperação para o e-mail:', email);
        alert('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
        navigate('/'); // Volta para a tela de login
    };

    return (
        <AuthLayout>
            <Card>
                <div className="forgot-password-container">
                    <h2 className="forgot-password-title">Recuperar Senha</h2>


                    <form onSubmit={handlePasswordReset}>
                        <Input
                            type="email"
                            placeholder="Seu e-mail cadastrado"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        <Button type="submit" variant="primary">
                            Enviar
                        </Button>
                    </form>

                    <div className="back-to-login-link">
                        <Link to="/">Voltar para o Login</Link>
                    </div>
                </div>
            </Card>
        </AuthLayout>
    );
};

export default EsqueceuSenha;