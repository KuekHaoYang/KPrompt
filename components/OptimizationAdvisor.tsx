import React, { useState, useCallback } from 'react';
import { getOptimizationAdvice } from '../services/geminiService';
import GlassCard from './GlassCard';
import Button from './Button';
import TextArea from './TextArea';
import Loader from './Loader';
import PromptTypeSelector, { PromptType } from './PromptTypeSelector';

interface OptimizationAdvisorProps {
  modelName: string;
  language: string;
  variables: string[];
}

const OptimizationAdvisor: React.FC<OptimizationAdvisorProps> = ({ modelName, language, variables }) => {
  const [promptType, setPromptType] = useState<PromptType>('system');
  const [promptToAnalyze, setPromptToAnalyze] = useState('');
  const [advice, setAdvice] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!promptToAnalyze.trim()) {
      setError('Please enter a prompt to get advice on.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAdvice([]);
    try {
      const result = await getOptimizationAdvice(promptToAnalyze, promptType, modelName, language, variables);
      const adviceList = result.split('\n')
        .map(s => s.replace(/^[*-]\s*/, '').trim())
        .filter(Boolean);
      setAdvice(adviceList);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [promptToAnalyze, modelName, language, variables, promptType]);

  return (
    <GlassCard>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>Optimization Advisor</h2>
        <p style={{ color: 'var(--text-color-secondary)' }}>
          Get expert, actionable advice on how to improve any prompt.
        </p>

        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{color: 'var(--text-color-secondary)'}}>
            Prompt Type
          </label>
          <PromptTypeSelector promptType={promptType} onChange={setPromptType} />
        </div>
        
        <TextArea
          id="prompt-to-analyze"
          placeholder={`Paste any ${promptType} prompt here for analysis...`}
          value={promptToAnalyze}
          onChange={(e) => setPromptToAnalyze(e.target.value)}
          rows={4}
          disabled={isLoading}
        />
        
        <Button onClick={handleSubmit} disabled={isLoading || !promptToAnalyze.trim()}>
          {isLoading ? <Loader /> : 'Get Advice'}
        </Button>
        
        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
        
        {advice.length > 0 && (
          <div className="mt-6 space-y-3 fade-in">
            <h3 className="text-xl font-semibold">Optimization Suggestions:</h3>
            <div className="p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <ul className="space-y-2 list-disc list-inside text-sm" style={{ color: 'var(--text-color)' }}>
                {advice.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default OptimizationAdvisor;
