// src/pages/Login/index.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Card from '../../componentes/common/Card';
import Input from '../../componentes/common/Input';
import Button from '../../componentes/common/Button';
import api from '../../services/api';
import './style.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validação básica
        if (!email || !password) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                // Salvar token no localStorage
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                
                console.log('Login realizado com sucesso!');
                navigate('/dashboard');
            } else {
                alert('Erro no login: ' + response.data.message);
            }
        } catch (error) {
            console.error('Erro no login:', error);
            
            if (error.response?.status === 401) {
                alert('Email ou senha incorretos!');
            } else {
                alert('Erro ao fazer login. Verifique sua conexão e tente novamente.');
            }
        }
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