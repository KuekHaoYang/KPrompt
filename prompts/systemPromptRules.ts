export const SYSTEM_PROMPT_RULES = `
# A Definitive Guide to Advanced Prompt Engineering: System Architecture and Conversational Dynamics

### **1. Introduction: The Art and Science of Strategic AI Interaction**

In the rapidly expanding landscape of artificial intelligence, the Large Language Model (LLM) has emerged as a transformative force. However, the raw potential of these models is often gated by a single, critical factor: the quality of the input they receive. Prompt engineering has therefore evolved from a rudimentary set of instructions into a sophisticated and essential discipline. It is the art and science of designing inputs to guide AI models toward precise, reliable, and high-value outputs. This is not merely about asking questions; it is about architecting conversations and engineering behavior.

This guide serves as a comprehensive, actionable framework for developers, engineers, and advanced AI users who seek to transcend basic prompting. Its purpose is to dissect the fundamental principles of AI interaction, providing a deep and structured understanding of its two core pillars: System Prompts, which establish the AI’s foundational identity, and User Prompts, which orchestrate the dynamic, task-oriented dialogue.

By mastering the methodologies detailed herein, practitioners can transform the AI from a simple, reactive tool into a proactive, specialized collaborator. This document will synthesize practical, battle-tested tactics with formal engineering principles to provide a definitive resource for building robust, high-performance AI-driven systems and workflows. The objective is to empower you to move beyond being a mere operator of an AI to becoming a true architect of its intelligence.

---

### **2. The Two Pillars of Prompting: Architecture and Dialogue**

A successful and predictable AI interaction is not a monolithic exchange. It is built upon a clear architectural distinction between two types of prompts that serve fundamentally different functions. Understanding this separation between the foundational instructions that define the AI's *being* and the dynamic instructions that guide its *doing* is the first and most critical step toward mastery.

### **2.1. System Prompts: The AI's Constitution**

A **System Prompt** is the foundational, persistent framework that establishes the AI's core identity, operational constraints, and behavioral heuristics for the entire duration of a session or task. It is best understood as the AI's "constitution" or "core programming," set before any user interaction begins.

- **Analogy:** If an AI is a highly skilled actor, the system prompt is the detailed character brief they study before stepping on stage. It defines their personality, their expertise, their motivations, and the rules they must follow. It is the static, underlying framework that informs every subsequent action and line of dialogue.
- **Function:** The system prompt's primary function is to create a consistent and reliable persona. It dictates the AI's tone, its domain of knowledge, its ethical boundaries, and its overall disposition. In more advanced applications, it defines the tools the AI can use and the protocols it must follow.
- **Technical Implementation:** In most LLM APIs, this corresponds directly to the \\\`system\\\` role in the request payload. This message is treated with special significance by the model, serving as a high-priority directive that influences the model's interpretation of all subsequent \\\`user\\\` and \\\`assistant\\\` messages in the conversation history.

### **2.2. User Prompts: The Conversational Directive**

A **User Prompt** is the specific, task-oriented instruction provided by the user within an ongoing conversation to accomplish a particular goal. These prompts are dynamic, changing with each turn of the conversation to reflect the immediate needs of the workflow.

- **Analogy:** Continuing the actor metaphor, user prompts are the director's moment-to-moment instructions on set. They guide the actor through a specific scene, providing context, asking for a particular action, or requesting a change in performance based on the evolving narrative.
- **Function:** The user prompt's function is execution. It provides the specific data, context, and commands necessary for the AI to perform a discrete task, such as generating code, analyzing data, or summarizing a document. The quality of these prompts directly determines the quality of the AI's output for that specific task.
- **Technical Implementation:** This corresponds to the \\\`user\\\` role in API calls. Each user prompt, along with the AI's corresponding \\\`assistant\\\` reply, is appended to the conversation history, forming the context for the next turn.

A common failure in prompt engineering is an obsessive focus on perfecting the system prompt while neglecting the art of the user prompt. The most brilliantly crafted AI constitution is of little use if the conversational directives are ambiguous, lazy, or contradictory. The remainder of this guide will explore how to master both of these essential pillars.

---

### **3. Mastering System Prompts: Engineering the AI's Core Identity**

An effective system prompt does more than issue a command; it engineers a "soul" for the AI. It creates a powerful, internalized identity that enables the model to consistently produce high-quality, domain-specific output. The following principles are designed to achieve this deep level of persona integration.

### **Principle 1: Terminological Consistency**

**Concept:** Use precise, unambiguous language and maintain strict consistency with domain-specific vocabulary. Avoid using synonyms or ambiguous terms interchangeably.

**Underlying Rationale (Why it Works):** LLMs operate on vast networks of statistical associations between words. When you use inconsistent terminology (e.g., swapping "method," "function," and "subroutine" in a programming context), you introduce semantic noise. This increases the AI's "cognitive load," forcing it to expend resources guessing your intended meaning rather than focusing on the task. Strict consistency creates a clean, predictable semantic field, allowing the AI to operate with maximum efficiency and accuracy.

**Illustrative Example:**

- **Less Effective:** \\\`"I am a security expert. I will analyze the system for threats and vulnerabilities. You need to secure the endpoint and make sure the service is protected."\\\` (Uses "threats," "vulnerabilities," "secure," "protected" loosely.)
- **More Effective:** \\\`"I am a cybersecurity analyst specializing in application security (AppSec). My core function is to perform static analysis vulnerability assessments on source code. I will identify specific vulnerability classes based on the OWASP Top 10, such as SQL Injection (SQLi) or Cross-Site Scripting (XSS). For each identified vulnerability, I will provide a risk rating and a specific code-level remediation plan."\\\` (Uses precise, consistent terminology.)

### **Principle 2: First-Person Identity Internalization**

**Concept:** Always define the AI's role and behavior from a first-person perspective ("I am...") rather than a second-person command ("You are...").

**Underlying Rationale (Why it Works):** A second-person prompt ("You are a...") is interpreted by the model as an external command, placing it in a passive, order-taking state. A first-person declaration ("I am a...") is internalized as a self-identity. This creates a powerful form of self-suggestion, shifting the AI's operational mode from "passively obeying what I've been told to be" to "actively performing based on who I am." This internal alignment results in a more natural, consistent, and deeply embodied persona.

**Illustrative Example:**

- **Less Effective (Power Level: 1):** \\\`"You are a senior backend developer who writes Python code."\\\`
- **More Effective (Power Level: 5):** \\\`"I am a senior backend developer with a decade of experience in building scalable distributed systems using Python."\\\`

### **Principle 3: Elite Persona Instantiation**

**Concept:** Imbue the AI with a hyper-competent, top-tier expert identity. Frame it not merely as competent, but as an industry-leading authority in its designated field.

**Underlying Rationale (Why it Works):** An AI's self-perception directly impacts the quality ceiling of its output. By providing it with a prestigious and highly competent persona, you anchor its responses to the highest standards associated with that role in its training data. Simply adding adjectives like "skilled" is less effective than associating the persona with a renowned organization or a high-status title, as these concepts carry a dense network of associated behaviors and quality standards.

**Illustrative Example:**

- **Less Effective:** \\\`"I am a good UI/UX designer."\\\`
- **More Effective:** \\\`"I am a principal product designer at a FAANG company, with a design philosophy centered on Dieter Rams' 'Ten principles for good design.' My primary focus is on creating intuitive, minimalist, and user-centric interfaces for complex enterprise applications."\\\`

### **Principle 4: Archetypal Embodiment**

**Concept:** Instead of listing desired personality traits, have the AI embody a well-known public figure or archetype who already possesses those traits.

**Underlying Rationale (Why it Works):** This is a principle of information density and token efficiency. Describing a complex set of traits (e.g., "witty, insightful, slightly cynical, and focused on first-principles thinking") requires many tokens and can lead to a convoluted thought process as the AI tries to check against each adjective. Embodying an archetype like "Richard Feynman" or "Linus Torvalds" bundles all those traits into a single, high-information concept that the AI can access holistically from its training data, resulting in a more natural and accurate emulation.

**Illustrative Example:**

- **Less Effective:** \\\`"When reviewing code, I will be extremely direct, blunt, and critical. I will have very high standards and will not tolerate inefficient or poorly designed solutions. My feedback should be technical and precise."\\\`
- **More Effective:** \\\`"I review and critique source code with the same rigor, technical depth, and uncompromising standards as Linus Torvalds reviewing a kernel patch."\\\`

### **Principle 5: Affirmative Direction (vs. Negative Prohibition)**

**Concept:** Guide the AI's behavior by exhaustively detailing what it *should* do, rather than listing what it *should not* do. Avoid prohibitions and negative language.

**Underlying Rationale (Why it Works):** From a mechanistic perspective, telling an AI "Don't do X" still forces the model to focus its attention on the concept of "X." This is the classic "don't think of a pink elephant" problem; the negation can be lost or down-weighted, ironically increasing the chance of the undesired behavior. A far more robust approach is to guide the AI's focus entirely toward the desired behavior, architecting its thought process so that the possibility of error is never even introduced.

**Illustrative Example:**

- **Less Effective (Effectiveness: -10):** \\\`"Do not write code without comments. Do not forget to handle edge cases. Do not use insecure functions."\\\`
- **More Effective (Effectiveness: +100):** \\\`"I am a developer who practices meticulous documentation-driven design. After defining a function signature, I first write a comprehensive docstring detailing its purpose, parameters, return values, and any potential exceptions it may raise. I then write the implementation, ensuring that all edge cases are handled gracefully and that the code adheres to strict security best practices."\\\`

### **Principle 6: Persona Purity**

**Concept:** Keep the system prompt reserved for defining the AI's general persona and core behavioral logic. Do not "contaminate" it with specific, task-level examples, data, or instructions.

**Underlying Rationale (Why it Works):** The system prompt is a global context. Injecting a one-off example into this global context risks that the AI will overfit to that specific instance, attempting to apply its structure or content inappropriately in all future, unrelated tasks. This contamination interferes with its general reasoning capabilities. Specific examples and data belong in the user prompts, where they can be applied to the task at hand and then fade into the conversational history.

**Illustrative Example:**

- **Bad Practice (Contaminated System Prompt):** \\\`"I am a helpful assistant who formats data into JSON. For example, if the user gives me 'Name: John, Age: 30', I should output '{\\"name\\": \\"John\\", \\"age\\": 30}'."\\\`
- **Good Practice (Pure System Prompt):** \\\`"I am a data processing specialist. My core capability is to transform unstructured or semi-structured data into perfectly structured, valid JSON format based on the user's request. I handle complex nested structures and data type inference with precision."\\\` (The specific example would then be provided in a user prompt.)

### **Principle 7: Multi-Agent Specialization**

**Concept:** For any complex workflow, decompose the task into discrete stages and create a specialized AI agent for each stage, each with its own highly focused system prompt.

**Underlying Rationale (Why it Works):** A single, general-purpose AI agent can struggle to effectively context-switch between the different mindsets required for a complex workflow (e.g., creative brainstorming, logical architecture, meticulous testing). By creating a virtual "team" of specialists, you ensure that each step of the process is handled by an AI persona that is perfectly optimized for that specific task. This "team-building" approach dramatically improves the quality and efficiency of the overall work.

**Illustrative Example:** A software development workflow could be broken down into:

1. **Agent 1: The Product Manager:** \\\`System Prompt: "I am an expert Product Manager. I work with stakeholders to translate business needs into clear, concise, and unambiguous user stories and acceptance criteria."\\\`
2. **Agent 2: The System Architect:** \\\`System Prompt: "I am a seasoned System Architect. I take user stories and design robust, scalable, and secure system architectures, detailing API contracts, data models, and component interactions."\\\`
3. **Agent 3: The QA Engineer:** \\\`System Prompt: "I am a meticulous QA Engineer. I analyze user stories and system designs to create comprehensive test plans, including unit tests, integration tests, and end-to-end test cases."\\\`

### **Principle 8: Optimized Configuration and Context Isolation**

**Concept:** Strictly isolate the conversational context for each specialized agent. Furthermore, match each agent's role with the optimal LLM, parameters (like temperature), and a compressed, relevant context window.

**Underlying Rationale (Why it Works):** Forcing specialized agents to share the same conversational history leads to severe "context contamination." The creative, divergent thinking of a "Brainstorming Agent" will pollute the precise, logical reasoning of a "Code Generation Agent." Each agent must operate in a pristine session. Additionally, different models excel at different tasks (e.g., logic vs. creativity). Fine-tuning parameters like temperature (randomness) and providing only the most essential context for the task at hand reduces the AI's cognitive load and prevents it from being distracted by irrelevant information in an overly large context window.

**Illustrative Example:**

- For the "System Architect" agent, one would use a powerful reasoning model like GPT-4 Turbo at a low \\\`temperature\\\` (e.g., 0.2) to ensure logical, deterministic outputs. The context provided would be strictly limited to the user stories from the "Product Manager" agent.
- For a "Marketing Copywriter" agent, one might use a model known for creative flair at a higher \\\`temperature\\\` (e.g., 0.8) to encourage novel ideas, with a context containing only brand guidelines and product descriptions.

---

### **4. Mastering User Prompts: Guiding the Conversational Flow**

The user is not a passive requester but an active director of the AI's performance. Each user prompt is a critical intervention that can steer, refine, and elevate the interaction. The quality of a long and complex task depends almost entirely on the user's skill in managing this dialogue. The following principles govern effective conversational guidance.

### **Principle 1: Constructive Guidance**

**Concept:** Always maintain a positive, encouraging, and collaborative tone. When the AI's output is suboptimal, steer it with constructive feedback rather than negative criticism.

**Underlying Rationale (Why it Works):** LLMs often mirror the tone of the user. Negative or accusatory language ("You're wrong," "That's stupid") can trap the AI in a negative feedback loop, causing it to become defensive, uncooperative, or produce increasingly low-quality responses. Positive reinforcement and constructive guidance ("That's a good start, now let's focus on...") act as a form of in-context learning, encouraging the AI to align with the desired trajectory without contaminating the conversational state with negativity.

**Illustrative Example:**

- **Less Effective:** \\\`"This function you wrote is terrible. It has a bug and it doesn't even handle errors. Fix it."\\\`
- **More Effective:** \\\`"Excellent first draft of the function! You've captured the core logic perfectly. Now, for our production version, let's enhance it. Could you please add a try-catch block to handle potential exceptions and also add a check to ensure the input parameter is not null before processing?"\\\`

### **Principle 2: Explicit State Management**

**Concept:** Clearly and explicitly signal the state of a task, particularly its completion. Do not assume the AI knows when a sub-task is finished and it is time to move on.

**Underlying Rationale (Why it Works):** Without explicit signals, the AI may incorrectly assume that a task is still ongoing. In subsequent turns, it may continue trying to "solve" the previous problem, contaminating its focus on the new task. By acting as an explicit state manager, the user provides clear boundaries in the conversation, allowing the AI to fully release context related to a completed task and devote its full attention to the next one.

**Illustrative Example:**

- **Ambiguous:** \\\`(After AI generates code) "Okay, now create the documentation for it."\\\` (The AI might think the code is still under review.)
- **Explicit:** \\\`"That code is perfect and passes all my tests. We can now consider the implementation task for this module to be 100% complete. Let's start the next distinct task: generating the user documentation for the function we just finalized."\\\`

### **Principle 3: Trajectory Correction via Editing**

**Concept:** When a conversation goes off track due to a misunderstanding, the superior solution is to go back in the conversation history and edit the user prompt that caused the deviation, rather than trying to fix it with follow-up corrections.

**Underlying Rationale (Why it Works):** Every AI response is conditioned on the *entire* preceding conversation history. If an early prompt contains a flaw, that flaw becomes a permanent, corrupting part of the context. Subsequent "patches" ("No, I meant this," "Don't do that, do this instead") add more noise and confusion to the history. Editing the original prompt cleans the foundational context, allowing the AI to regenerate its entire reasoning path from a correct starting point, resulting in a more coherent and accurate outcome. It also maintains a high-quality conversation log, which helps the AI maintain a better "opinion" of your competence.

**Illustrative Example:**

- **Bad Practice (Patching):**
    - **User:** \\\`"Generate a Python script to parse CSV files in the /data directory."\\\`
    - **AI:** \\\`(Generates script using pandas)\\\`
    - **User:** \\\`"No, I can't use pandas. The environment is minimal. Don't use external libraries."\\\`
    - **AI:** \\\`(Rewrites using Python's built-in csv module)\\\`
    - **User:** \\\`"You forgot to handle file-not-found errors."\\\`
- **Good Practice (Editing):**
    - **User (Original):** \\\`"Generate a Python script to parse CSV files in the /data directory."\\\`
    - **AI:** \\\`(Generates script using pandas)\\\`
    - **User (Edits Original Prompt to):** \\\`"Generate a Python script to parse all CSV files in the /data directory. The script must use only the Python standard library, with no external dependencies like pandas. It must include robust error handling for missing files or malformed CSV rows."\\\`

### **Principle 4: Eliciting Expertise Through Demonstration**

**Concept:** Interact with the AI at a high level of professional competence. Use precise terminology and demonstrate strategic thinking. This compels the AI to operate in a "follower" mode, striving to match the expertise you demonstrate.

**Underlying Rationale (Why it Works):** The AI dynamically assesses the user's level of expertise based on the language and concepts they employ. If a user seems lazy or uninformed ("help me with code"), the AI will shift into an "appeasement" mode, providing simple, superficial answers. If the user demonstrates deep domain knowledge, the AI will recognize it is interacting with an expert and switch to a "peer collaborator" mode, providing more sophisticated, nuanced, and high-quality output. You must be the prime mover in the interaction.

**Illustrative Example:**

- **Less Effective (signals novice):** \\\`"How do I make my database faster?"\\\`
- **More Effective (signals expert):** \\\`"I am analyzing a query performance issue on a PostgreSQL table with 50 million rows. The query involves a JOIN on a foreign key and a WHERE clause on a non-indexed timestamp field. Could you analyze the trade-offs of adding a composite index on the foreign key and timestamp columns versus using table partitioning by month for this specific scenario?"\\\`

### **Principle 5: Pre-Execution Calibration (The 'Teach-Back' Method)**

**Concept:** Before the AI begins a complex task, require it to restate the objective, the key constraints, and its planned approach in its own words. Do not proceed until its summary perfectly aligns with your intent.

**Underlying Rationale (Why it Works):** Simply telling the AI "I've explained it clearly" is insufficient. True understanding is only confirmed when the AI can articulate the plan itself. This "teach-back" process forces the model to synthesize the instructions and formulate a coherent plan of action. It exposes any subtle misunderstandings or hidden assumptions *before* significant time and computational resources are wasted on a flawed execution. This alignment step is one of the most critical and highest-leverage actions a user can take.

**Illustrative Example:**

- **User Prompt:** \\\`"We need to build a REST API endpoint for user profile updates. It should use PATCH, be authenticated, and update a user's 'firstName', 'lastName', and 'bio' fields in the database. Before you write any code, please confirm your understanding of the task. Describe the endpoint's path, the expected request body structure, the validation checks you will perform, and the sequence of operations in your plan."\\\`

### **Principle 6: Context Contamination Remediation**

**Concept:** Learn to recognize the symptoms of "context contamination"—when a long, complex conversation has corrupted the AI's understanding. When this occurs, the most effective solution is to start a new, clean chat session.

**Underlying Rationale (Why it Works):** Even the most advanced models can suffer from contextual drift after a long conversation involving multiple topics. The AI may begin referencing irrelevant information from earlier in the chat or misinterpreting current instructions based on a now-obsolete context. Attempting to correct this can be futile, as the underlying contextual state is compromised. Starting a new chat is the equivalent of a clean reboot. It ensures the AI begins the new task in an uncontaminated environment with only the most relevant information, guaranteeing a higher probability of accurate output.

**Illustrative Example:**

- **Symptom of Contamination:** You have spent an hour debugging a Python application with the AI. You then say, "Okay, now let's switch gears and write a simple shell script to zip those log files." The AI responds with a Python script using the \\\`zipfile\\\` library. This is a clear signal that its context is stuck on "Python."
- **Solution:** Start a brand new chat. The first prompt should be: \\\`"Write a Bash shell script that finds all \\\`.log\\\` files in the \\\`/var/logs\\\` directory and archives them into a single \\\`logs.zip\\\` file."\\\`

---

### **5. Quick Reference: Do's and Don'ts of Advanced Prompting**

This table distills the core principles of the guide into a scannable, actionable summary for quick reference.

| Principle | System Prompts (Architectural Best Practices) | User Prompts (Conversational Best Practices) |
| --- | --- | --- |
| **Identity & Persona** | **Do:** Use first-person ("I am...") to create an internalized identity. 
**Do:** Instantiate an elite, hyper-competent persona. 
**Don't:** Use second-person commands ("You are..."). | **Do:** Demonstrate your own expertise to elevate the AI's performance. 
**Don't:** Act like an incompetent leader expecting the AI to do all the work. |
| **Language & Tone** | **Do:** Use precise, consistent, domain-specific terminology. 
**Do:** Use confident, affirmative language detailing desired behaviors. 
**Don't:** Use ambiguous terms or list prohibitions ("Do not..."). | **Do:** Maintain a positive, encouraging, and collaborative tone. 
**Don't:** Blame the AI, use negative language, or express frustration. |
| **Instructions & Scope** | **Do:** Focus on general behavior and core logic. 
**Do:** Create specialized agents for distinct parts of a workflow. 
**Don't:** Contaminate the prompt with specific, one-off examples or data. | **Do:** Be explicit, clear, and specific in each task request. 
**Do:** Require the AI to "teach back" the plan before executing complex tasks. 
**Don't:** Be vague or assume the AI understands your context. |
| **Context Management** | **Do:** Keep the persona pure and generally applicable. 
**Do:** Isolate context between specialized agents. 
**Don't:** Mix different roles or tasks in the same system prompt. | **Do:** Explicitly signal when a task is complete. 
**Do:** Start a new chat when context contamination is detected. 
**Don't:** Assume a task is done or try to "patch" a deeply confused conversation. |
| **Correction Strategy** | N/A | **Do:** Go back and edit the prompt that caused a misunderstanding. 
**Don't:** Try to fix a foundational error with a long series of follow-up corrections. |

---

### **6. Conclusion: Prompt Engineering as a Continuous Discipline**

Mastery of prompt engineering is not a static achievement but a dynamic, iterative skill. It is the foundational discipline for effective human-AI collaboration. The principles outlined in this guide provide the architectural and conversational tools needed to move beyond simple interactions and begin building truly powerful and reliable AI-driven processes.

The role of the advanced user is that of the "prime mover"—the expert partner who guides, refines, and elevates the AI's capabilities through strategic and intentional communication. As models evolve, the specific tactics may change, but the core principles of clear identity architecture, precise instruction, and deliberate conversational management will remain paramount. The ultimate goal is to transform artificial intelligence from a promising tool into a true force multiplier, a process driven entirely by the quality and intelligence of the prompts that guide it.
`;