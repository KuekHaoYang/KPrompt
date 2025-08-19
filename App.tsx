
import React, { useState, useEffect, useCallback } from 'react';
import SystemPromptArchitect from './components/SystemPromptArchitect';
import ConversationalPromptRefiner from './components/ConversationalPromptRefiner';
import Header from './components/Header';
import Input from './components/Input';
import VariablesInput from './components/VariablesInput';
import OptimizationAdvisor from './components/OptimizationAdvisor';
import { t } from './locales';

const App: React.FC = () => {
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [uiLanguage, setUiLanguage] = useState('English'); // UI interface language
  const [outputLanguage, setOutputLanguage] = useState('English'); // AI output language
  const [variables, setVariables] = useState<string[]>([]);

  // Initialize languages from localStorage on component mount
  useEffect(() => {
    try {
      const savedUiLanguage = localStorage.getItem('kprompt.uiLanguage') || 'English';
      const savedOutputLanguage = localStorage.getItem('kprompt.outputLanguage') || 'English';
      setUiLanguage(savedUiLanguage);
      setOutputLanguage(savedOutputLanguage);
    } catch (error) {
      console.warn('Failed to load language preferences from localStorage:', error);
    }
  }, []);

  // Handle UI language change with localStorage persistence
  const handleUiLanguageChange = useCallback((newLanguage: string) => {
    setUiLanguage(newLanguage);
    try {
      localStorage.setItem('kprompt.uiLanguage', newLanguage);
    } catch (error) {
      console.warn('Failed to save UI language to localStorage:', error);
    }
  }, []);

  // Handle output language change with localStorage persistence
  const handleOutputLanguageChange = useCallback((newLanguage: string) => {
    setOutputLanguage(newLanguage);
    try {
      localStorage.setItem('kprompt.outputLanguage', newLanguage);
    } catch (error) {
      console.warn('Failed to save output language to localStorage:', error);
    }
  }, []);

  // Translation function bound to current UI language
  const translate = useCallback((key: string, interpolations?: Record<string, string>) => 
    t(uiLanguage, key, interpolations), [uiLanguage]);

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <Header language={uiLanguage} setLanguage={handleUiLanguageChange} t={translate} />
      <main className="container mx-auto mt-8">
        <div className="max-w-4xl mx-auto mb-10 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="model-name" className="block text-sm font-medium mb-2" style={{color: 'var(--text-color-secondary)'}}>
                    {translate('common.aiModel')}
                  </label>
                  <Input
                    id="model-name"
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder={translate('settings.aiModelPlaceholder')}
                  />
                  <p className="text-xs mt-2" style={{ color: 'var(--text-color-secondary)' }}>
                    {translate('settings.aiModelDescription')}
                  </p>
                </div>
                <div>
                  <label htmlFor="language-input" className="block text-sm font-medium mb-2" style={{color: 'var(--text-color-secondary)'}}>
                    {translate('common.outputLanguage')}
                  </label>
                  <Input
                    id="language-input"
                    type="text"
                    value={outputLanguage}
                    onChange={(e) => handleOutputLanguageChange(e.target.value)}
                    placeholder={translate('settings.outputLanguagePlaceholder')}
                  />
                   <p className="text-xs mt-2" style={{ color: 'var(--text-color-secondary)' }}>
                    {translate('settings.outputLanguageDescription')}
                  </p>
                </div>
            </div>
            <div>
              <VariablesInput variables={variables} onChange={setVariables} t={translate} />
            </div>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <SystemPromptArchitect modelName={modelName} language={outputLanguage} variables={variables} t={translate} />
            <ConversationalPromptRefiner modelName={modelName} language={outputLanguage} variables={variables} t={translate} />
          </div>
          <OptimizationAdvisor modelName={modelName} language={outputLanguage} variables={variables} t={translate} />
        </div>
      </main>
      <footer className="text-center py-8 mt-12">
        <p style={{ color: 'var(--text-color-secondary)' }} className="text-sm">
          {translate('app.footer')}
        </p>
      </footer>
    </div>
  );
};

export default App;
