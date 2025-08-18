import React, { useState, useCallback } from 'react';
import { refineSystemPrompt, refineUserPrompt } from '../services/geminiService';
import GlassCard from './GlassCard';
import Button from './Button';
import TextArea from './TextArea';
import Loader from './Loader';
import { CopyIcon, CheckIcon } from './Icon';
import PromptTypeSelector, { PromptType } from './PromptTypeSelector';

interface SystemPromptRefinerProps {
  modelName: string;
  language: string;
  variables: string[];
}

const SystemPromptRefiner: React.FC<SystemPromptRefinerProps> = ({ modelName, language, variables }) => {
  const [promptType, setPromptType] = useState<PromptType>('system');
  const [existingPrompt, setExistingPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!existingPrompt.trim()) {
      setError(`Please enter an existing ${promptType} prompt to refine.`);
      return;
    }
    setIsLoading(true);
    setError(null);
    setRefinedPrompt('');
    try {
      let result;
      if (promptType === 'system') {
        result = await refineSystemPrompt(existingPrompt, modelName, language, variables);
      } else {
        // For a general user prompt refiner, we pass empty context
        result = await refineUserPrompt('', '', existingPrompt, modelName, language, variables);
      }
      setRefinedPrompt(result);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [existingPrompt, modelName, language, variables, promptType]);

  const handleCopy = useCallback(() => {
    if (refinedPrompt) {
      navigator.clipboard.writeText(refinedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [refinedPrompt]);

  const titleText = promptType === 'system' ? 'System Prompt Refiner' : 'User Prompt Refiner';
  const descriptionText = promptType === 'system' 
    ? "Input an existing system prompt. We'll optimize it for clarity, structure, and performance."
    : "Input an existing user prompt. We'll refine it for clarity, intent, and effectiveness.";
  const placeholderText = promptType === 'system'
    ? "Paste your existing system prompt here..."
    : "Paste your existing user prompt here...";
  const buttonText = promptType === 'system' ? 'Refine System Prompt' : 'Refine User Prompt';

  return (
    <GlassCard>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{titleText}</h2>
        <p style={{ color: 'var(--text-color-secondary)' }}>
          {descriptionText}
        </p>

        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{color: 'var(--text-color-secondary)'}}>
            Prompt Type
          </label>
          <PromptTypeSelector promptType={promptType} onChange={setPromptType} />
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
            <h3 className="text-xl font-semibold">Refined {promptType === 'system' ? 'System' : 'User'} Prompt:</h3>
            <div className="relative p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-full transition hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]" style={{ background: 'var(--glass-bg)', color: 'var(--text-color-secondary)' }} aria-label="Copy refined prompt">
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
