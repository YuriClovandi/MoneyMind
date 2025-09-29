import React, { useState } from 'react';
import MainLayout from '../../componentes/layout/MainLayout';
import Card from '../../componentes/common/Card';
import Button from '../../componentes/common/Button';
import './style.css';

const AddExpensePage = () => {
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
    const [categoria, setCategoria] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Nova despesa:", { valor, descricao, data, categoria });
        alert("Despesa adicionada com sucesso!");
        // Limpar formulário
        setValor('');
        setDescricao('');
        setData('');
        setCategoria('');
    }

    return (
        <MainLayout>
            <div className="page-title">
                <h2>Adicionar Despesa</h2>
            </div>
            <Card>
                <form onSubmit={handleSubmit} className="expense-form">
                    <div className="form-group">
                        <label htmlFor="valor">Valor (R$)</label>
                        <input
                            type="number"
                            id="valor"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder="100,50"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descricao">Descrição</label>
                        <input
                            type="text"
                            id="descricao"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Ex: Supermercado"
                            required
                        />
                    </div>
                     <div className="form-group">
                        <label htmlFor="data">Data</label>
                        <input
                            type="date"
                            id="data"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoria">Categoria</label>
                        <select
                            id="categoria"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecione...</option>
                            <option value="alimentacao">Alimentação</option>
                            <option value="transporte">Transporte</option>
                            <option value="moradia">Moradia</option>
                            <option value="lazer">Lazer</option>
                            <option value="outros">Outros</option>
                        </select>
                    </div>
                    <Button type="submit">Adicionar</Button>
                </form>
            </Card>
        </MainLayout>
    );
};

export default AddExpensePage;