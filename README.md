# KPrompt: AI Prompt Engineering Workbench

> A specialized workbench for developers to engineer high-performance AI interactions, featuring a System Prompt Architect and a Conversational Prompt Refiner.

KPrompt is a sophisticated, web-based tool designed for prompt engineers and developers looking to master the art of AI communication. It provides two specialized modules: the **System Prompt Architect** for crafting robust AI personas and the **Conversational Prompt Refiner** for optimizing user prompts within a given conversational context. Built with a sleek "Liquid Glass" design system, KPrompt offers an intuitive and powerful environment for developing, testing, and refining AI prompts to achieve maximum performance and reliability.

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Key Features

-   **System Prompt Architect**: Generate high-performance system prompts from simple descriptions of an AI persona.
-   **Conversational Prompt Refiner**: Refine user prompts by providing conversational history and a system prompt for context.
-   **Model Selection**: Choose the Gemini model to power the prompt generation.
-   **Liquid Glass UI**: A beautiful, modern, and responsive interface with light and dark modes.
-   **Copy to Clipboard**: Easily copy generated prompts for use in your applications.

## Technology Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS (via CDN), Custom CSS-in-HTML
-   **AI**: Google Gemini API via `@google/genai`

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
-   An active internet connection.
-   A Google Gemini API Key.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/kprompt.git
    cd kprompt
    ```

2.  **Set up your environment variables:**
    This project expects the API key to be available as an environment variable. In a real-world scenario, you would use a bundler like Vite or Create React App and create a `.env` file. For this project structure, ensure the `process.env.API_KEY` is accessible in the execution environment.

    Create a `.env` file in the root of your project:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

3.  **Run the application:**
    You will need a local development server. If you are using a tool like `live-server`, you can run it from the project root.

## Usage

1.  Open the `index.html` file in your browser.
2.  **System Prompt Architect**:
    -   Select the desired Gemini model from the dropdown.
    -   Enter a simple description of the AI persona you want to create (e.g., "a helpful code reviewer for Python").
    -   Click "Generate Prompt".
    -   The engineered system prompt will appear below. You can copy it using the copy button.
3.  **Conversational Prompt Refiner**:
    -   Optionally, provide a system prompt that sets the context for the conversation.
    -   Add messages to build the conversation history, setting the role for each message (User or AI).
    -   Enter the user prompt you want to refine in the "Your Next User Prompt" text area.
    -   Click "Refine Prompt".
    -   The improved, context-aware user prompt will be generated.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
