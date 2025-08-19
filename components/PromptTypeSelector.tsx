
import React, { useState, useRef, useEffect } from 'react';
import { UiLanguage, t } from '../services/translations';

export type PromptType = 'system' | 'user';

interface PromptTypeSelectorProps {
  promptType: PromptType;
  onChange: (promptType: PromptType) => void;
  uiLang: UiLanguage;
}

const PromptTypeSelector: React.FC<PromptTypeSelectorProps> = ({ promptType, onChange, uiLang }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    
    const baseClasses = "relative z-10 px-4 py-1.5 text-sm font-semibold transition-colors duration-300 w-1/2";
    const activeClasses = "text-white";
    const inactiveClasses = "text-[color:var(--text-color-secondary)] hover:text-[color:var(--text-color)]";

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const activeButton = container.querySelector(`button[data-type="${promptType}"]`) as HTMLElement;
            if (activeButton) {
                setIndicatorStyle({
                    width: `${activeButton.offsetWidth}px`,
                    transform: `translateX(${activeButton.offsetLeft}px)`,
                });
            }
        }
    }, [promptType]);

    return (
        <div ref={containerRef} className="relative inline-flex p-0.5 rounded-full border w-full max-w-xs" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
            <span
                className="absolute top-0.5 left-0.5 bottom-0.5 rounded-full bg-[color:var(--accent-color)] shadow-sm"
                style={{...indicatorStyle, transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'}}
                aria-hidden="true"
            ></span>
            <button data-type="system" onClick={() => onChange('system')} className={`${baseClasses} rounded-full ${promptType === 'system' ? activeClasses : inactiveClasses}`} aria-label="Select System Prompt type">
                {t('refiner.promptType.system', uiLang)}
            </button>
            <button data-type="user" onClick={() => onChange('user')} className={`${baseClasses} rounded-full ${promptType === 'user' ? activeClasses : inactiveClasses}`} aria-label="Select User Prompt type">
                {t('refiner.promptType.user', uiLang)}
            </button>
        </div>
    );
};

export default PromptTypeSelector;
