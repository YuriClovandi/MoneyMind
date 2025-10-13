// src/componentes/common/Button/index.js
import React from 'react';
import './style.css';

const Button = ({ children, type, onClick, variant = 'primary' }) => {
  const className = `button button--${variant}`;
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;