// src/pages/EditBalance/index.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import Input from '../../componentes/common/Input';
import Button from '../../componentes/common/Button';
import './style.css';

// Recebe currentBalance e setBalance como props
const EditBalance = ({ currentBalance, setBalance }) => {
    const navigate = useNavigate();
    // Inicia o estado com o valor atual do saldo
    const [newBalance, setNewBalance] = useState(currentBalance || '');

    const handleSave = () => {
        const value = parseFloat(newBalance);
        if (!isNaN(value)) {
            setBalance(value); // Atualiza o estado global
            navigate('/dashboard'); // Volta para a dashboard
        } else {
            alert("Por favor, insira um valor válido.");
        }
    };

    return (
        <MainLayout>
            <button onClick={() => navigate(-1)} className="back-button">
                &#x2190;
            </button>
            <div className="edit-balance-container">
                <h1 className="page-title">Adicionar / Editar Saldo</h1>
                <Card>
                    <div className="form-content">
                        <Input
                            label="Novo Saldo"
                            type="number"
                            placeholder="R$ 0,00"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                        />
                        <div className="save-button-container">
                            <Button variant="primary" onClick={handleSave}>
                                Salvar
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};

export default EditBalance;