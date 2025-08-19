import React from 'react';
import Input from './Input';
import { PlusIcon, TrashIcon } from './Icon';

interface VariablesInputProps {
  variables: string[];
  onChange: (variables: string[]) => void;
}

const VariablesInput: React.FC<VariablesInputProps> = ({ variables, onChange }) => {
  const addVariable = () => {
    onChange([...variables, '']);
  };

  const updateVariable = (index: number, value: string) => {
    const newVariables = [...variables];
    newVariables[index] = value;
    onChange(newVariables);
  };

  const removeVariable = (index: number) => {
    const newVariables = variables.filter((_, i) => i !== index);
    onChange(newVariables);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color-secondary)' }}>
        Prompt Variables (Optional)
      </label>
      <div className="space-y-3">
        {variables.map((variable, index) => (
          <div key={index} className="flex items-center gap-2 fade-in">
            <Input
              id={`variable-${index}`}
              type="text"
              value={variable}
              onChange={(e) => updateVariable(index, e.target.value)}
              placeholder="e.g., {{user_input}} or ${customer_name}"
              className="!p-3"
            />
            <button
              onClick={() => removeVariable(index)}
              className="p-3 rounded-full text-[color:var(--text-color-secondary)] hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)] hover:text-red-500 transition-colors flex-shrink-0"
              aria-label={`Remove variable ${index + 1}`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          onClick={addVariable}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border transition-colors hover:bg-[color:color-mix(in_srgb,var(--text-color)_10%,transparent)]"
          style={{ color: 'var(--text-color-secondary)', borderColor: 'var(--glass-border)' }}
        >
          <PlusIcon className="w-4 h-4" />
          Add Variable
        </button>
      </div>
       <p className="text-xs mt-2" style={{ color: 'var(--text-color-secondary)' }}>
        Define placeholders the AI should include in the generated prompt, like {`\`{{user_input}}\``}.
      </p>
    </div>
  );
};

export default VariablesInput;
