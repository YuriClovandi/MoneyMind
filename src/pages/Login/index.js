// src/pages/Login/index.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Card from '../../componentes/common/Card';
import Input from '../../componentes/common/Input';
import Button from '../../componentes/common/Button';
import './style.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <AuthLayout>
            <Card>
                <div className="login-form-container">
                    <h2 className="welcome-title">Bem vindo!</h2>

                    <form onSubmit={handleLogin}>
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
                        
                        <div className="forgot-password-link">
                            <Link to="/esqueceu-senha">Esqueceu a senha?</Link>
                        </div>

                        <Button type="submit" variant="primary">
                            Entrar
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleSignUp}>
                            Criar conta
                        </Button>
                    </form>
                </div>
            </Card>
        </AuthLayout>
    );
};

export default Login;