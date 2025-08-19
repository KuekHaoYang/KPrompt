import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

// New function to initialize the AI instance from the UI
export function initializeAi(apiKey: string) {
    if (apiKey && apiKey.trim()) {
        try {
            ai = new GoogleGenAI({ apiKey });
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            ai = null; // Ensure ai is null if initialization fails
        }
    } else {
        ai = null;
    }
}

/**
 * Lists available models.
 * NOTE: The @google/genai SDK does not provide a public API for listing models.
 * This function returns a static list of recommended and allowed models for text generation.
 * This approach ensures compliance with model usage guidelines.
 */
export async function listAvailableModels(): Promise<string[]> {
    return ['gemini-2.5-flash'];
}


// Cache for the fetched rules
let systemPromptRules: string | null = null;

// Asynchronously fetch and cache the system prompt rules
async function getSystemPromptRules(): Promise<string> {
    if (systemPromptRules === null) {
        try {
            const response = await fetch('/prompts/systemPromptRules.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch system prompt rules: ${response.statusText}`);
            }
            systemPromptRules = await response.text();
        } catch (error) {
            console.error('Error loading system prompt rules:', error);
            throw new Error('Could not load essential application configuration. Please check your network connection and refresh the page.');
        }
    }
    return systemPromptRules;
}

async function generateContent(masterPrompt: string, model: string): Promise<string> {
    if (!ai) {
        throw new Error("API Key not set or invalid. Please configure your API Key in the settings area.");
    }
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: masterPrompt,
        });
        return response.text;
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        if (error.message.toLowerCase().includes('api key not valid')) {
            throw new Error("The API Key is invalid or expired. Please check it and save it again.");
        }
        if (error.message.toLowerCase().includes('permission denied')) {
            throw new Error("The API Key is valid, but may not have permission for the specified model.");
        }
        if (error.message.toLowerCase().includes('api key must be provided')) {
             throw new Error("API Key not set or invalid. Please configure your API Key in the settings area.");
        }
        throw new Error(error.message || "An unknown API error occurred.");
    }
}

const formatVariablesForPrompt = (variables: string[]): string => {
    if (!variables || variables.length === 0 || variables.every(v => v.trim() === '')) {
        return '';
    }
    const nonEmptyVariables = variables.filter(v => v.trim() !== '');
    if (nonEmptyVariables.length === 0) {
        return '';
    }
    
    return `
---
Variable Integration:
The final prompt must be designed to be used in a programmatic context. As such, it needs to include specific placeholders or variables. You must incorporate the following variables into the generated prompt where it makes logical sense to do so.

Variable List:
${nonEmptyVariables.map(v => `- \`${v}\``).join('\n')}

For example, if a variable is \`{{user_topic}}\`, you might include a sentence like "The user will provide the \`{{user_topic}}\` for you to write about."
---
    `;
};

