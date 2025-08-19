
import React from 'react';
import { UiLanguage } from '../services/translations';

interface LanguageSwitcherProps {
  uiLang: UiLanguage;
  onLangChange: (lang: UiLanguage) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ uiLang, onLangChange }) => {
    const buttonBaseClasses = "flex items-center justify-center w-12 h-9 bg-transparent border-none rounded-full cursor-pointer transition-all duration-200 ease-in-out font-semibold";
    const buttonHoverClasses = "hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]";
    const textSecondaryColor = "text-[color:var(--text-color-secondary)]";
    const activeClasses = "!bg-[color:var(--accent-color)] !text-white scale-105";

    return (
        <div className="inline-flex p-1 rounded-full border" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
            <button onClick={() => onLangChange('en')} className={`${buttonBaseClasses} ${uiLang === 'en' ? activeClasses : `${textSecondaryColor} ${buttonHoverClasses}`}`} aria-label="Switch to English">
                EN
            </button>
            <button onClick={() => onLangChange('zh')} className={`${buttonBaseClasses} ${uiLang === 'zh' ? activeClasses : `${textSecondaryColor} ${buttonHoverClasses}`}`} aria-label="切换到中文">
                中文
            </button>
        </div>
    );
};

export default LanguageSwitcher;
