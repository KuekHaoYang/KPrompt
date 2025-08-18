
import React, { useState, useCallback } from 'react';
import { getOptimizationAdvice, applyOptimizationAdvice } from '../services/geminiService';
import GlassCard from './GlassCard';
import Button from './Button';
import TextArea from './TextArea';
import Loader from './Loader';
import { CopyIcon, CheckIcon, SparklesIcon } from './Icon';

type PromptType = 'system' | 'user';

interface OptimizationAdvisorProps {
  modelName: string;
  language: string;
  variables: string[];
}

interface AdviceSectionProps {
  title: string;
  promptType: PromptType;
  advice: string[];
  originalPrompt: string;
  onCopyAdvice: (type: PromptType) => void;
  onApplyAdvice: (type: PromptType) => void;
  isRefining: boolean;
  refinedPrompt: string | null;
  onCopyRefined: (type: PromptType) => void;
  copiedAdvice: boolean;
  copiedRefined: boolean;
}

const AdviceSection: React.FC<AdviceSectionProps> = ({
  title, promptType, advice, onCopyAdvice, onApplyAdvice, isRefining,
  refinedPrompt, onCopyRefined, copiedAdvice, copiedRefined
}) => (
  <div className="mt-6 space-y-3 fade-in pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <button 
        onClick={() => onCopyAdvice(promptType)} 
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]" 
        style={{ color: 'var(--text-color-secondary)', borderColor: 'var(--glass-border)' }}
        aria-label={`Copy ${promptType} prompt suggestions`}
      >
        {copiedAdvice ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
        {copiedAdvice ? 'Copied' : 'Copy Suggestions'}
      </button>
    </div>
    <div className="p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
      <ul className="space-y-2 list-disc list-inside text-sm" style={{ color: 'var(--text-color)' }}>
        {advice.map((point, index) => <li key={index}>{point}</li>)}
      </ul>
    </div>
    <Button onClick={() => onApplyAdvice(promptType)} disabled={isRefining}>
      {isRefining
        ? <Loader />
        : <div className="flex items-center gap-2"><SparklesIcon className="w-5 h-5" /> Apply Advice & Refine</div>
      }
    </Button>

    {refinedPrompt && (
      <div className="mt-4 space-y-3 fade-in">
        <h4 className="text-lg font-semibold">Refined {promptType === 'system' ? 'System' : 'User'} Prompt:</h4>
        <div className="relative p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <button onClick={() => onCopyRefined(promptType)} className="absolute top-2 right-2 p-2 rounded-full transition hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]" style={{ background: 'var(--glass-bg)', color: 'var(--text-color-secondary)' }} aria-label={`Copy refined ${promptType} prompt`}>
            {copiedRefined ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
          </button>
          <pre className="whitespace-pre-wrap break-words text-sm font-sans" style={{ color: 'var(--text-color)' }}>
            {refinedPrompt}
          </pre>
        </div>
      </div>
    )}
  </div>
);


