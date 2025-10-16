import React from 'react';
import './style.css';

const Input = ({ type, placeholder, value, onChange, required = false }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="common-input"
    />
  );
};

export default Input;