import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import Input from './Input';
import { CheckIcon } from './Icon';

const API_KEY_ENV = process.env.API_KEY;

const Settings: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const [apiHost, setApiHost] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const isKeyInEnv = !!API_KEY_ENV;

    useEffect(() => {
        if (!isKeyInEnv) {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) {
                setApiKey(savedKey);
            }
        }
        const savedHost = localStorage.getItem('gemini_api_host');
        setApiHost(savedHost || 'generativelanguage.googleapis.com');
    }, [isKeyInEnv]);

    const handleSave = () => {
        if (!isKeyInEnv) {
            localStorage.setItem('gemini_api_key', apiKey);
        }
        localStorage.setItem('gemini_api_host', apiHost);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        // Force model list refetch after settings change
        window.dispatchEvent(new Event('settings_updated'));
    };

    const canSave = (!isKeyInEnv && apiKey.trim() !== '') || apiHost.trim() !== '';

    return (
        <GlassCard className="mb-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>API Configuration</h2>
                <p style={{ color: 'var(--text-color-secondary)' }}>
                    Your API key is stored locally in your browser and is not sent anywhere except to the configured API host.
                </p>

                <div className="space-y-2">
                    <label htmlFor="api-key" className="block text-sm font-medium" style={{color: 'var(--text-color-secondary)'}}>
                        Gemini API Key
                    </label>
                    <Input
                        id="api-key"
                        type="password"
                        placeholder={isKeyInEnv ? "Using API Key from environment" : "Enter your Gemini API Key"}
                        value={isKeyInEnv ? "" : apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        disabled={isKeyInEnv}
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="api-host" className="block text-sm font-medium" style={{color: 'var(--text-color-secondary)'}}>
                        API Host
                    </label>
                    <Input
                        id="api-host"
                        type="text"
                        value={apiHost}
                        onChange={(e) => setApiHost(e.target.value)}
                    />
                     <p className="text-xs" style={{ color: 'var(--text-color-secondary)' }}>
                        Custom host used for all API requests, including model fetching and prompt generation.
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button onClick={handleSave} disabled={!canSave}>
                        {isSaved ? <div className="flex items-center gap-2"><CheckIcon className="w-5 h-5" /> Saved</div> : 'Save Settings'}
                    </Button>
                </div>
            </div>
        </GlassCard>
    );
};

export default Settings;