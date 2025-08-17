
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div 
        className={`p-6 sm:p-8 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:transform hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl ${className}`}
        style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-md)',
        }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
