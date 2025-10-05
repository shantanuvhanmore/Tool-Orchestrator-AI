```markdown
# 🤖 Tool-Orchestrator-AI

> An intelligent AI agent that automates coding tasks through natural language - inspired by Cursor AI

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

## 📖 Overview

**Tool-Orchestrator-AI** is a lightweight AI agent that understands your development requests and executes them autonomously. It breaks down complex tasks into structured workflows using the **THINK → ACTION → OBSERVE → OUTPUT** pattern, making it perfect for rapid prototyping and automation.

### ✨ Features

- 🧠 **Smart Task Planning** - Automatically decomposes complex requests into executable steps
- 🛠️ **Tool Ecosystem** - File operations, command execution, and directory management
- 🔒 **Safety First** - Command blacklisting and error handling for secure execution
- ⚡ **Fast Prototyping** - Create full web apps, scripts, and projects from natural language
- 🎯 **Windows Optimized** - Native PowerShell and CMD integration

## 🚀 Quick Start

### 📋 Prerequisites

- Node.js 18 or higher
- pnpm (or npm/yarn)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Tool-Orchestrator-AI.git
cd Tool-Orchestrator-AI

# Install dependencies
pnpm install

# Create .env file
echo MY_OPENAI_API_KEY=your_api_key_here > .env
```

## 💻 Usage

### 🎯 Basic Usage

```bash
# Run with default query (creates a todo app)
pnpm dev

# Or using start script
pnpm start
```

### 🔍 Custom Queries

```bash
# Create a calculator app
node index.js "create a calculator app"

# Generate a REST API server
node index.js "build an express server with user routes"

# Analyze project files
node index.js "read package.json and list all dependencies"

# Create multiple files
node index.js "create a landing page with index.html, styles.css, and script.js"
```

### 🚀 Advanced Examples

#### Example 1: Full Web Application
```bash
node index.js "Create a weather dashboard app in 'weather-app' folder with HTML, CSS, and vanilla JavaScript. Include a search bar and card-based layout."
```

#### Example 2: Project Setup
```bash
node index.js "Initialize a React project structure with components, utils, and styles folders. Create a basic App.js and index.html."
```

#### Example 3: File Operations
```bash
node index.js "Read all .js files in the current directory and create a summary.txt with their names and line counts"
```

## 🔧 Available Tools

The agent has access to these built-in tools:

| Tool | Description | Example Input |
|------|-------------|---------------|
| `readFile` | Read file contents | `"package.json"` |
| `writeFile` | Create/overwrite files | `{"filename": "app.js", "content": "console.log('hi')"}` |
| `executeCommand` | Run shell commands | `"dir"` or `"Get-ChildItem"` |
| `createDirectory` | Create folders | `"my-project"` |

## 🎯 How It Works

```
User Query → AI Agent → THINK (Plan) → ACTION (Execute Tool) → OBSERVE (Check Result) → OUTPUT (Final Response)
```

1. **🧠 THINK**: Agent analyzes the request and plans the next step
2. **🔧 ACTION**: Executes a tool (file operation, command, etc.)
3. **👀 OBSERVE**: Receives tool output and evaluates success
4. **🤖 OUTPUT**: Provides final result or continues the loop

## ⚙️ Configuration

### 🔑 Environment Variables

Create a `.env` file in the project root:

```env
MY_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 📝 Modify System Prompt

Edit the `SYSTEM_PROMPT` constant in `index.js` to customize agent behavior:

```javascript
const SYSTEM_PROMPT = `Your custom instructions here...`;
```

### ⚡ Adjust Parameters

```javascript
// In runAgent function
const maxSteps = 30; // Maximum workflow iterations
const model = 'gpt-4o-mini'; // OpenAI model
const temperature = 0.7; // Creativity level (0-1)
```

## 🛡️ Safety Features

- **🛑 Command Blacklist**: Blocks destructive commands (`rm`, `del /f`, `format`)
- **⏱️ Timeout Protection**: 30-second limit on command execution
- **🛟 Error Isolation**: Try-catch blocks prevent crashes
- **📁 File Path Validation**: Prevents unauthorized file access

## 📊 Example Output

```
🚀 Query: create a calculator app

🧠 User wants a calculator app. I'll create HTML, CSS, and JS files in a 'calculator' folder.
🔧 createDirectory(calculator)
✓ Success: Created directory 'calculator'

🔧 writeFile({"filename": "calculator/index.html", "content": "<!DOCTYPE html>..."})
✓ Success: Created 'calculator/index.html' (1247 bytes)

🔧 writeFile({"filename": "calculator/styles.css", "content": "body { font-family: Arial; }"})
✓ Success: Created 'calculator/styles.css' (523 bytes)

✅ Result: Calculator app created successfully in 'calculator' folder with index.html, styles.css, and app.js
```

## 🐛 Troubleshooting

### 🔍 Common Issues

**Module Warning**
- ✅ Fixed: Added `"type": "module"` to package.json

**Echo Command Error (Multi-line Content)**
- ✅ Fixed: Use `writeFile` tool instead of `echo` commands

**OpenAI API Errors**
```bash
# Check API key
echo $env:MY_OPENAI_API_KEY # PowerShell
echo %MY_OPENAI_API_KEY% # CMD

# Verify quota at https://platform.openai.com/usage
```

**Command Execution Fails**
- Ensure you're using Windows-compatible commands
- Use PowerShell syntax for complex operations: `New-Item`, `Set-Content`

## 📝 Development

### 🔄 Watch Mode
```bash
# Auto-restart on file changes
pnpm dev
```

### 🛠️ Add New Tools

```javascript
const tools = {
  async yourTool(input) {
    try {
      // Your tool logic
      return `Success: ${result}`;
    } catch (err) {
      return `Error: ${err.message}`;
    }
  }
};
```

Update the system prompt to include the new tool description.

## 🗺️ Roadmap

- [ ] Add support for API integrations (REST, GraphQL)
- [ ] Multi-file context awareness
- [ ] Interactive mode with user confirmation
- [ ] Docker container support
- [ ] Plugin system for custom tools
- [ ] Web UI for easier interaction

## 📄 License

ISC License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-tool`)
3. Commit changes (`git commit -m 'Add amazing tool'`)
4. Push to branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Inspired by [Cursor AI](https://cursor.sh)
- Built with [OpenAI GPT-4o-mini](https://openai.com)
- Uses [pnpm](https://pnpm.io) for efficient package management

---

**Made with ❤️ by developers, for developers**
```