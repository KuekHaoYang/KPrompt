
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
}

const TextArea: React.FC<TextAreaProps> = ({ id, className, ...props }) => {
    const textAreaStyle: React.CSSProperties = {
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px) saturate(150%)',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-color)',
    };

  return (
    <div>
        <label htmlFor={id} className="sr-only">{props.placeholder}</label>
        <textarea
            id={id}
            {...props}
            style={textAreaStyle}
            className={`w-full rounded-2xl p-4 text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-[color:var(--accent-color)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent-color)_30%,transparent)] placeholder-[color:var(--text-color-secondary)] disabled:opacity-60 ${className}`}
        />
    </div>
  );
};

export default TextArea;