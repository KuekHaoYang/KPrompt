
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { refineUserPrompt } from '../services/geminiService';
import GlassCard from './GlassCard';
import Button from './Button';
import TextArea from './TextArea';
import Loader from './Loader';
import ModelSelector from './ModelSelector';
import { CopyIcon, CheckIcon, PlusIcon, TrashIcon } from './Icon';

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: number;
  role: MessageRole;
  content: string;
  isDeleting?: boolean;
}

const RoleSelector: React.FC<{ role: MessageRole, onChange: (role: MessageRole) => void }> = ({ role, onChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    
    const baseClasses = "relative z-10 px-4 py-1.5 text-sm font-semibold transition-colors duration-300";
    const activeClasses = "text-white";
    const inactiveClasses = "text-[color:var(--text-color-secondary)] hover:text-[color:var(--text-color)]";

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const activeButton = container.querySelector(`button[data-role="${role}"]`) as HTMLElement;
            if (activeButton) {
                setIndicatorStyle({
                    width: `${activeButton.offsetWidth}px`,
                    transform: `translateX(${activeButton.offsetLeft}px)`,
                });
            }
        }
    }, [role]);

    return (
        <div ref={containerRef} className="relative inline-flex p-0.5 rounded-full border" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
            <span
                className="absolute top-0.5 left-0.5 bottom-0.5 rounded-full bg-[color:var(--accent-color)] shadow-sm"
                style={{...indicatorStyle, transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'}}
                aria-hidden="true"
            ></span>
            <button data-role="user" onClick={() => onChange('user')} className={`${baseClasses} rounded-full ${role === 'user' ? activeClasses : inactiveClasses}`}>
                User
            </button>
            <button data-role="assistant" onClick={() => onChange('assistant')} className={`${baseClasses} rounded-full ${role === 'assistant' ? activeClasses : inactiveClasses}`}>
                AI
            </button>
        </div>
    );
};


const ConversationalPromptRefiner: React.FC = () => {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [model, setModel] = useState('gemini-2.5-flash');

  const addMessage = () => {
    setMessages([...messages, { id: Date.now(), role: 'user', content: '' }]);
  };

  const updateMessage = (id: number, field: 'role' | 'content', value: string) => {
    setMessages(messages.map(msg => msg.id === id ? { ...msg, [field]: value } : msg));
  };
  
  const removeMessage = (id: number) => {
    setMessages(currentMessages =>
      currentMessages.map(msg => (msg.id === id ? { ...msg, isDeleting: true } : msg))
    );
    // Wait for animation to finish before removing from state
    setTimeout(() => {
      setMessages(currentMessages => currentMessages.filter(msg => msg.id !== id));
    }, 400);
  };

  const handleSubmit = useCallback(async () => {
    if (!draftPrompt.trim()) {
      setError('Please enter a draft prompt to refine.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRefinedPrompt('');

    const historyString = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    try {
      const result = await refineUserPrompt(systemPrompt, historyString, draftPrompt, model);
      setRefinedPrompt(result);
    } catch (e: any) {
        setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [systemPrompt, messages, draftPrompt, model]);
  
  const handleCopy = useCallback(() => {
    if (refinedPrompt) {
      navigator.clipboard.writeText(refinedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [refinedPrompt]);

  return (
    <GlassCard>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>Conversational Prompt Refiner</h2>
        <p style={{ color: 'var(--text-color-secondary)' }}>
          Provide conversation context and a draft prompt. We'll refine it for maximum effectiveness.
        </p>
        
        <ModelSelector value={model} onChange={(e) => setModel(e.target.value)} />

        <TextArea
          id="system-prompt"
          placeholder="System Prompt (Optional)"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={3}
          disabled={isLoading}
        />

        <div>
          <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--text-color-secondary)'}}>Conversation History</h3>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-3 rounded-2xl space-y-3 ${msg.isDeleting ? 'fade-out-shrink' : 'fade-in'}`}
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
              >
                <div className="flex justify-between items-center">
                  <RoleSelector role={msg.role} onChange={(role) => updateMessage(msg.id, 'role', role)} />
                  <button onClick={() => removeMessage(msg.id)} className="p-2 rounded-full text-[color:var(--text-color-secondary)] hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)] hover:text-red-500 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <TextArea
                  id={`message-${msg.id}`}
                  placeholder={`Content for ${msg.role}...`}
                  value={msg.content}
                  onChange={(e) => updateMessage(msg.id, 'content', e.target.value)}
                  rows={2}
                  disabled={isLoading}
                  className="text-sm !p-3"
                />
              </div>
            ))}
            <button onClick={addMessage} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border transition-colors hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]" style={{color: 'var(--text-color-secondary)', borderColor: 'var(--glass-border)'}}>
              <PlusIcon className="w-4 h-4" />
              Add Message
            </button>
          </div>
        </div>

        <TextArea
          id="draft-prompt"
          placeholder="Your Next User Prompt (Required)"
          value={draftPrompt}
          onChange={(e) => setDraftPrompt(e.target.value)}
          rows={3}
          disabled={isLoading}
        />
        
        <Button onClick={handleSubmit} disabled={isLoading || !draftPrompt.trim()}>
          {isLoading ? <Loader /> : 'Refine Prompt'}
        </Button>
        
        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
        
        {refinedPrompt && (
          <div className="mt-6 space-y-3 fade-in">
            <h3 className="text-xl font-semibold">Refined User Prompt:</h3>
            <div className="relative p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
               <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-full transition hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]" style={{ background: 'var(--glass-bg)', color: 'var(--text-color-secondary)' }} aria-label="Copy prompt">
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

export default ConversationalPromptRefiner;
