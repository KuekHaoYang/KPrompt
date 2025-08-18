
import React, { useState } from 'react';
import SystemPromptArchitect from './components/SystemPromptArchitect';
import ConversationalPromptRefiner from './components/ConversationalPromptRefiner';
import Header from './components/Header';
import Input from './components/Input';
import VariablesInput from './components/VariablesInput';
import SystemPromptRefiner from './components/SystemPromptRefiner';
import OptimizationAdvisor from './components/OptimizationAdvisor';

const App: React.FC = () => {
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [language, setLanguage] = useState('English');
  const [variables, setVariables] = useState<string[]>([]);

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <Header />
      <main className="container mx-auto mt-8">
        <div className="max-w-4xl mx-auto mb-10 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="model-name" className="block text-sm font-medium mb-2" style={{color: 'var(--text-color-secondary)'}}>
                    AI Model
                  </label>
                  <Input
                    id="model-name"
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g., gemini-2.5-flash"
                  />
                  <p className="text-xs mt-2" style={{ color: 'var(--text-color-secondary)' }}>
                    Specify the model to use for all prompt generation tasks.
                  </p>
                </div>
                <div>
                  <label htmlFor="language-input" className="block text-sm font-medium mb-2" style={{color: 'var(--text-color-secondary)'}}>
                    Output Language
                  </label>
                  <Input
                    id="language-input"
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g., English, Spanish, Japanese"
                  />
                   <p className="text-xs mt-2" style={{ color: 'var(--text-color-secondary)' }}>
                    Enter the language for the generated prompt output.
                  </p>
                </div>
            </div>
            <div>
              <VariablesInput variables={variables} onChange={setVariables} />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SystemPromptArchitect modelName={modelName} language={language} variables={variables} />
          <ConversationalPromptRefiner modelName={modelName} language={language} variables={variables} />
          <SystemPromptRefiner modelName={modelName} language={language} variables={variables} />
          <OptimizationAdvisor modelName={modelName} language={language} variables={variables} />
        </div>
      </main>
      <footer className="text-center py-8 mt-12">
        <p style={{ color: 'var(--text-color-secondary)' }} className="text-sm">
          Built with the Liquid Glass Design System.
        </p>
      </footer>
    </div>
  );
};

export default App;
