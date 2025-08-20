import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import Input from './Input';
import { CheckIcon } from './Icon';
import { getApiKeyAndSource, updateApiKey, updateApiHost } from '../services/geminiService';
import { t, UiLanguage } from '../services/translations';

const Settings: React.FC = () => {
    const [uiLang, setUiLang] = useState<UiLanguage>('en'); 
    const [apiKey, setApiKey] = useState('');
    const [keySource, setKeySource] = useState<'storage' | 'env' | 'none'>('none');
    const [initialApiKey, setInitialApiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    
    // This is for the API Host setting, which is separate
    const [apiHost, setApiHost] = useState('');
    const [initialHost, setInitialHost] = useState('');

    useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        setUiLang(browserLang === 'zh' ? 'zh' : 'en');

        // Load API Key info
        const { key, source } = getApiKeyAndSource();
        setApiKey(key);
        setInitialApiKey(key);
        setKeySource(source);

        // Load API Host info
        const savedHost = localStorage.getItem('gemini_api_host');
        const currentHost = savedHost ?? ''; 
        setApiHost(currentHost);
        setInitialHost(currentHost);
    }, []);

    const handleSave = () => {
        // Save API Key
        updateApiKey(apiKey);
        setInitialApiKey(apiKey);
        const { source } = getApiKeyAndSource(); // Re-fetch source after update
        setKeySource(source);

        // Save API Host
        updateApiHost(apiHost);
        setInitialHost(apiHost);

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        window.dispatchEvent(new Event('settings_updated'));
    };

    const canSave = apiKey !== initialApiKey || apiHost !== initialHost;
    
    const getSourceLabel = () => {
        // Show a different message if the user is editing the key
        if (apiKey !== initialApiKey) {
            return t('settings.apiKey.description', uiLang);
        }
        if (keySource === 'env') return t('settings.apiKey.source.env', uiLang);
        if (keySource === 'storage') return t('settings.apiKey.source.storage', uiLang);
        return t('settings.apiKey.source.none', uiLang);
    };

    return (
        <GlassCard className="mb-8">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{t('settings.title', uiLang)}</h2>
                
                <div className="space-y-2">
                    <label htmlFor="api-key" className="block text-sm font-medium" style={{color: 'var(--text-color-secondary)'}}>
                        {t('settings.apiKey.label', uiLang)}
                    </label>
                    <Input
                        id="api-key"
                        type="password" // Use password type to obscure the key
                        placeholder={t('settings.apiKey.placeholder', uiLang)}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                     <p className="text-xs" style={{ color: 'var(--text-color-secondary)' }}>
                        {getSourceLabel()}
                    </p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="api-host" className="block text-sm font-medium" style={{color: 'var(--text-color-secondary)'}}>
                        {t('settings.host.label', uiLang)}
                    </label>
                    <Input
                        id="api-host"
                        type="text"
                        placeholder={t('settings.host.placeholder', uiLang)}
                        value={apiHost}
                        onChange={(e) => setApiHost(e.target.value)}
                    />
                     <p className="text-xs" style={{ color: 'var(--text-color-secondary)' }}>
                        {t('settings.host.description', uiLang)}
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button onClick={handleSave} disabled={!canSave}>
                        {isSaved ? <div className="flex items-center gap-2"><CheckIcon className="w-5 h-5" /> {t('common.saved', uiLang)}</div> : t('common.save', uiLang)}
                    </Button>
                </div>
            </div>
        </GlassCard>
    );
};

export default Settings;