import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

// This function determines the key to use, prioritizing user-set storage.
function resolveApiKey(): string | null {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey && storedKey.trim() !== '') {
        return storedKey;
    }
    // Fallback to environment variable.
    return process.env.API_KEY || null;
}

// Initializes or re-initializes the AI client.
function initializeAiClient() {
    const apiKey = resolveApiKey();
    if (apiKey) {
        // Only create a new instance if the key has actually changed.
        if (apiKey !== currentApiKey) {
            ai = new GoogleGenAI({ apiKey });
            currentApiKey = apiKey;
        }
    } else {
        ai = null;
        currentApiKey = null;
    }
}

// Initial call on load to set up the client.
initializeAiClient();

// Function for the UI to get the current key and its source for display.
export function getApiKeyAndSource(): { key: string; source: 'storage' | 'env' | 'none' } {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey && storedKey.trim() !== '') {
        return { key: storedKey, source: 'storage' };
    }
    if (process.env.API_KEY) {
        return { key: process.env.API_KEY, source: 'env' };
    }
    return { key: '', source: 'none' };
}

// Function for the UI to update the key.
export function updateApiKey(newKey: string) {
    if (newKey && newKey.trim() !== '') {
        localStorage.setItem('gemini_api_key', newKey);
    } else {
        // If the user clears the key, remove it from storage to allow fallback to env var.
        localStorage.removeItem('gemini_api_key');
    }
    // Re-initialize the client with the new key hierarchy.
    initializeAiClient();
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

export const listAvailableModels = async (): Promise<string[]> => {
    // Per guidelines, the primary text model for this app is 'gemini-2.5-pro'.
    return ['gemini-2.5-pro'];
};


async function generateContent(masterPrompt: string, model: string): Promise<string> {
    // Ensure client is up-to-date on every call. This is robust.
    initializeAiClient();
    
    if (!ai) {
        throw new Error("API Key not found. Please set your Google Gemini API Key in the settings.");
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
            throw new Error("The provided API Key is invalid or expired. Please check it in the settings.");
        }
        if (error.message.toLowerCase().includes('permission denied')) {
            throw new Error("The API Key may not have permission for the specified model.");
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

export const generateSystemPrompt = async (description: string, model: string, language: string, variables: string[], thinkingPoints?: string[]): Promise<string> => {
  const SYSTEM_PROMPT_RULES = await getSystemPromptRules();
  const variablesSection = formatVariablesForPrompt(variables);
  const thinkingPointsSection = (thinkingPoints && thinkingPoints.length > 0 && thinkingPoints.some(p => p.trim() !== ''))
    ? `
---
Key Directives to Incorporate:
You must intelligently integrate the following specific directives into the final System Prompt. These are non-negotiable and should guide the core logic and personality of the AI.

Directives:
${thinkingPoints.filter(p => p.trim() !== '').map(p => `- ${p}`).join('\n')}
---
    `
    : '';

  const masterPrompt = `
I am an expert in AI prompt engineering, specializing in crafting high-performance System Prompts. My task is to take a user's simple description of a desired AI persona, along with a set of key directives, and expand it into a formal, robust System Prompt.

---
Here are the rules I will follow(THE GENERATED PROMPT MUST FULLY FOLLOW THIS RULES):
${SYSTEM_PROMPT_RULES}
---
${variablesSection}
${thinkingPointsSection}
User's Original Description:
---
${description}
---

You must strictly and completely adhere to all the rules provided. Based on the user's description, the key directives (if any), and any specified variables, generate the System Prompt.

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
Here are the principles I will use for refining the prompt (THE GENERATED PROMPT MUST FULLY FOLLOW THIS RULES):
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

Based on the context, you must strictly and completely adhere to all the principles provided to refine the user's draft prompt.

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
Here are the principles I will follow for refining the prompt (THE GENERATED PROMPT MUST FULLY FOLLOW THIS RULES):
${SYSTEM_PROMPT_RULES}
---
${variablesSection}
I will analyze the user's existing prompt and rewrite it to better align with the principles of elite prompt engineering. The refined prompt should maintain the original intent but be significantly improved in structure, clarity, and effectiveness.

User's Existing System Prompt:
---
${existingPrompt}
---

Based on the user's prompt, you must strictly and completely adhere to all the rules provided and incorporate any specified variables to refine the System Prompt.

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

export const getSystemPromptThinkingPoints = async (
  description: string,
  model: string,
  language: string,
  variables: string[]
): Promise<string> => {
  const SYSTEM_PROMPT_RULES = await getSystemPromptRules();
  const variablesSection = formatVariablesForPrompt(variables);

  const masterPrompt = `
I am an expert prompt engineering advisor. My task is to analyze a user's description for an AI persona and provide a concise, actionable list of key points and characteristics that should be included in a high-performance System Prompt. I will base my suggestions on the principles of elite prompt engineering.

---
Here are the principles I will follow (THE GENERATED PROMPT MUST FULLY FOLLOW THIS RULES):
${SYSTEM_PROMPT_RULES}
---
${variablesSection}
User's Description for AI Persona:
---
${description}
---

Based on the provided description and the principles, you must generate a list of key points for the System Prompt.

**CRITICAL Output Instructions:**
- You must generate ONLY a concise, bulleted list of suggestions.
- Each suggestion must be a brief, single point.
- Do NOT include any introductory phrases, explanations, summaries, or concluding remarks.
- The output should be a raw list of points, with each point on a new line, starting with a hyphen or asterisk.
- **You must generate the output in ${language}.**

Key Points for System Prompt:
  `;

  try {
    const result = await generateContent(masterPrompt, model);
    return result.replace(/```/g, '').trim();
  } catch (error: any) {
    console.error("Error getting system prompt thinking points:", error);
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
Here are the principles I will follow (THE GENERATED PROMPT MUST FULLY FOLLOW THIS RULES):
${SYSTEM_PROMPT_RULES}
---
${variablesSection}
${promptType.charAt(0).toUpperCase() + promptType.slice(1)} Prompt to Analyze:
---
${promptToAnalyze}
---

Based on the provided prompt and the principles, you must generate a list of optimization suggestions.

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
Here are the core principles of elite prompt engineering I will follow (THE GENERATED PROMPT MUST FULLY FOLLOW THIS RULES):
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

Based on the original prompt, the suggestions, the core principles, and any specified variables, you must generate the new, refined prompt.

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
