
// Zero-dependency, type-safe i18n solution for KPrompt
// Supports English and Chinese (Simplified)

type Locale = 'English' | 'Chinese Simplified';

interface Translations {
  app: {
    title: string;
    subtitle: string;
    footer: string;
  };
  common: {
    copy: string;
    copied: string;
    loading: string;
    error: string;
    save: string;
    saved: string;
    user: string;
    ai: string;
    system: string;
    aiModel: string;
    outputLanguage: string;
  };
  systemPromptArchitect: {
    title: string;
    description: string;
    placeholder: string;
    generateButton: string;
    generatedTitle: string;
    errorMessage: string;
  };
  conversationalPromptRefiner: {
    title: string;
    description: string;
    systemPromptPlaceholder: string;
    conversationHistoryTitle: string;
    addMessageButton: string;
    draftPromptPlaceholder: string;
    refineButton: string;
    refinedTitle: string;
    errorMessage: string;
  };
  promptOptimizer: {
    title: string;
    description: string;
    systemPromptPlaceholder: string;
    userPromptPlaceholder: string;
    getAdviceButton: string;
    systemSuggestions: string;
    userSuggestions: string;
    copySuggestions: string;
    applyAdvice: string;
    refinedTitle: string;
    errorMessage: string;
  };
  variablesInput: {
    title: string;
    description: string;
    placeholder: string;
    addButton: string;
    removeLabel: string;
  };
  settings: {
    aiModelDescription: string;
    outputLanguageDescription: string;
    aiModelPlaceholder: string;
    outputLanguagePlaceholder: string;
    apiKeyPlaceholder: string;
    apiKeyTitle: string;
    apiKeyDescription: string;
    apiKeyRequired: string;
    apiKeyFromEnv: string;
  };
  theme: {
    lightLabel: string;
    darkLabel: string;
    systemLabel: string;
  };
  language: {
    english: string;
    chinese: string;
    switchToEnglish: string;
    switchToChinese: string;
  };
}