const OptimizationAdvisor: React.FC<OptimizationAdvisorProps> = ({ modelName, language, variables }) => {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [advice, setAdvice] = useState<{ system: string[]; user: string[] } | null>(null);
  const [refinedPrompts, setRefinedPrompts] = useState<{ system: string | null; user: string | null }>({ system: null, user: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState<PromptType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedAdvice, setCopiedAdvice] = useState<PromptType | null>(null);
  const [copiedRefined, setCopiedRefined] = useState<PromptType | null>(null);

  const handleGetAdvice = useCallback(async () => {
    if (!systemPrompt.trim() && !userPrompt.trim()) {
      setError('Please enter at least one prompt to get advice on.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    setRefinedPrompts({ system: null, user: null });
    
    try {
      const advicePromises: Promise<string>[] = [];
      const promptTypes: PromptType[] = [];

      if (systemPrompt.trim()) {
        advicePromises.push(getOptimizationAdvice(systemPrompt, 'system', modelName, language, variables));
        promptTypes.push('system');
      }
      if (userPrompt.trim()) {
        advicePromises.push(getOptimizationAdvice(userPrompt, 'user', modelName, language, variables));
        promptTypes.push('user');
      }

      const results = await Promise.all(advicePromises);
      const newAdvice: { system: string[]; user: string[] } = { system: [], user: [] };

      results.forEach((result, index) => {
        const type = promptTypes[index];
        const adviceList = result.split('\n').map(s => s.replace(/^[*-]\s*/, '').trim()).filter(Boolean);
        newAdvice[type] = adviceList;
      });

      setAdvice(newAdvice);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [systemPrompt, userPrompt, modelName, language, variables]);

  const handleApplyAdvice = useCallback(async (type: PromptType) => {
    if (!advice) return;

    const originalPrompt = type === 'system' ? systemPrompt : userPrompt;
    const adviceToApply = type === 'system' ? advice.system : advice.user;

    if (!originalPrompt.trim() || adviceToApply.length === 0) return;

    setIsRefining(type);
    setError(null);

    try {
      const result = await applyOptimizationAdvice(originalPrompt, adviceToApply, type, modelName, language, variables);
      setRefinedPrompts(prev => ({ ...prev, [type]: result }));
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsRefining(null);
    }
  }, [systemPrompt, userPrompt, advice, modelName, language, variables]);

  const handleCopyAdvice = useCallback((type: PromptType) => {
    if (!advice) return;
    const adviceText = (type === 'system' ? advice.system : advice.user).join('\n');
    navigator.clipboard.writeText(adviceText);
    setCopiedAdvice(type);
    setTimeout(() => setCopiedAdvice(null), 2000);
  }, [advice]);

  const handleCopyRefined = useCallback((type: PromptType) => {
    const promptToCopy = type === 'system' ? refinedPrompts.system : refinedPrompts.user;
    if (promptToCopy) {
      navigator.clipboard.writeText(promptToCopy);
      setCopiedRefined(type);
      setTimeout(() => setCopiedRefined(null), 2000);
    }
  }, [refinedPrompts]);


  return (
    <GlassCard>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>Prompt Optimizer</h2>
        <p style={{ color: 'var(--text-color-secondary)' }}>
          Provide a system and/or user prompt to receive expert advice and generate refined versions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextArea
            id="system-prompt-to-analyze"
            placeholder="System Prompt (Optional)"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={5}
            disabled={isLoading || !!isRefining}
          />
          <TextArea
            id="user-prompt-to-analyze"
            placeholder="User Prompt (Optional)"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={5}
            disabled={isLoading || !!isRefining}
          />
        </div>
        
        <Button onClick={handleGetAdvice} disabled={isLoading || !!isRefining || (!systemPrompt.trim() && !userPrompt.trim())}>
          {isLoading ? <Loader /> : 'Get Advice'}
        </Button>
        
        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
        
        {advice && (
          <div>
            {advice.system.length > 0 && (
              <AdviceSection 
                title="System Prompt Suggestions"
                promptType="system"
                advice={advice.system}
                originalPrompt={systemPrompt}
                onCopyAdvice={handleCopyAdvice}
                onApplyAdvice={handleApplyAdvice}
                isRefining={isRefining === 'system'}
                refinedPrompt={refinedPrompts.system}
                onCopyRefined={handleCopyRefined}
                copiedAdvice={copiedAdvice === 'system'}
                copiedRefined={copiedRefined === 'system'}
              />
            )}
            {advice.user.length > 0 && (
               <AdviceSection 
                title="User Prompt Suggestions"
                promptType="user"
                advice={advice.user}
                originalPrompt={userPrompt}
                onCopyAdvice={handleCopyAdvice}
                onApplyAdvice={handleApplyAdvice}
                isRefining={isRefining === 'user'}
                refinedPrompt={refinedPrompts.user}
                onCopyRefined={handleCopyRefined}
                copiedAdvice={copiedAdvice === 'user'}
                copiedRefined={copiedRefined === 'user'}
              />
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default OptimizationAdvisor;
