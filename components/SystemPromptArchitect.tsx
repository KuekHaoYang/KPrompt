
import React, { useState, useCallback } from 'react';
import { generateSystemPrompt, getSystemPromptThinkingPoints, getOptimizationAdvice, applyOptimizationAdvice } from '../services/geminiService';
import GlassCard from './GlassCard';
import Button from './Button';
import TextArea from './TextArea';
import Loader from './Loader';
import { CopyIcon, CheckIcon, TrashIcon, ChevronDownIcon, SparklesIcon } from './Icon';
import { UiLanguage, t } from '../services/translations';

// Props for the main component
interface SystemPromptArchitectProps {
  modelName: string;
  language: string;
  variables: string[];
  uiLang: UiLanguage;
}

// Props for the internal CollapsibleStep component
interface CollapsibleStepProps {
  step: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleStep: React.FC<CollapsibleStepProps> = ({ step, title, isCompleted, isActive, isOpen, onToggle, children }) => {
  return (
    <div className={`transition-all duration-500 ease-in-out border-b ${isOpen ? 'pb-6' : ''}`} style={{ borderColor: 'var(--glass-border)' }}>
      <button onClick={onToggle} className="flex justify-between items-center w-full py-4 text-left">
        <div className="flex items-center gap-4">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-[color:var(--accent-color)] text-white' : 'bg-[color:var(--glass-bg)] border border-[color:var(--glass-border)] text-[color:var(--text-color-secondary)]'}`}
          >
            {isCompleted ? <CheckIcon className="w-5 h-5" /> : step}
          </div>
          <h3 className={`text-lg font-semibold transition-colors ${isActive || isCompleted ? 'text-[color:var(--text-color)]' : 'text-[color:var(--text-color-secondary)]'}`}>
            {title}
          </h3>
        </div>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      <div 
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{
            maxHeight: isOpen ? '2000px' : '0px',
            opacity: isOpen ? 1 : 0
        }}
      >
        <div className="pl-12 pt-2">
            {children}
        </div>
      </div>
    </div>
  );
};

