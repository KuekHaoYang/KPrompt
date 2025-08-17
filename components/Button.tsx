
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    const buttonStyle: React.CSSProperties = {
        backgroundColor: 'var(--accent-color)',
        boxShadow: 'var(--shadow-sm)',
    };
    
    const disabledStyle: React.CSSProperties = {
      backgroundColor: 'var(--text-color-secondary)',
    }

  return (
    <button
      {...props}
      style={props.disabled ? disabledStyle : buttonStyle}
      className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white rounded-2xl cursor-pointer transition-all duration-200 ease-in-out hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98] active:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--accent-color)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:brightness-100"
    >
      {children}
    </button>
  );
};

export default Button;
