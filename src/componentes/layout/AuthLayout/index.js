import React from 'react';
import './style.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout-container">
      <div className="auth-form-card">
        <h1 className="auth-logo-text">MoneyMind</h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;