export const generateSystemPrompt = async (description: string, model: string, language: string, variables: string[]): Promise<string> => {
  const SYSTEM_PROMPT_RULES = await getSystemPromptRules();
  const variablesSection = formatVariablesForPrompt(variables);

  const masterPrompt = `
I am an expert in AI prompt engineering, specializing in crafting high-performance System Prompts. My task is to take a user's simple description of a desired AI persona and expand it into a formal, robust System Prompt.

---
Here are the rules I will follow:
${SYSTEM_PROMPT_RULES}
---
${variablesSection}
User's Description:
---
${description}
---

Based on the user's description, the rules, and any specified variables, generate the System Prompt.

**Output Instructions:**
- You must generate ONLY the text of the System Prompt itself.
- Do NOT include any introductory phrases, explanations, or markdown formatting like \`\`\`.
- The output should be ready to be directly copied and used as a system prompt.
- **You must generate the output in ${language}.**

System Prompt:
  `;

  try {
    const result = await generateContent(masterPrompt, model);
    // Defensively remove any markdown fences the model might still add
    return result.replace(/```/g, '').trim();
  } catch (error: any) {
    console.error("Error generating system prompt:", error);
    throw error;
  }
};

export const refineUserPrompt = async (
  systemPrompt: string,
  history: string,
  draftPrompt: string,
  model: string,
  language: string,
  variables: string[],
): Promise<string> => {
    const SYSTEM_PROMPT_RULES = await getSystemPromptRules();
    const variablesSection = formatVariablesForPrompt(variables);

    const masterPrompt = `
I am an expert in AI conversational dynamics, operating under the principles outlined below. My role is to refine a user's draft prompt to make it more effective, based on the context of an ongoing conversation.

---
Here are the principles I will use for refining the prompt:
${SYSTEM_PROMPT_RULES}
---
${variablesSection}
I will analyze the provided System Prompt, Conversation History, and the user's Draft Prompt. I will then rewrite the draft to adhere to the principles in the guide above, particularly those in the "Mastering User Prompts" section. If any variables are specified, I must incorporate them into the refined prompt.

Here is the context for the task:

// System Prompt for the conversation:
${systemPrompt || "No system prompt provided."}

// Conversation History (User and Assistant turns):
${history || "No conversation history provided."}

// User's Draft Prompt to be refined:
${draftPrompt}

---

Based on the context, refine the user's draft prompt.

**Output Instructions:**
- You must generate ONLY the text of the refined prompt itself.
- Do NOT include any introductory phrases, explanations, or markdown formatting like \`\`\`.
- The output should be ready to be directly copied and used as a user prompt.
- **You must generate the output in ${language}.**

Refined Prompt:
    `;

    try {
        const result = await generateContent(masterPrompt, model);
        // Defensively remove any markdown fences the model might still add
        return result.replace(/```/g, '').trim();
    } catch (error: any) {
        console.error("Error refining user prompt:", error);
        throw error;
    }
};

export const refineSystemPrompt = async (existingPrompt: string, model: string, language: string, variables: string[]): Promise<string> => {
  const SYSTEM_PROMPT_RULES = await getSystemPromptRules();
  const variablesSection = formatVariablesForPrompt(variables);

  const masterPrompt = `
I am an expert in AI prompt engineering, specializing in optimizing System Prompts for maximum performance. My task is to take a user's existing System Prompt and refine it to be more robust, clear, and effective, following the principles outlined below.

---
Here are the principles I will follow for refining the prompt:
${SYSTEM_PROMPT_RULES}
---
${variablesSection}
I will analyze the user's existing prompt and rewrite it to better align with the principles of elite prompt engineering. The refined prompt should maintain the original intent but be significantly improved in structure, clarity, and effectiveness.

User's Existing System Prompt:
---
${existingPrompt}
---

Based on the user's prompt, the rules, and any specified variables, refine the System Prompt.

**Output Instructions:**
- You must generate ONLY the text of the refined System Prompt itself.
- Do NOT include any introductory phrases, explanations, or markdown formatting like \`\`\`.
- The output should be ready to be directly copied and used as an improved system prompt.
- **You must generate the output in ${language}.**

Refined System Prompt:
  `;

  try {
    const result = await generateContent(masterPrompt, model);
    return result.replace(/```/g, '').trim();
  } catch (error: any) {
    console.error("Error refining system prompt:", error);
    throw error;
  }
};

export const getOptimizationAdvice = async (
  promptToAnalyze: string,
  promptType: 'system' | 'user',
  model: string,
  language: string,
  variables: string[]
): Promise<string> => {
  const SYSTEM_PROMPT_RULES = await getSystemPromptRules();
  const variablesSection = formatVariablesForPrompt(variables);

  const masterPrompt = `
I am an expert prompt engineering advisor. My task is to analyze a given ${promptType} prompt and provide a concise, actionable list of suggestions for improvement, based on the principles outlined below.

---
Here are the principles I will follow:
${SYSTEM_PROMPT_RULES}
---
${variablesSection}
${promptType.charAt(0).toUpperCase() + promptType.slice(1)} Prompt to Analyze:
---
${promptToAnalyze}
---

Based on the provided prompt and the principles, generate a list of optimization suggestions.

**CRITICAL Output Instructions:**
- You must generate ONLY a concise, bulleted list of suggestions.
- Each suggestion must be a brief, single point.
- Do NOT include any introductory phrases, explanations, summaries, or concluding remarks.
- The output should be a raw list of points, with each point on a new line, starting with a hyphen or asterisk.
- **You must generate the output in ${language}.**

Optimization Suggestions:
  `;

  try {
    const result = await generateContent(masterPrompt, model);
    return result.replace(/```/g, '').trim();
  } catch (error: any) {
    console.error("Error getting optimization advice:", error);
    throw error;
  }
};

export const applyOptimizationAdvice = async (
  originalPrompt: string,
  advice: string[],
  promptType: 'system' | 'user',
  model: string,
  language: string,
  variables: string[]
): Promise<string> => {
  const SYSTEM_PROMPT_RULES = await getSystemPromptRules();
  const variablesSection = formatVariablesForPrompt(variables);
  const adviceSection = advice.map(a => `- ${a}`).join('\n');

  const masterPrompt = `
I am an expert in AI prompt engineering, specializing in optimizing prompts for maximum performance. My task is to take a user's existing ${promptType} prompt, along with a list of specific optimization suggestions, and rewrite the prompt to incorporate that advice.

---
Here are the core principles of elite prompt engineering I will follow:
${SYSTEM_PROMPT_RULES}
---
${variablesSection}
I will analyze the user's original prompt and the provided list of suggestions. I must rewrite the prompt to implement all suggestions, resulting in a version that is more robust, clear, and effective.

Original ${promptType.charAt(0).toUpperCase() + promptType.slice(1)} Prompt:
---
${originalPrompt}
---

Optimization Suggestions to Apply:
---
${adviceSection}
---

Based on the original prompt, the suggestions, the core principles, and any specified variables, generate the new, refined prompt.

**CRITICAL Output Instructions:**
- You must generate ONLY the text of the new, refined prompt itself.
- Do NOT include any introductory phrases, explanations, or markdown formatting like \`\`\`.
- The output should be ready to be directly copied and used as an improved prompt.
- **You must generate the output in ${language}.**

Refined ${promptType.charAt(0).toUpperCase() + promptType.slice(1)} Prompt:
  `;

  try {
    const result = await generateContent(masterPrompt, model);
    return result.replace(/```/g, '').trim();
  } catch (error: any) {
    console.error("Error applying optimization advice:", error);
    throw error;
  }
};