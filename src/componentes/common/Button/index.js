import React from 'react';
import './style.css';

const Button = ({ children, type = 'submit', onClick, fullWidth = false }) => {
  const widthClass = fullWidth ? 'full-width' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`common-button ${widthClass}`}
    >
      {children}
    </button>
  );
};

export default Button;