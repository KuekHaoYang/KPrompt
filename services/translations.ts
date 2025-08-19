export type UiLanguage = 'en' | 'zh';

const translations = {
  en: {
    // Header
    'header.subtitle': 'AI Prompt Engineering Workbench',

    // App Config
    'config.model': 'AI Model',
    'config.model.description': 'Specify the model to use for all prompt generation tasks.',
    'config.variables': 'Prompt Variables (Optional)',
    'config.variables.description': 'Define placeholders the AI should include in the generated prompt, like `{`\`{{user_input}}\``}.',
    'config.variables.add': 'Add Variable',
    'config.variables.placeholder': 'e.g., {{user_input}} or ${customer_name}',
    
    // System Prompt Architect
    'architect.title': 'System Prompt Architect',
    'architect.description': "Describe the desired AI persona. We'll engineer a high-performance system prompt for you.",
    'architect.placeholder': "e.g., 'a helpful code reviewer for Python' or 'a marketing expert for social media campaigns'",
    'architect.button.generate': 'Generate Prompt',
    'architect.generated.title': 'Generated System Prompt:',

    // Conversational Prompt Refiner
    'refiner.conversational.title': 'Conversational Prompt Refiner',
    'refiner.conversational.description': "Provide conversation context and a draft prompt. We'll refine it for maximum effectiveness.",
    'refiner.conversational.systemPrompt.placeholder': 'System Prompt (Optional)',
    'refiner.conversational.history.title': 'Conversation History',
    'refiner.conversational.history.add': 'Add Message',
    'refiner.conversational.history.user': 'User',
    'refiner.conversational.history.ai': 'AI',
    'refiner.conversational.history.contentPlaceholder': 'Content for {role}...',
    'refiner.conversational.draft.placeholder': 'Your Next User Prompt (Required)',
    'refiner.conversational.button.refine': 'Refine Prompt',
    'refiner.conversational.refined.title': 'Refined User Prompt:',

    // Optimization Advisor
    'optimizer.title': 'Prompt Optimizer',
    'optimizer.description': 'Provide a system and/or user prompt to receive expert advice and generate refined versions.',
    'optimizer.systemPrompt.placeholder': 'System Prompt (Optional)',
    'optimizer.userPrompt.placeholder': 'User Prompt (Optional)',
    'optimizer.button.getAdvice': 'Get Advice',
    'optimizer.suggestions.system': 'System Prompt Suggestions',
    'optimizer.suggestions.user': 'User Prompt Suggestions',
    'optimizer.suggestions.copy': 'Copy Suggestions',
    'optimizer.button.apply': 'Apply Advice & Refine',
    'optimizer.refined.title.system': 'Refined System Prompt:',
    'optimizer.refined.title.user': 'Refined User Prompt:',

    // System/User Prompt Refiner (General)
    'refiner.system.title': 'System Prompt Refiner',
    'refiner.user.title': 'User Prompt Refiner',
    'refiner.system.description': "Input an existing system prompt. We'll optimize it for clarity, structure, and performance.",
    'refiner.user.description': "Input an existing user prompt. We'll refine it for clarity, intent, and effectiveness.",
    'refiner.system.placeholder': 'Paste your existing system prompt here...',
    'refiner.user.placeholder': 'Paste your existing user prompt here...',
    'refiner.system.button': 'Refine System Prompt',
    'refiner.user.button': 'Refine User Prompt',
    'refiner.promptType': 'Prompt Type',
    'refiner.promptType.system': 'System Prompt',
    'refiner.promptType.user': 'User Prompt',
    'refiner.refined.title': 'Refined {promptType} Prompt:',

    // Settings
    'settings.title': 'API Configuration',
    'settings.apiKey.label': 'Google Gemini API Key',
    'settings.apiKey.placeholder': 'Enter your API Key here',
    'settings.apiKey.description': "Keys are stored in your browser's local storage and override environment variables.",
    'settings.apiKey.source.env': 'Source: Environment Variable (Overridable)',
    'settings.apiKey.source.storage': 'Source: Local Storage',
    'settings.apiKey.source.none': 'Not Set. A key is required to use the app.',
    'settings.host.label': 'API Host',
    'settings.host.placeholder': 'Default: generativelanguage.googleapis.com',
    'settings.host.description': 'Optional override for advanced use cases like proxies. Leave empty to use the default.',

    // Common terms
    'common.copied': 'Copied',
    'common.copyPrompt': 'Copy prompt',
    'common.copySuggestions': 'Copy Suggestions',
    'common.save': 'Save Settings',
    'common.saved': 'Saved',
    'common.showSettings': 'Show Settings',
    'common.hideSettings': 'Hide Settings',
    'footer.text': 'Built with the Liquid Glass Design System.',

    // Errors
    'error.enterDescription': 'Please enter a description for the AI persona.',
    'error.enterPromptToRefine': 'Please enter an existing {promptType} prompt to refine.',
    'error.enterDraftPrompt': 'Please enter a draft prompt to refine.',
    'error.enterOnePrompt': 'Please enter at least one prompt to get advice on.',
    'error.unknown': 'An unknown error occurred.',
  },
  zh: {
    // Header
    'header.subtitle': 'AI 提示词工程工作台',

    // App Config
    'config.model': 'AI 模型',
    'config.model.description': '指定用于所有提示词生成任务的模型。',
    'config.variables': '提示词变量 (可选)',
    'config.variables.description': '定义 AI 应包含在生成的提示词中的占位符，例如 `{`\`{{user_input}}\``}。',
    'config.variables.add': '添加变量',
    'config.variables.placeholder': '例如 {{user_input}} 或 ${customer_name}',
    
    // System Prompt Architect
    'architect.title': '系统提示词架构师',
    'architect.description': '描述所需的 AI 角色。我们将为您设计一个高性能的系统提示词。',
    'architect.placeholder': '例如，“一个乐于助人的 Python 代码审查员”或“一个社交媒体营销专家”',
    'architect.button.generate': '生成提示词',
    'architect.generated.title': '生成的系统提示词:',

    // Conversational Prompt Refiner
    'refiner.conversational.title': '对话式提示词优化器',
    'refiner.conversational.description': '提供对话上下文和提示词草稿。我们将对其进行优化以获得最大效果。',
    'refiner.conversational.systemPrompt.placeholder': '系统提示词 (可选)',
    'refiner.conversational.history.title': '对话历史',
    'refiner.conversational.history.add': '添加消息',
    'refiner.conversational.history.user': '用户',
    'refiner.conversational.history.ai': 'AI',
    'refiner.conversational.history.contentPlaceholder': '{role} 的内容...',
    'refiner.conversational.draft.placeholder': '您的下一个用户提示词 (必需)',
    'refiner.conversational.button.refine': '优化提示词',
    'refiner.conversational.refined.title': '优化后的用户提示词:',

    // Optimization Advisor
    'optimizer.title': '提示词优化器',
    'optimizer.description': '提供系统和/或用户提示词以获取专业建议并生成优化版本。',
    'optimizer.systemPrompt.placeholder': '系统提示词 (可选)',
    'optimizer.userPrompt.placeholder': '用户提示词 (可选)',
    'optimizer.button.getAdvice': '获取建议',
    'optimizer.suggestions.system': '系统提示词建议',
    'optimizer.suggestions.user': '用户提示词建议',
    'optimizer.suggestions.copy': '复制建议',
    'optimizer.button.apply': '应用建议并优化',
    'optimizer.refined.title.system': '优化后的系统提示词:',
    'optimizer.refined.title.user': '优化后的用户提示词:',

    // System/User Prompt Refiner (General)
    'refiner.system.title': '系统提示词优化器',
    'refiner.user.title': '用户提示词优化器',
    'refiner.system.description': '输入现有的系统提示词。我们将对其进行优化，以提高清晰度、结构和性能。',
    'refiner.user.description': '输入现有的用户提示词。我们将对其进行优化，以提高清晰度、意图和效果。',
    'refiner.system.placeholder': '在此处粘贴您现有的系统提示词...',
    'refiner.user.placeholder': '在此处粘贴您现有的用户提示词...',
    'refiner.system.button': '优化系统提示词',
    'refiner.user.button': '优化用户提示词',
    'refiner.promptType': '提示词类型',
    'refiner.promptType.system': '系统提示词',
    'refiner.promptType.user': '用户提示词',
    'refiner.refined.title': '优化后的{promptType}提示词:',

    // Settings
    'settings.title': 'API 配置',
    'settings.apiKey.label': 'Google Gemini API 密钥',
    'settings.apiKey.placeholder': '在此输入您的 API 密钥',
    'settings.apiKey.description': '密钥存储在您的浏览器本地存储中，并会覆盖环境变量。',
    'settings.apiKey.source.env': '来源: 环境变量 (可覆盖)',
    'settings.apiKey.source.storage': '来源: 本地存储',
    'settings.apiKey.source.none': '未设置。需要提供密钥才能使用该应用。',
    'settings.host.label': 'API 主机',
    'settings.host.placeholder': '默认: generativelanguage.googleapis.com',
    'settings.host.description': '高级用例（如代理）的可选覆盖。留空以使用默认值。',

    // Common terms
    'common.copied': '已复制',
    'common.copyPrompt': '复制提示词',
    'common.copySuggestions': '复制建议',
    'common.save': '保存设置',
    'common.saved': '已保存',
    'common.showSettings': '显示设置',
    'common.hideSettings': '隐藏设置',
    'footer.text': '使用 Liquid Glass 设计系统构建。',
    
    // Errors
    'error.enterDescription': '请输入 AI 角色的描述。',
    'error.enterPromptToRefine': '请输入一个现有的{promptType}提示词以进行优化。',
    'error.enterDraftPrompt': '请输入提示词草稿以进行优化。',
    'error.enterOnePrompt': '请输入至少一个提示词以获取建议。',
    'error.unknown': '发生了未知错误。',
  },
};

type TranslationKeys = keyof typeof translations.en;

export function t(key: TranslationKeys, lang: UiLanguage, options?: Record<string, string>): string {
  let translation = translations[lang][key] || translations['en'][key];
  if (options) {
      Object.keys(options).forEach(optionKey => {
          translation = translation.replace(`{${optionKey}}`, options[optionKey]);
      });
  }
  return translation;
}
