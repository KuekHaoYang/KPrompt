
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT_RULES } from "../prompts/systemPromptRules";

function getAiClient(): GoogleGenAI {
  // Priority: 1. Environment variable, 2. Local Storage
  const apiKey = process.env.API_KEY || localStorage.getItem('gemini_api_key');

  if (!apiKey) {
    throw new Error("Gemini API key not found. Please set it in the API Configuration section.");
  }

  return new GoogleGenAI({ apiKey });
}

export const generateSystemPrompt = async (description: string, model: string): Promise<string> => {
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
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: model,
        contents: masterPrompt,
    });
    return response.text.trim();
  } catch (error: any) {
    console.error("Error generating system prompt:", error);
    if (error.message.includes('API key not found')) {
        throw error;
    }
    if (error.message.includes('invalid')) { // Broader catch for invalid key messages
        throw new Error("The provided API Key is invalid or expired. Please check it in the API Configuration section.");
    }
    throw new Error("Failed to generate system prompt. Check the console for details.");
  }
};

export const refineUserPrompt = async (
  systemPrompt: string,
  history: string,
  draftPrompt: string,
  model: string,
): Promise<string> => {
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
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: model,
            contents: masterPrompt,
        });
        return response.text.trim();
    } catch (error: any) {
        console.error("Error refining user prompt:", error);
         if (error.message.includes('API key not found')) {
            throw error;
        }
        if (error.message.includes('invalid')) { // Broader catch for invalid key messages
            throw new Error("The provided API Key is invalid or expired. Please check it in the API Configuration section.");
        }
        throw new Error("Failed to refine user prompt. Check the console for details.");
    }
};
