
import React, { useState, useEffect } from 'react';
import SystemPromptArchitect from './components/SystemPromptArchitect';
import ConversationalPromptRefiner from './components/ConversationalPromptRefiner';
import Header from './components/Header';
import Input from './components/Input';
import TextArea from './components/TextArea';
import VariablesInput from './components/VariablesInput';
import OptimizationAdvisor from './components/OptimizationAdvisor';
import Settings from './components/Settings';
import Button from './components/Button';
import { t, UiLanguage } from './services/translations';

const App: React.FC = () => {
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [variables, setVariables] = useState<string[]>([]);
  const [uiLang, setUiLang] = useState<UiLanguage>('en');
  const [showSettings, setShowSettings] = useState(false);
  const [systemPromptRules, setSystemPromptRules] = useState('');

  useEffect(() => {
    // Basic language detection on load
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'zh') {
      setUiLang('zh');
    }

    // Load the system prompt rules from the local file
    fetch('/prompts/systemPromptRules.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(text => setSystemPromptRules(text))
      .catch(error => console.error('Failed to load system prompt rules:', error));
  }, []);

  const aiLanguage = uiLang === 'en' ? 'English' : 'Chinese';

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <Header uiLang={uiLang} onLangChange={setUiLang} />
      <main className="container mx-auto mt-8">
        <div className="max-w-4xl mx-auto mb-10 space-y-8">
            <div className="text-center">
                 <Button onClick={() => setShowSettings(!showSettings)}>
                    {showSettings ? t('common.hideSettings', uiLang) : t('common.showSettings', uiLang)}
                </Button>
            </div>
            
            {showSettings && (
                <div className="fade-in">
                    <Settings />
                </div>
            )}
            
            <div className="grid grid-cols-1">
                <div>
                  <label htmlFor="model-name" className="block text-sm font-medium mb-2" style={{color: 'var(--text-color-secondary)'}}>
                    {t('config.model', uiLang)}
                  </label>
                  <Input
                    id="model-name"
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g., gemini-2.5-flash"
                  />
                  <p className="text-xs mt-2" style={{ color: 'var(--text-color-secondary)' }}>
                    {t('config.model.description', uiLang)}
                  </p>
                </div>
            </div>
            <div>
              <VariablesInput variables={variables} onChange={setVariables} uiLang={uiLang} />
            </div>
             <div>
              <label htmlFor="system-prompt-rules" className="block text-sm font-medium mb-2" style={{color: 'var(--text-color-secondary)'}}>
                {t('config.systemRules', uiLang)}
              </label>
              <TextArea
                id="system-prompt-rules"
                value={systemPromptRules}
                onChange={(e) => setSystemPromptRules(e.target.value)}
                rows={10}
              />
              <p className="text-xs mt-2" style={{ color: 'var(--text-color-secondary)' }}>
                {t('config.systemRules.description', uiLang)}
              </p>
            </div>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <SystemPromptArchitect modelName={modelName} language={aiLanguage} variables={variables} uiLang={uiLang} systemPromptRules={systemPromptRules} />
            <ConversationalPromptRefiner modelName={modelName} language={aiLanguage} variables={variables} uiLang={uiLang} systemPromptRules={systemPromptRules} />
          </div>
          <OptimizationAdvisor modelName={modelName} language={aiLanguage} variables={variables} uiLang={uiLang} systemPromptRules={systemPromptRules} />
        </div>
      </main>
      <footer className="text-center py-8 mt-12">
        <p style={{ color: 'var(--text-color-secondary)' }} className="text-sm">
          {t('footer.text', uiLang)}
        </p>
      </footer>
    </div>
  );
};

export default App;
