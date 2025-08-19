
import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import Input from './Input';
import { CheckIcon } from './Icon';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  t: (key: string, interpolations?: Record<string, string>) => string;
  isApiKeyFromEnv: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange, t, isApiKeyFromEnv }) => {
  const [currentKey, setCurrentKey] = useState(apiKey);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCurrentKey(apiKey);
  }, [apiKey]);
  
  const handleSave = () => {
    onApiKeyChange(currentKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const canSave = currentKey !== apiKey && !isApiKeyFromEnv;

  return (
    <GlassCard>
      <div className="space-y-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>
          {t('settings.apiKeyTitle')}
        </h2>
        
        {isApiKeyFromEnv ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
              {t('settings.apiKeyFromEnv')}
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-color-secondary)' }}>
                {t('settings.apiKeyDescription')}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Input
                    id="api-key-input"
                    type="password"
                    placeholder={t('settings.apiKeyPlaceholder')}
                    value={currentKey}
                    onChange={(e) => setCurrentKey(e.target.value)}
                    className="flex-grow"
                    aria-label="API Key Input"
                />
                <Button onClick={handleSave} disabled={!canSave}>
                    {isSaved ? (
                        <div className="flex items-center gap-2">
                            <CheckIcon className="w-5 h-5" /> {t('common.saved')}
                        </div>
                    ) : (
                        t('common.save')
                    )}
                </Button>
            </div>
             {!apiKey && (
                <p className="text-yellow-500 text-sm font-medium">
                   {t('settings.apiKeyRequired')}
                </p>
            )}
          </>
        )}
      </div>
    </GlassCard>
  );
};

export default ApiKeyInput;
