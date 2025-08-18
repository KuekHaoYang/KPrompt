
import { GoogleGenAI } from "@google/genai";

// As per guidelines, the API key is exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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
    // Per guidelines, the primary text model for this app is 'gemini-2.5-flash'.
    return ['gemini-2.5-flash'];
};


async function generateContent(masterPrompt: string, model: string): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. This is a required configuration for the application to function.");
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
            throw new Error("The API Key from the environment is invalid or expired.");
        }
        if (error.message.toLowerCase().includes('permission denied')) {
            throw new Error("The configured API Key is valid, but may not have permission for the specified model.");
        }
        throw new Error(error.message || "An unknown API error occurred.");
    }
}

export const generateSystemPrompt = async (description: string, model: string, language: string): Promise<string> => {
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

Based on the user's description and the rules, generate the System Prompt.

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
