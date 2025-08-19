
import React, { useState, useCallback } from 'react';
import { generateSystemPrompt } from '../services/geminiService';
import GlassCard from './GlassCard';
import Button from './Button';
import TextArea from './TextArea';
import Loader from './Loader';
import { CopyIcon, CheckIcon } from './Icon';
import { UiLanguage, t } from '../services/translations';

interface SystemPromptArchitectProps {
  modelName: string;
  language: string;
  variables: string[];
  uiLang: UiLanguage;
}

const SystemPromptArchitect: React.FC<SystemPromptArchitectProps> = ({ modelName, language, variables, uiLang }) => {
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!description.trim()) {
      setError(t('error.enterDescription', uiLang));
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    try {
      const result = await generateSystemPrompt(description, modelName, language, variables);
      setGeneratedPrompt(result);
    } catch (e: any) {
      setError(e.message || t('error.unknown', uiLang));
    } finally {
      setIsLoading(false);
    }
  }, [description, modelName, language, variables, uiLang]);

  const handleCopy = useCallback(() => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedPrompt]);

  return (
    <GlassCard>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{t('architect.title', uiLang)}</h2>
        <p style={{ color: 'var(--text-color-secondary)' }}>
          {t('architect.description', uiLang)}
        </p>
        
        <TextArea
          id="persona-description"
          placeholder={t('architect.placeholder', uiLang)}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={isLoading}
        />
        
        <Button onClick={handleSubmit} disabled={isLoading || !description.trim()}>
          {isLoading ? <Loader /> : t('architect.button.generate', uiLang)}
        </Button>
        
        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
        
        {generatedPrompt && (
          <div className="mt-6 space-y-3 fade-in">
            <h3 className="text-xl font-semibold">{t('architect.generated.title', uiLang)}</h3>
            <div className="relative p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-full transition hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]" style={{ background: 'var(--glass-bg)', color: 'var(--text-color-secondary)' }} aria-label={t('common.copyPrompt', uiLang)}>
                {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
              </button>
              <pre className="whitespace-pre-wrap break-words text-sm font-sans" style={{ color: 'var(--text-color)' }}>
                {generatedPrompt}
              </pre>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default SystemPromptArchitect;
