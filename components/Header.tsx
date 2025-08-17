
import React, { useState, useEffect, useCallback } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from './Icon';

type Theme = 'light' | 'dark' | 'system';

const ThemeSwitcher: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('system');

    const applyTheme = useCallback((themeToApply: Theme) => {
        if (themeToApply === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.toggle('dark', systemPrefersDark);
        } else {
            document.body.classList.toggle('dark', themeToApply === 'dark');
        }
    }, []);

    useEffect(() => {
        const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, [applyTheme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, applyTheme]);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    const iconClasses = "w-5 h-5";
    const buttonBaseClasses = "flex items-center justify-center w-9 h-9 bg-transparent border-none rounded-full cursor-pointer transition-all duration-200 ease-in-out";
    const buttonHoverClasses = "hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]";
    const textSecondaryColor = "text-[color:var(--text-color-secondary)]";
    const activeClasses = "!bg-[color:var(--accent-color)] !text-white scale-105";

    return (
        <div className="inline-flex p-1 rounded-full border" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
            <button onClick={() => handleThemeChange('light')} className={`${buttonBaseClasses} ${theme === 'light' ? activeClasses : `${textSecondaryColor} ${buttonHoverClasses}`}`} aria-label="Set light theme">
                <SunIcon className={iconClasses} />
            </button>
            <button onClick={() => handleThemeChange('dark')} className={`${buttonBaseClasses} ${theme === 'dark' ? activeClasses : `${textSecondaryColor} ${buttonHoverClasses}`}`} aria-label="Set dark theme">
                <MoonIcon className={iconClasses} />
            </button>
            <button onClick={() => handleThemeChange('system')} className={`${buttonBaseClasses} ${theme === 'system' ? activeClasses : `${textSecondaryColor} ${buttonHoverClasses}`}`} aria-label="Set system theme">
                <ComputerDesktopIcon className={iconClasses} />
            </button>
        </div>
    );
};


const Header: React.FC = () => {
  return (
    <header className="text-center space-y-4">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-color)' }}>
        KPrompt
      </h1>
      <p className="text-lg" style={{ color: 'var(--text-color-secondary)' }}>
        AI Prompt Engineering Workbench
      </p>
      <div className="pt-2">
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
