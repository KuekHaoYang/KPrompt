
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CheckIcon } from './Icon';

interface ModelSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // In a real app, these options might come from props or a config file
  const options = [
    { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' }
  ];

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      // Create a synthetic event that mimics the native select event
      const syntheticEvent = {
        target: { value: selectedValue }
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
    setIsOpen(false);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const buttonStyle: React.CSSProperties = {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(10px) saturate(150%)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-color)',
  };

  return (
    <div>
      <label htmlFor="model-selector-button" className="block text-sm font-medium mb-2" style={{color: 'var(--text-color-secondary)'}}>
        Select Model
      </label>
      <div className="relative" ref={wrapperRef}>
        <button
          id="model-selector-button"
          type="button"
          onClick={handleToggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          style={buttonStyle}
          className="w-full text-left rounded-2xl py-3 px-4 text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-[color:var(--accent-color)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent-color)_30%,transparent)]"
        >
          <div className="flex items-center justify-between">
            <span>{options.find(o => o.value === value)?.label || 'Select a model'}</span>
            <div className="pointer-events-none flex items-center text-[color:var(--text-color)]">
                <svg className={`fill-current h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </button>

        {isOpen && (
          <div
            role="listbox"
            className="absolute z-10 mt-2 w-full p-2 rounded-2xl shadow-lg fade-in"
            style={{ 
              background: 'var(--glass-bg)', 
              border: '1px solid var(--glass-border)', 
              backdropFilter: 'blur(25px) saturate(180%)' 
            }}
          >
            <ul className="max-h-60 overflow-auto focus:outline-none">
              {options.map(option => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                  tabIndex={0}
                  className="flex items-center justify-between p-3 text-sm rounded-xl cursor-pointer hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)] focus:outline-none focus:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]"
                >
                  <span>{option.label}</span>
                  {value === option.value && <CheckIcon className="w-5 h-5 text-[color:var(--accent-color)]" />}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSelector;