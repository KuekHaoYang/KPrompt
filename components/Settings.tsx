import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import Input from './Input';
import { CheckIcon } from './Icon';

const Settings: React.FC = () => {
    const [apiHost, setApiHost] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [initialHost, setInitialHost] = useState('');

    useEffect(() => {
        const savedHost = localStorage.getItem('gemini_api_host');
        // If null, it means it's not set. We can treat it as empty string for our purpose
        const currentHost = savedHost ?? ''; 
        setApiHost(currentHost);
        setInitialHost(currentHost);
    }, []);

    const handleSave = () => {
        localStorage.setItem('gemini_api_host', apiHost);
        setInitialHost(apiHost);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        // This event is for the (currently unused) ModelSelector to refetch.
        // Kept for potential future use.
        window.dispatchEvent(new Event('settings_updated'));
    };

    const canSave = apiHost !== initialHost;

    return (
        <GlassCard className="mb-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>API Configuration</h2>
                <p style={{ color: 'var(--text-color-secondary)' }}>
                    The Google Gemini API key is configured securely via an environment variable.
                </p>

                <div className="space-y-2">
                    <label htmlFor="api-host" className="block text-sm font-medium" style={{color: 'var(--text-color-secondary)'}}>
                        API Host
                    </label>
                    <Input
                        id="api-host"
                        type="text"
                        placeholder="Default: generativelanguage.googleapis.com"
                        value={apiHost}
                        onChange={(e) => setApiHost(e.target.value)}
                    />
                     <p className="text-xs" style={{ color: 'var(--text-color-secondary)' }}>
                        Optional override for advanced use cases like proxies. Leave empty to use the default.
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
