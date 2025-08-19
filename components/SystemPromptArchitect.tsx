import React, { useState, useCallback } from 'react';
import { generateSystemPrompt, getSystemPromptThinkingPoints } from '../services/geminiService';
import GlassCard from './GlassCard';
import Button from './Button';
import TextArea from './TextArea';
import Loader from './Loader';
import { CopyIcon, CheckIcon, SparklesIcon, TrashIcon } from './Icon';
import { UiLanguage, t } from '../services/translations';

interface SystemPromptArchitectProps {
  modelName: string;
  language: string;
  variables: string[];
  uiLang: UiLanguage;
}

const SystemPromptArchitect: React.FC<SystemPromptArchitectProps> = ({ modelName, language, variables, uiLang }) => {
  const [description, setDescription] = useState('');
  const [thinkingPoints, setThinkingPoints] = useState<string[] | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const [isLoadingPoints, setIsLoadingPoints] = useState(false);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGetPoints = useCallback(async () => {
    if (!description.trim()) {
      setError(t('error.enterDescription', uiLang));
      return;
    }
    setIsLoadingPoints(true);
    setError(null);
    setThinkingPoints(null);
    setGeneratedPrompt('');

    try {
      const result = await getSystemPromptThinkingPoints(description, modelName, language, variables);
      const points = result.split('\n').map(s => s.replace(/^[*-]\s*/, '').trim()).filter(Boolean);
      setThinkingPoints(points);
    } catch (e: any) {
      setError(e.message || t('error.unknown', uiLang));
    } finally {
      setIsLoadingPoints(false);
    }
  }, [description, modelName, language, variables, uiLang]);

  const handleGeneratePrompt = useCallback(async () => {
    if (!thinkingPoints || thinkingPoints.every(p => p.trim() === '')) {
      setError('Please generate and review key directives first.');
      return;
    }
    setIsLoadingPrompt(true);
    setError(null);
    setGeneratedPrompt('');
    try {
      const result = await generateSystemPrompt(description, modelName, language, variables, thinkingPoints);
      setGeneratedPrompt(result);
    } catch (e: any) {
      setError(e.message || t('error.unknown', uiLang));
    } finally {
      setIsLoadingPrompt(false);
    }
  }, [description, modelName, language, variables, thinkingPoints, uiLang]);

  const handleUpdatePoint = (index: number, value: string) => {
    if (thinkingPoints) {
      const newPoints = [...thinkingPoints];
      newPoints[index] = value;
      setThinkingPoints(newPoints);
    }
  };
  
  const handleRemovePoint = (index: number) => {
    if (thinkingPoints) {
      const newPoints = thinkingPoints.filter((_, i) => i !== index);
      setThinkingPoints(newPoints);
    }
  };

  const handleCopy = useCallback(() => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedPrompt]);
  
  const isLoading = isLoadingPoints || isLoadingPrompt;

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
        
        <Button onClick={handleGetPoints} disabled={isLoading || !description.trim()}>
          {isLoadingPoints ? <Loader /> : 'Get Key Directives'}
        </Button>

        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
        
        {thinkingPoints && (
          <div className="mt-6 space-y-3 fade-in pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            <h3 className="text-xl font-semibold">{'Key Directives (Editable)'}</h3>
            <div className="space-y-2">
              {thinkingPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <TextArea
                    id={`thinking-point-${index}`}
                    value={point}
                    onChange={(e) => handleUpdatePoint(index, e.target.value)}
                    rows={2}
                    className="text-sm !p-3"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleRemovePoint(index)}
                    className="p-3 rounded-full text-[color:var(--text-color-secondary)] hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)] hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label={`Remove directive ${index + 1}`}
                    disabled={isLoading}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <Button onClick={handleGeneratePrompt} disabled={isLoading || thinkingPoints.length === 0}>
                {isLoadingPrompt ? <Loader /> : <div className="flex items-center gap-2"><SparklesIcon className="w-5 h-5" /> {t('architect.button.generate', uiLang)}</div>}
            </Button>
          </div>
        )}
        
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