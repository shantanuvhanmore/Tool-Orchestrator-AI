# 🌟 AI Agent Workflow Engine

A powerful Node.js-based AI agent that executes complex tasks through a structured workflow system using OpenAI's GPT models.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

## 🚀 Overview

The **AI Agent Workflow Engine** is an intelligent assistant that breaks down complex tasks into manageable steps using a structured **START → THINK → ACTION → OBSERVE → OUTPUT** workflow. It can execute commands, read files, process data, and make decisions autonomously.

## ✨ Features

- **🤖 Intelligent Task Breakdown** - Complex tasks are decomposed into logical steps
- **🛠️ Tool Ecosystem** - Execute commands, read files, and process data
- **🔒 Safe Execution** - Windows-compatible command execution with error handling
- **📁 File Operations** - Read and analyze project files
- **🌤️ Weather Data** - Built-in weather information tool
- **🔄 Real-time Observation** - Continuous learning from tool outputs
- **🎯 JSON-First Communication** - Structured responses for reliable parsing

## 🏗️ Architecture

```
User Query
    ↓
START Phase
    ↓
THINK Process (Multiple iterations)
    ↓
ACTION (Tool Execution)
    ↓
OBSERVE (Result Analysis)
    ↓
OUTPUT (Final Response)
```

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-agent-workflow-engine.git

# Navigate to project
cd ai-agent-workflow-engine

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

## ⚙️ Configuration

Create a `.env` file with your OpenAI API key:

```env
MY_OPENAI_API_KEY=your_openai_api_key_here
```

## 🎯 Quick Start

```javascript
import { init } from './index.js';

// Start the AI agent with your query
await init("Create a todo list application");
```

## 📚 Available Tools

### 🔧 `executeCommand(command)`
Execute Windows commands safely
```javascript
// Example: List directory contents
executeCommand("dir")
```

### 📄 `readFile(filename)`
Read and analyze file contents
```javascript
// Example: Read package.json
readFile("package.json")
```

### 🌤️ `getWeatherInfo(city)`
Get weather information for any city
```javascript
// Example: Check weather
getWeatherInfo("London")
```

## 🎪 Usage Examples

### Example 1: File Analysis
```javascript
"what is inside my package.json file?"
```
**Workflow:**
1. 🧠 THINK: "User wants package.json contents"
2. 🔨 ACTION: readFile("package.json")
3. 👀 OBSERVE: File content retrieved
4. 🤖 OUTPUT: Structured analysis of package.json

### Example 2: Project Setup
```javascript
"Create a React application with basic components"
```
**Workflow:**
1. 🧠 THINK: "User wants React app setup"
2. 🔨 ACTION: executeCommand("npx create-react-app my-app")
3. 👀 OBSERVE: React app created successfully
4. 🔨 ACTION: executeCommand("cd my-app && dir")
5. 🤖 OUTPUT: Project structure and next steps

### Example 3: Weather Query
```javascript
"What's the weather in Tokyo?"
```
**Workflow:**
1. 🧠 THINK: "User wants Tokyo weather"
2. 🔨 ACTION: getWeatherInfo("Tokyo")
3. 👀 OBSERVE: "Tokyo has 22 Degree C"
4. 🤖 OUTPUT: "Tokyo weather is 22°C - pleasant conditions"

## 🏗️ Project Structure

```
ai-agent-workflow-engine/
├── index.js              # Main application logic
├── package.json          # Project dependencies
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

## 🚀 Advanced Usage

### Custom Tool Integration
Add your own tools to the `TOOLS_MAP`:

```javascript
const TOOLS_MAP = {
  getWeatherInfo: getWeatherInfo,
  executeCommand: executeCommand,
  readFile: readFile,
  // Add your custom tools here
  myCustomTool: (param) => { /* your logic */ }
};
```

### Workflow Customization
Modify the system prompt to change the agent's behavior:

```javascript
const SYSTEM_PROMPT = `Your custom instructions...
Available Tools: [your tool descriptions]
Output Format: [your preferred format]`;
```

## 🔧 Development

```bash
# Run in development mode with file watching
pnpm dev

# Run once
node index.js
```

## 🛡️ Safety Features

- ✅ Command validation and error handling
- ✅ Secure environment variable management
- ✅ Windows command compatibility
- ✅ Loop prevention with step limits
- ✅ JSON schema validation for responses

## 🌟 Use Cases

- **🔄 Automated Project Setup** - Initialize applications and dependencies
- **📊 Code Analysis** - Examine and understand codebases
- **🔍 File System Exploration** - Navigate and analyze project structures
- **🌤️ Data Processing** - Handle various data types and formats
- **🤖 Intelligent Assistance** - Complex problem-solving with step-by-step reasoning

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [OpenAI GPT](https://openai.com/)
- Node.js runtime environment
- Windows command line integration

---

**⭐ Star this repo if you find it helpful!**

**🐛 Found an issue?** Open a ticket in the [issue tracker](https://github.com/yourusername/ai-agent-workflow-engine/issues).

**💡 Have an idea?** We'd love to hear your suggestions!

---

*Built with ❤️ using AI-powered workflow automation*