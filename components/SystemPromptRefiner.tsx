

import React, { useState, useCallback } from 'react';
import { refineSystemPrompt, refineUserPrompt } from '../services/geminiService';
import GlassCard from './GlassCard';
import Button from './Button';
import TextArea from './TextArea';
import Loader from './Loader';
import { CopyIcon, CheckIcon } from './Icon';
import PromptTypeSelector, { PromptType } from './PromptTypeSelector';
import { UiLanguage, t } from '../services/translations';


interface SystemPromptRefinerProps {
  modelName: string;
  language: string;
  variables: string[];
  uiLang: UiLanguage;
  systemPromptRules: string;
}

const SystemPromptRefiner: React.FC<SystemPromptRefinerProps> = ({ modelName, language, variables, uiLang, systemPromptRules }) => {
  const [promptType, setPromptType] = useState<PromptType>('system');
  const [existingPrompt, setExistingPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!existingPrompt.trim()) {
      setError(t('error.enterPromptToRefine', uiLang, { promptType }));
      return;
    }
    setIsLoading(true);
    setError(null);
    setRefinedPrompt('');
    try {
      let result;
      if (promptType === 'system') {
        result = await refineSystemPrompt(existingPrompt, modelName, language, variables, systemPromptRules);
      } else {
        // For a general user prompt refiner, we pass empty context
        result = await refineUserPrompt('', '', existingPrompt, modelName, language, variables, systemPromptRules);
      }
      setRefinedPrompt(result);
    } catch (e: any) {
      setError(e.message || t('error.unknown', uiLang));
    } finally {
      setIsLoading(false);
    }
  }, [existingPrompt, modelName, language, variables, promptType, uiLang, systemPromptRules]);

  const handleCopy = useCallback(() => {
    if (refinedPrompt) {
      navigator.clipboard.writeText(refinedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [refinedPrompt]);

  const titleText = t(promptType === 'system' ? 'refiner.system.title' : 'refiner.user.title', uiLang);
  const descriptionText = t(promptType === 'system' ? 'refiner.system.description' : 'refiner.user.description', uiLang);
  const placeholderText = t(promptType === 'system' ? 'refiner.system.placeholder' : 'refiner.user.placeholder', uiLang);
  const buttonText = t(promptType === 'system' ? 'refiner.system.button' : 'refiner.user.button', uiLang);
  const refinedTitle = t('refiner.refined.title', uiLang, { promptType: t(promptType === 'system' ? 'refiner.promptType.system' : 'refiner.promptType.user', uiLang) });


  return (
    <GlassCard>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{titleText}</h2>
        <p style={{ color: 'var(--text-color-secondary)' }}>
          {descriptionText}
        </p>

        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{color: 'var(--text-color-secondary)'}}>
            {t('refiner.promptType', uiLang)}
          </label>
          <PromptTypeSelector promptType={promptType} onChange={setPromptType} uiLang={uiLang} />
        </div>
        
        <TextArea
          id="existing-prompt-to-refine"
          placeholder={placeholderText}
          value={existingPrompt}
          onChange={(e) => setExistingPrompt(e.target.value)}
          rows={4}
          disabled={isLoading}
        />
        
        <Button onClick={handleSubmit} disabled={isLoading || !existingPrompt.trim()}>
          {isLoading ? <Loader /> : buttonText}
        </Button>
        
        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
        
        {refinedPrompt && (
          <div className="mt-6 space-y-3 fade-in">
            <h3 className="text-xl font-semibold">{refinedTitle}</h3>
            <div className="relative p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-full transition hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]" style={{ background: 'var(--glass-bg)', color: 'var(--text-color-secondary)' }} aria-label={t('common.copyPrompt', uiLang)}>
                {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
              </button>
              <pre className="whitespace-pre-wrap break-words text-sm font-sans" style={{ color: 'var(--text-color)' }}>
                {refinedPrompt}
              </pre>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default SystemPromptRefiner;