const SystemPromptArchitect: React.FC<SystemPromptArchitectProps> = ({ modelName, language, variables, uiLang }) => {
  // State for each step's data
  const [description, setDescription] = useState('');
  const [thinkingPoints, setThinkingPoints] = useState<string[] | null>(null);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string[] | null>(null);
  const [finalPrompt, setFinalPrompt] = useState<string | null>(null);

  // UI State
  const [loadingStep, setLoadingStep] = useState<number | null>(null);
  const [automationStatus, setAutomationStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [openStep, setOpenStep] = useState<number>(1);
  
  const handleSetOpenStep = (step: number) => {
    setOpenStep(openStep === step ? 0 : step);
  }
  
  const resetState = () => {
    setThinkingPoints(null);
    setInitialPrompt(null);
    setAdvice(null);
    setFinalPrompt(null);
    setCompletedSteps([]);
    setError(null);
  };


  // API Call Handlers
  const handleGetPoints = useCallback(async () => {
    if (!description.trim()) {
      setError(t('error.enterDescription', uiLang));
      return;
    }
    setLoadingStep(1);
    resetState();
    try {
      const result = await getSystemPromptThinkingPoints(description, modelName, language, variables);
      const points = result.split('\n').map(s => s.replace(/^[*-]\s*/, '').trim()).filter(Boolean);
      setThinkingPoints(points);
      setCompletedSteps([1]);
      setOpenStep(2);
    } catch (e: any) {
      setError(e.message || t('error.unknown', uiLang));
    } finally {
      setLoadingStep(null);
    }
  }, [description, modelName, language, variables, uiLang]);

  const handleGenerateInitialPrompt = useCallback(async () => {
    if (!thinkingPoints || thinkingPoints.every(p => p.trim() === '')) {
      setError('Please provide at least one key directive.');
      return;
    }
    setLoadingStep(2);
    setError(null);
    try {
      const result = await generateSystemPrompt(description, modelName, language, variables, thinkingPoints);
      setInitialPrompt(result);
      setCompletedSteps([1, 2]);
      setOpenStep(3);
      // Automatically trigger the next step
      await handleGetAdvice(result);
    } catch (e: any) {
      setError(e.message || t('error.unknown', uiLang));
    } finally {
      setLoadingStep(null);
    }
  }, [description, modelName, language, variables, thinkingPoints, uiLang]);

  const handleGetAdvice = useCallback(async (promptToAnalyze: string) => {
    setLoadingStep(3);
    setError(null);
    try {
        const result = await getOptimizationAdvice(promptToAnalyze, 'system', modelName, language, variables);
        const adviceList = result.split('\n').map(s => s.replace(/^[*-]\s*/, '').trim()).filter(Boolean);
        setAdvice(adviceList);
        setCompletedSteps([1, 2, 3]);
        setOpenStep(4);
        // Automatically trigger the final step
        await handleGenerateFinalPrompt(promptToAnalyze, adviceList);
    } catch (e: any) {
        setError(e.message || t('error.unknown', uiLang));
        setOpenStep(3);
    } finally {
        setLoadingStep(null);
    }
  }, [modelName, language, variables, uiLang]);

  const handleGenerateFinalPrompt = useCallback(async (originalPrompt: string, adviceToApply: string[]) => {
    setLoadingStep(4);
    setError(null);
    try {
        const result = await applyOptimizationAdvice(originalPrompt, adviceToApply, 'system', modelName, language, variables);
        setFinalPrompt(result);
        setCompletedSteps([1, 2, 3, 4]);
        setOpenStep(4); // Keep the final step open
    } catch (e: any) {
        setError(e.message || t('error.unknown', uiLang));
    } finally {
        setLoadingStep(null);
    }
  }, [modelName, language, variables, uiLang]);
  
  const handleAutomaticGeneration = useCallback(async () => {
    if (!description.trim()) {
      setError(t('error.enterDescription', uiLang));
      return;
    }
    setLoadingStep(0); // Special loading state for automation
    resetState();
    setOpenStep(1);

    try {
      // Step 1
      setAutomationStatus('Step 1/4: Generating Key Directives...');
      const pointsResult = await getSystemPromptThinkingPoints(description, modelName, language, variables);
      const points = pointsResult.split('\n').map(s => s.replace(/^[*-]\s*/, '').trim()).filter(Boolean);
      setThinkingPoints(points);
      setCompletedSteps([1]);

      // Step 2
      setAutomationStatus('Step 2/4: Generating Initial Prompt...');
      const initialPromptResult = await generateSystemPrompt(description, modelName, language, variables, points);
      setInitialPrompt(initialPromptResult);
      setCompletedSteps([1, 2]);

      // Step 3
      setAutomationStatus('Step 3/4: Getting Optimization Advice...');
      const adviceResult = await getOptimizationAdvice(initialPromptResult, 'system', modelName, language, variables);
      const adviceList = adviceResult.split('\n').map(s => s.replace(/^[*-]\s*/, '').trim()).filter(Boolean);
      setAdvice(adviceList);
      setCompletedSteps([1, 2, 3]);

      // Step 4
      setAutomationStatus('Step 4/4: Generating Final Refined Prompt...');
      const finalPromptResult = await applyOptimizationAdvice(initialPromptResult, adviceList, 'system', modelName, language, variables);
      setFinalPrompt(finalPromptResult);
      setCompletedSteps([1, 2, 3, 4]);
      
      setOpenStep(4); // Open the final step

    } catch (e: any) {
      setError(e.message || t('error.unknown', uiLang));
    } finally {
      setLoadingStep(null);
      setAutomationStatus(null);
    }
  }, [description, modelName, language, variables, uiLang]);


  const handleCopy = useCallback(() => {
    const promptToCopy = finalPrompt || initialPrompt;
    if (promptToCopy) {
      navigator.clipboard.writeText(promptToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [finalPrompt, initialPrompt]);

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
  
  const isBusy = loadingStep !== null;

  return (
    <GlassCard>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{t('architect.title', uiLang)}</h2>
        <p style={{ color: 'var(--text-color-secondary)' }}>
          {t('architect.description', uiLang)}
        </p>

        {error && <p className="text-red-500 text-sm my-4 font-medium">{error}</p>}

        <div className="space-y-2">
            {/* Step 1: Description */}
            <CollapsibleStep step={1} title="Describe AI Persona" isCompleted={completedSteps.includes(1)} isActive={openStep === 1} isOpen={openStep === 1} onToggle={() => handleSetOpenStep(1)}>
                <TextArea id="persona-description" placeholder={t('architect.placeholder', uiLang)} value={description} onChange={(e) => setDescription(e.target.value)} rows={4} disabled={isBusy} />
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                    <Button onClick={handleGetPoints} disabled={isBusy || !description.trim()}>
                        {loadingStep === 1 ? <Loader /> : 'Get Key Directives'}
                    </Button>
                    <Button onClick={handleAutomaticGeneration} disabled={isBusy || !description.trim()}>
                        {loadingStep === 0 ? <Loader /> : <div className="flex items-center gap-2"><SparklesIcon className="w-5 h-5" /> Automate & Generate</div>}
                    </Button>
                </div>
                {loadingStep === 0 && automationStatus && (
                    <div className="mt-4 text-sm text-[color:var(--text-color-secondary)] flex items-center gap-2 fade-in p-3 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                        <Loader />
                        <span>{automationStatus}</span>
                    </div>
                )}
            </CollapsibleStep>
            
            {/* Step 2: Key Directives -> Initial Prompt */}
            {completedSteps.includes(1) && (
                <CollapsibleStep step={2} title="Review Directives & Generate" isCompleted={completedSteps.includes(2)} isActive={openStep === 2} isOpen={openStep === 2} onToggle={() => handleSetOpenStep(2)}>
                   <div className="space-y-2">
                      {thinkingPoints?.map((point, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <TextArea id={`thinking-point-${index}`} value={point} onChange={(e) => handleUpdatePoint(index, e.target.value)} rows={2} className="text-sm !p-3" disabled={isBusy} />
                          <button onClick={() => handleRemovePoint(index)} className="p-3 rounded-full text-[color:var(--text-color-secondary)] hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)] hover:text-red-500 transition-colors flex-shrink-0" disabled={isBusy} aria-label={`Remove directive ${index + 1}`}><TrashIcon className="w-5 h-5" /></button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleGenerateInitialPrompt} disabled={isBusy || !thinkingPoints || thinkingPoints.length === 0} className="mt-4">
                        {loadingStep === 2 ? <Loader /> : 'Generate Initial Prompt'}
                    </Button>
                </CollapsibleStep>
            )}

            {/* Step 3: Optimization Advice */}
            {completedSteps.includes(2) && (
                 <CollapsibleStep step={3} title="Analyze & Advise" isCompleted={completedSteps.includes(3)} isActive={openStep === 3} isOpen={openStep === 3} onToggle={() => handleSetOpenStep(3)}>
                    <p className="text-sm text-[color:var(--text-color-secondary)] mb-2">The initial prompt has been generated. Now, an AI agent is analyzing it to provide optimization advice.</p>
                    {loadingStep === 3 && <div className="flex items-center gap-2 text-sm text-[color:var(--text-color-secondary)]"><Loader /> Analyzing...</div>}
                    {advice && <p className="text-sm font-semibold text-green-500">Analysis complete. Refining prompt...</p>}
                 </CollapsibleStep>
            )}

            {/* Step 4: Final Prompt */}
            {completedSteps.includes(3) && (
                 <CollapsibleStep step={4} title="Final Refined Prompt" isCompleted={completedSteps.includes(4)} isActive={openStep === 4} isOpen={openStep === 4} onToggle={() => handleSetOpenStep(4)}>
                    <p className="text-sm text-[color:var(--text-color-secondary)] mb-4">The final prompt has been engineered by applying the optimization advice to the initial draft.</p>
                     {loadingStep === 4 && <div className="flex items-center gap-2 text-sm text-[color:var(--text-color-secondary)]"><Loader /> Refining...</div>}
                     {finalPrompt && (
                        <div className="relative p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-full transition hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]" style={{ background: 'var(--glass-bg)', color: 'var(--text-color-secondary)' }} aria-label={t('common.copyPrompt', uiLang)}>
                                {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                            </button>
                            <pre className="whitespace-pre-wrap break-words text-sm font-sans" style={{ color: 'var(--text-color)' }}>
                                {finalPrompt}
                            </pre>
                        </div>
                     )}
                 </CollapsibleStep>
            )}

        </div>
      </div>
    </GlassCard>
  );
};

export default SystemPromptArchitect;
