
import React, { useState } from 'react';
import SystemPromptArchitect from './components/SystemPromptArchitect';
import ConversationalPromptRefiner from './components/ConversationalPromptRefiner';
import Header from './components/Header';
import Input from './components/Input';

const App: React.FC = () => {
  const [modelName, setModelName] = useState('gemini-2.5-flash');

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <Header />
      <main className="container mx-auto mt-8">
        <div className="max-w-lg mx-auto mb-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SystemPromptArchitect modelName={modelName} />
          <ConversationalPromptRefiner modelName={modelName} />
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
