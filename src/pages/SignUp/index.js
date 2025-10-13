// src/pages/SignUp/index.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Card from '../../componentes/common/Card';
import Input from '../../componentes/common/Input';
import Button from '../../componentes/common/Button';
import './style.css'; 

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        // Lógica de cadastro aqui
        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }
        navigate('/'); // Alterado: Navega para a tela de login
    };

    return (
        <AuthLayout>
            <Card>
                <div className="signup-form-container">
                    <h2 className="signup-title">Crie sua conta</h2>
                    <p className="signup-subtitle">É rápido e fácil!</p>

                    <form onSubmit={handleSignUp}>
                        <Input
                            type="text"
                            placeholder="Nome Completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Confirme a Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        
                        <Button type="submit" variant="primary">
                            Criar conta
                        </Button>
                    </form>

                    <div className="login-link">
                        <span>Já tem uma conta? </span>
                        <Link to="/">Faça o login</Link>
                    </div>
                </div>
            </Card>
        </AuthLayout>
    );
};

export default SignUp;