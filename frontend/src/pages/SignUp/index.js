// src/pages/SignUp/index.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../componentes/layout/AuthLayout';
import Card from '../../componentes/common/Card';
import Input from '../../componentes/common/Input';
import Button from '../../componentes/common/Button';
import api from '../../services/api';
import './style.css'; 

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        // Validação básica
        if (!name || !email || !password || !confirmPassword) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres!");
            return;
        }

        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password
            });

            if (response.data.success) {
                // Automaticamente fazer login após cadastro
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                
                alert('Conta criada com sucesso!');
                navigate('/dashboard');
            } else {
                alert('Erro ao criar conta: ' + response.data.message);
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            
            if (error.response?.data) {
                const errorData = error.response.data;
                let errorMessage = errorData.message || 'Erro desconhecido';
                
                // Se há detalhes específicos do erro, incluir
                if (errorData.error) {
                    if (typeof errorData.error === 'string') {
                        errorMessage += ': ' + errorData.error;
                    } else if (errorData.error.message) {
                        errorMessage += ': ' + errorData.error.message;
                    }
                }
                
                alert('Erro: ' + errorMessage);
            } else if (error.response?.status === 400) {
                alert('Erro: Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.');
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                alert('Erro: Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
            } else {
                alert('Erro ao criar conta. Tente novamente.');
            }
        }
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