const translations: Record<Locale, Translations> = {
  'English': {
    app: {
      title: "KPrompt",
      subtitle: "AI Prompt Engineering Workbench",
      footer: "Built with the Liquid Glass Design System."
    },
    common: {
      copy: "Copy",
      copied: "Copied",
      loading: "Loading...",
      error: "Error",
      save: "Save",
      saved: "Saved",
      user: "User",
      ai: "AI",
      system: "System",
      aiModel: "AI Model",
      outputLanguage: "Output Language"
    },
    systemPromptArchitect: {
      title: "System Prompt Architect",
      description: "Describe the desired AI persona. We'll engineer a high-performance system prompt for you.",
      placeholder: "e.g., 'a helpful code reviewer for Python' or 'a marketing expert for social media campaigns'",
      generateButton: "Generate Prompt",
      generatedTitle: "Generated System Prompt:",
      errorMessage: "Please enter a description for the AI persona."
    },
    conversationalPromptRefiner: {
      title: "Conversational Prompt Refiner",
      description: "Provide conversation context and a draft prompt. We'll refine it for maximum effectiveness.",
      systemPromptPlaceholder: "System Prompt (Optional)",
      conversationHistoryTitle: "Conversation History",
      addMessageButton: "Add Message",
      draftPromptPlaceholder: "Your Next User Prompt (Required)",
      refineButton: "Refine Prompt",
      refinedTitle: "Refined User Prompt:",
      errorMessage: "Please enter a draft prompt to refine."
    },
    promptOptimizer: {
      title: "Prompt Optimizer",
      description: "Provide a system and/or user prompt to receive expert advice and generate refined versions.",
      systemPromptPlaceholder: "System Prompt (Optional)",
      userPromptPlaceholder: "User Prompt (Optional)",
      getAdviceButton: "Get Advice",
      systemSuggestions: "System Prompt Suggestions",
      userSuggestions: "User Prompt Suggestions",
      copySuggestions: "Copy Suggestions",
      applyAdvice: "Apply Advice & Refine",
      refinedTitle: "Refined {type} Prompt:",
      errorMessage: "Please enter at least one prompt to get advice on."
    },
    variablesInput: {
      title: "Prompt Variables (Optional)",
      description: "Define placeholders the AI should include in the generated prompt, like `{{user_input}}`.",
      placeholder: "e.g., {{user_input}} or ${customer_name}",
      addButton: "Add Variable",
      removeLabel: "Remove variable {index}"
    },
    settings: {
      aiModelDescription: "Specify the model to use for all prompt generation tasks.",
      outputLanguageDescription: "Enter the language for the generated prompt output.",
      aiModelPlaceholder: "e.g., gemini-2.5-flash",
      outputLanguagePlaceholder: "e.g., English, Spanish, Japanese",
      apiKeyPlaceholder: "Enter your Google Gemini API Key",
      apiKeyTitle: "API Key Configuration",
      apiKeyDescription: "Your API key is stored locally in your browser and is required for all AI interactions.",
      apiKeyRequired: "An API key is required to use this application.",
      apiKeyFromEnv: "API Key has been configured from the environment."
    },
    theme: {
      lightLabel: "Set light theme",
      darkLabel: "Set dark theme",
      systemLabel: "Set system theme"
    },
    language: {
      english: "English",
      chinese: "简体中文",
      switchToEnglish: "Switch to English",
      switchToChinese: "Switch to Chinese"
    }
  },
  'Chinese Simplified': {
    app: {
      title: "KPrompt",
      subtitle: "AI 提示词工程工作台",
      footer: "基于液态玻璃设计系统构建。"
    },
    common: {
      copy: "复制",
      copied: "已复制",
      loading: "加载中...",
      error: "错误",
      save: "保存",
      saved: "已保存",
      user: "用户",
      ai: "AI",
      system: "系统",
      aiModel: "AI 模型",
      outputLanguage: "输出语言"
    },
    systemPromptArchitect: {
      title: "系统提示架构师",
      description: "描述所需的 AI 角色，我们将为您设计高性能的系统提示。",
      placeholder: "例如：'Python 代码审查助手' 或 '社交媒体营销专家'",
      generateButton: "生成提示",
      generatedTitle: "生成的系统提示：",
      errorMessage: "请输入 AI 角色描述。"
    },
    conversationalPromptRefiner: {
      title: "对话提示优化器",
      description: "提供对话上下文和草稿提示，我们将优化它以获得最佳效果。",
      systemPromptPlaceholder: "系统提示（可选）",
      conversationHistoryTitle: "对话历史",
      addMessageButton: "添加消息",
      draftPromptPlaceholder: "您的下一个用户提示（必需）",
      refineButton: "优化提示",
      refinedTitle: "优化后的用户提示：",
      errorMessage: "请输入要优化的草稿提示。"
    },
    promptOptimizer: {
      title: "提示优化器",
      description: "提供系统和/或用户提示，以获得专家建议和生成优化版本。",
      systemPromptPlaceholder: "系统提示（可选）",
      userPromptPlaceholder: "用户提示（可选）",
      getAdviceButton: "获取建议",
      systemSuggestions: "系统提示建议",
      userSuggestions: "用户提示建议",
      copySuggestions: "复制建议",
      applyAdvice: "应用建议并优化",
      refinedTitle: "优化后的{type}提示：",
      errorMessage: "请至少输入一个提示以获取建议。"
    },
    variablesInput: {
      title: "提示变量（可选）",
      description: "定义 AI 应在生成的提示中包含的占位符，如 `{{user_input}}`。",
      placeholder: "例如：{{user_input}} 或 ${customer_name}",
      addButton: "添加变量",
      removeLabel: "删除变量 {index}"
    },
    settings: {
      aiModelDescription: "指定用于所有提示生成任务的模型。",
      outputLanguageDescription: "输入生成提示输出的语言。",
      aiModelPlaceholder: "例如：gemini-2.5-flash",
      outputLanguagePlaceholder: "例如：中文，英文，日文",
      apiKeyPlaceholder: "输入您的 Google Gemini API 密钥",
      apiKeyTitle: "API 密钥配置",
      apiKeyDescription: "您的 API 密钥将安全地存储在您的浏览器本地存储中，并且是所有 AI 交互所必需的。",
      apiKeyRequired: "使用此应用程序需要 API 密钥。",
      apiKeyFromEnv: "API 密钥已通过环境配置。"
    },
    theme: {
      lightLabel: "设置浅色主题",
      darkLabel: "设置深色主题",
      systemLabel: "设置系统主题"
    },
    language: {
      english: "English",
      chinese: "简体中文",
      switchToEnglish: "切换到英文",
      switchToChinese: "切换到中文"
    }
  }
};

/**
 * Type-safe translation function
 * @param language - Current language setting (e.g., 'English', 'Chinese Simplified', '简体中文')
 * @param key - Translation key in dot notation (e.g., 'app.title', 'common.copy')
 * @param interpolations - Optional object for string interpolation
 * @returns Translated string or the key itself as fallback
 */
export const t = (
  language: string,
  key: string,
  interpolations?: Record<string, string>
): string => {
  // Normalize language to supported locale
  const locale = normalizeLocale(language);
  const keys = key.split('.');
  let value: any = translations[locale] || translations['English'];

  // Navigate through nested object
  for (const k of keys) {
    value = value?.[k];
  }

  // Return key as fallback if translation not found
  if (typeof value !== 'string') {
    console.warn(`Translation not found for key: ${key} in locale: ${locale}`);
    return key;
  }

  // Apply interpolations if provided
  if (interpolations) {
    return Object.entries(interpolations).reduce(
      (str, [placeholder, replacement]) =>
        str.replace(new RegExp(`{${placeholder}}`, 'g'), replacement),
      value
    );
  }

  return value;
};

/**
 * Normalize language input to supported locale
 */
function normalizeLocale(language: string): Locale {
  const normalized = language.toLowerCase().trim();

  if (normalized.includes('chinese') || normalized === '简体中文' || normalized === 'zh-cn' || normalized === 'zh-CN') {
    return 'Chinese Simplified';
  }

  return 'English'; // Default fallback
}

/**
 * Get available locales
 */
export const getAvailableLocales = (): string[] => {
  return ['English', 'Chinese Simplified'];
};

/**
 * Check if a locale is supported
 */
export const isLocaleSupported = (language: string): boolean => {
  const locale = normalizeLocale(language);
  return locale in translations;
};

export { translations };
export type { Translations, Locale };
