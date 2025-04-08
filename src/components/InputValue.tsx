import React from "react";

// Definindo a interface para as props do componente
interface InputProps {
  type: "text" | "password" | "email" | "number" | "file"; // Tipos de input possíveis
  value: string | number | undefined; // O valor pode ser string ou número, dependendo do tipo
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Função para lidar com mudanças no input
  placeholder?: string; // Placeholder opcional
  label: string; // A label que será exibida ao lado do input
  className?: string; // Classe opcional
}

const Input: React.FC<InputProps> = ({ type, value, onChange, placeholder, label, className }) => {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
};

export default Input;
