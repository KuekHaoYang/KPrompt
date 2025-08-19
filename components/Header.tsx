
import React, { useState, useEffect, useCallback } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from './Icon';

type Theme = 'light' | 'dark' | 'system';

interface LanguageSwitcherProps {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage, t }) => {
  const isChineseActive = language.includes('Chinese') || language === '简体中文';
  
  const buttonBaseClasses = "flex items-center justify-center px-3 py-1.5 bg-transparent border-none rounded-full cursor-pointer transition-all duration-200 ease-in-out text-sm font-semibold";
  const buttonHoverClasses = "hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]";
  const textSecondaryColor = "text-[color:var(--text-color-secondary)]";
  const activeClasses = "!bg-[color:var(--accent-color)] !text-white scale-105";

  return (
    <div className="inline-flex p-1 rounded-full border mr-4" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
      <button 
        onClick={() => setLanguage('English')} 
        className={`${buttonBaseClasses} ${language === 'English' ? activeClasses : `${textSecondaryColor} ${buttonHoverClasses}`}`}
        aria-label="Switch to English"
      >
        {t('language.english')}
      </button>
      <button 
        onClick={() => setLanguage('Chinese Simplified')} 
        className={`${buttonBaseClasses} ${isChineseActive ? activeClasses : `${textSecondaryColor} ${buttonHoverClasses}`}`}
        aria-label="Switch to Chinese Simplified"
      >
        {t('language.chinese')}
      </button>
    </div>
  );
};

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


interface HeaderProps {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, t }) => {
  return (
    <header className="text-center space-y-4">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-color)' }}>
        {t('app.title')}
      </h1>
      <p className="text-lg" style={{ color: 'var(--text-color-secondary)' }}>
        {t('app.subtitle')}
      </p>
      <div className="pt-2 flex justify-center items-center">
        <LanguageSwitcher language={language} setLanguage={setLanguage} t={t} />
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
