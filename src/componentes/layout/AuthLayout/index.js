// src/componentes/layout/AuthLayout/index.js
import React from 'react';
import logo from '../../../assets/images/MoneyMind.png';
import './style.css';

const AuthLayout = ({ children }) => {
    return (
        <div className="split-screen-layout">
            <div className="split-screen-layout__left">
                <img src={logo} alt="MoneyMind Logo" className="large-logo" />
            </div>
            <div className="split-screen-layout__right">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;