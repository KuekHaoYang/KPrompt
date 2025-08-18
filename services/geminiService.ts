// Cache for the fetched rules
let systemPromptRules: string | null = null;

// Asynchronously fetch and cache the system prompt rules
async function getSystemPromptRules(): Promise<string> {
    if (systemPromptRules === null) {
        try {
            // Path from root, assuming server serves from project root
            const response = await fetch('/prompts/systemPromptRules.txt');
            if (!response.ok) {
                throw new Error(`Failed to fetch system prompt rules: ${response.statusText}`);
            }
            systemPromptRules = await response.text();
        } catch (error) {
            console.error('Error loading system prompt rules:', error);
            // Re-throw a user-friendly error
            throw new Error('Could not load essential application configuration. Please check your network connection and refresh the page.');
        }
    }
    return systemPromptRules;
}


function getApiConfig() {
  const apiKey = process.env.API_KEY || localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please set it in the API Configuration section.");
  }

  let baseUrl = localStorage.getItem('gemini_api_host') || 'https://generativelanguage.googleapis.com';
  // Ensure protocol exists, default to https
  if (!/^https?:\/\//i.test(baseUrl)) {
    baseUrl = `https://${baseUrl}`;
  }
  // Remove any trailing slashes
  baseUrl = baseUrl.replace(/\/$/, '');

  return { apiKey, baseUrl };
}


interface GeminiModel {
    name: string;
    supportedGenerationMethods?: string[];
}

interface ListModelsResponse {
    models?: GeminiModel[];
}


export const listAvailableModels = async (): Promise<string[]> => {
    const DEFAULT_MODEL = 'gemini-2.5-flash'; // Using a more current default model name
    const apiKey = process.env.API_KEY || localStorage.getItem('gemini_api_key');

    if (!apiKey) {
        return [DEFAULT_MODEL];
    }
    
    try {
        const { apiKey, baseUrl } = getApiConfig();
        const url = `${baseUrl}/v1beta/models?key=${apiKey}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch models: ${response.status} ${response.statusText}`);
            const errorBody = await response.text();
            console.error('Error body:', errorBody);
            return [DEFAULT_MODEL];
        }

        const data: ListModelsResponse = await response.json();

        const models = data.models
            ?.filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m) => m.name.replace(/^models\//, ''))
            .filter((name: string) => name.startsWith('gemini'));
        
        if (models && models.length > 0) {
            const modelSet = new Set(models);
            // Ensure the default model is always first if available
            if (modelSet.has(DEFAULT_MODEL)) {
                return [DEFAULT_MODEL, ...Array.from(modelSet).filter(m => m !== DEFAULT_MODEL)];
            }
             // If default model isn't in the list, add it to the front anyway
            return [DEFAULT_MODEL, ...Array.from(modelSet)];
        }

        return [DEFAULT_MODEL];
    } catch (error) {
        console.error("Error fetching models:", error);
        return [DEFAULT_MODEL];
    }
};

async function generateContent(model: string, masterPrompt: string): Promise<string> {
    const { apiKey, baseUrl } = getApiConfig();
    const url = `${baseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: masterPrompt }]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse error response from API.' } }));
        console.error("API Error:", errorData);
        const errorMessage = errorData?.error?.message || "An unknown API error occurred.";
        if (errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('permission denied')) {
            throw new Error("The provided API Key is invalid or expired. Please check it in the API Configuration section.");
        }
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (typeof text !== 'string') {
        console.error("Unexpected response format:", data);
        throw new Error("Unexpected response format from API.");
    }
    
    return text.trim();
}

export const generateSystemPrompt = async (description: string, model: string): Promise<string> => {
  const SYSTEM_PROMPT_RULES = await getSystemPromptRules();
  const masterPrompt = `
I am an expert in AI prompt engineering, specializing in crafting high-performance System Prompts. My task is to take a user's simple description of a desired AI persona and expand it into a formal, robust System Prompt.

---
Here are the rules I will follow:
${SYSTEM_PROMPT_RULES}
---

User's Description:
---
${description}
---

Generated System Prompt:
  `;

  try {
    return await generateContent(model, masterPrompt);
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
): Promise<string> => {
    const SYSTEM_PROMPT_RULES = await getSystemPromptRules();
    const masterPrompt = `
I am an expert in AI conversational dynamics, operating under the principles outlined below. My role is to refine a user's draft prompt to make it more effective, based on the context of an ongoing conversation.

---
Here are the principles I will use for refining the prompt:
${SYSTEM_PROMPT_RULES}
---

I will analyze the provided System Prompt, Conversation History, and the user's Draft Prompt. I will then rewrite the draft to adhere to the principles in the guide above, particularly those in the "Mastering User Prompts" section.

Here is the context for the task:

// System Prompt for the conversation:
${systemPrompt || "No system prompt provided."}

// Conversation History (User and Assistant turns):
${history || "No conversation history provided."}

// User's Draft Prompt to be refined:
${draftPrompt}

---
Refined User Prompt:
    `;

    try {
        return await generateContent(model, masterPrompt);
    } catch (error: any) {
        console.error("Error refining user prompt:", error);
        throw error;
    }
};
