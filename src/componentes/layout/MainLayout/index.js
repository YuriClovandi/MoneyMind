// src/componentes/layout/MainLayout/index.js
import React from 'react';
import './style.css';

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            {children}
        </div>
    );
};

export default MainLayout;