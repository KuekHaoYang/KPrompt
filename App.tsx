
import React from 'react';
import SystemPromptArchitect from './components/SystemPromptArchitect';
import ConversationalPromptRefiner from './components/ConversationalPromptRefiner';
import Header from './components/Header';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <Header />
      <main className="container mx-auto mt-8">
        <Settings />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SystemPromptArchitect />
          <ConversationalPromptRefiner />
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
