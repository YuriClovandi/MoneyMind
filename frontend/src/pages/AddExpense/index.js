// src/pages/AddExpense/index.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import Button from '../../componentes/common/Button';
import api from '../../services/api';
import './style.css';

const AddExpense = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');

    // Verificar se está logado
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para adicionar despesas!');
            navigate('/');
            return;
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação básica
        if (!value || !description || !date || !category) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        try {
            const expenseData = {
                description,
                amount: parseFloat(value),
                date,
                category
            };

            const response = await api.post('/expenses', expenseData);
            
            if (response.data.success) {
                console.log('Despesa criada:', response.data.data);
                alert('Despesa adicionada com sucesso!');
                // Navegar para dashboard e forçar reload
                navigate('/dashboard', { replace: true });
                // Disparar evento customizado para recarregar dados
                window.dispatchEvent(new Event('expenseAdded'));
            } else {
                alert('Erro ao adicionar despesa: ' + response.data.message);
            }
        } catch (error) {
            console.error('Erro ao criar despesa:', error);
            
            if (error.response?.status === 401) {
                alert('Você precisa estar logado para adicionar despesas!');
                // Redirecionar para login
                navigate('/');
            } else {
                alert('Erro ao adicionar despesa. Tente novamente.');
            }
        }
    };

    return (
        <MainLayout>
            <button onClick={() => navigate(-1)} className="back-button">
                &#x2190;
            </button>
            <div className="add-expense-container">
                {/* Metade Esquerda */}
                <div className="left-column">
                    <h1 className="page-title">
                        Adicionar
                        <span>Despesas</span>
                    </h1>
                </div>

                {/* Metade Direita com Cards separados */}
                <div className="right-column-cards">
                    <form onSubmit={handleSubmit} className="expense-form-stack">
                        <Card>
                            <label>Valor</label>
                            <input
                                type="number"
                                placeholder="R$ 0,00"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="transparent-input"
                            />
                        </Card>

                        <Card>
                            <label>Descrição</label>
                            <input
                                type="text"
                                placeholder="Ex: Almoço com amigos"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="transparent-input"
                            />
                        </Card>

                        <Card>
                            <label>Data</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="transparent-input date-input"
                            />
                        </Card>

                        <Card>
                             <label>Categoria</label>
                             <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                className="transparent-input"
                            >
                                <option value="" disabled>Selecione uma categoria</option>
                                <option value="alimentacao">Alimentação</option>
                                <option value="transporte">Transporte</option>
                                <option value="lazer">Lazer</option>
                                <option value="moradia">Moradia</option>
                                <option value="saude">Saúde</option>
                                <option value="outros">Outros</option>
                            </select>
                        </Card>
                        
                        <div className="submit-button-container">
                            <Button type="submit" variant="primary">
                                Adicionar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default AddExpense;