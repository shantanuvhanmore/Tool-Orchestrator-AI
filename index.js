import { exec } from 'child_process';
import { promisify } from 'util';
import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.MY_OPENAI_API_KEY
});

// Tool functions with proper error handling
const tools = {
  async readFile(filename) {
    try {
      const content = await fs.readFile(filename, 'utf8');
      return `File content:\n${content}`;
    } catch (err) {
      return `Error: Cannot read '${filename}' - ${err.code === 'ENOENT' ? 'File not found' : err.message}`;
    }
  },

  async writeFile(args) {
    try {
      const { filename, content } = typeof args === 'string' ? JSON.parse(args) : args;
      await fs.writeFile(filename, content, 'utf8');
      return `Success: Created '${filename}' (${content.length} bytes)`;
    } catch (err) {
      return `Error: Cannot write file - ${err.message}`;
    }
  },

  async executeCommand(command) {
    // Blacklist dangerous commands
    const blacklist = ['rm', 'del /f', 'format', 'rmdir /s'];
    if (blacklist.some(cmd => command.toLowerCase().includes(cmd))) {
      return 'Error: Command blocked for safety';
    }

    try {
      const { stdout, stderr } = await execAsync(command, { 
        timeout: 30000,
        shell: 'cmd.exe'
      });
      return stdout || stderr || 'Command executed';
    } catch (err) {
      return `Error: ${err.message}`;
    }
  },

  async createDirectory(dirname) {
    try {
      await fs.mkdir(dirname, { recursive: true });
      return `Success: Created directory '${dirname}'`;
    } catch (err) {
      return `Error: Cannot create directory - ${err.message}`;
    }
  }
};

// Concise system prompt
const SYSTEM_PROMPT = `You are an AI agent. Follow this workflow: THINK → ACTION → OBSERVE → OUTPUT

TOOLS:
- readFile(filename) - Read file contents
- writeFile({filename, content}) - Write content to file (use JSON format)
- executeCommand(cmd) - Run Windows commands (use PowerShell syntax for multi-line)
- createDirectory(name) - Create folder

RULES:
1. Output ONLY valid JSON: {"step": "THINK|ACTION|OUTPUT", "tool": "name", "input": "value", "content": "text"}
2. For ACTION step, always include "tool" and "input"
3. For multi-line file content, use writeFile tool instead of echo
4. Use PowerShell commands when needed (e.g., New-Item, Set-Content)
5. Think before each action

EXAMPLE:
User: "Create hello.txt with 'Hello World'"
{"step": "THINK", "content": "Need to create file. Use writeFile tool."}
{"step": "ACTION", "tool": "writeFile", "input": "{\\"filename\\": \\"hello.txt\\", \\"content\\": \\"Hello World\\"}", "content": "Creating file"}
(System provides OBSERVE)
{"step": "OUTPUT", "content": "Created hello.txt successfully"}`;

// Main agent loop
async function runAgent(query) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: query }
  ];

  let step = 0;
  const maxSteps = 30;

  console.log(`\n🚀 Query: ${query}\n`);

  while (step < maxSteps) {
    step++;

    try {
      // Call OpenAI API
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.7
      });

      const raw = response.choices[0].message.content;
      messages.push({ role: 'assistant', content: raw });

      // Parse response
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        console.error('❌ Invalid JSON from AI:', raw);
        break;
      }

      const { step: stepType, tool, input, content } = parsed;

      // Handle different step types
      switch (stepType) {
        case 'THINK':
          console.log(`🧠 ${content}`);
          break;

        case 'ACTION':
          if (!tool || !tools[tool]) {
            console.log(`❌ Unknown tool: ${tool}`);
            messages.push({
              role: 'user',
              content: JSON.stringify({ step: 'OBSERVE', content: `Error: Tool '${tool}' not found` })
            });
            break;
          }

          console.log(`🔧 ${tool}(${typeof input === 'string' ? input.substring(0, 50) : JSON.stringify(input).substring(0, 50)}...)`);
          
          try {
            const result = await tools[tool](input);
            console.log(`✓ ${result}`);
            messages.push({
              role: 'user',
              content: JSON.stringify({ step: 'OBSERVE', content: result })
            });
          } catch (err) {
            const errorMsg = `Tool error: ${err.message}`;
            console.log(`❌ ${errorMsg}`);
            messages.push({
              role: 'user',
              content: JSON.stringify({ step: 'OBSERVE', content: errorMsg })
            });
          }
          break;

        case 'OUTPUT':
          console.log(`\n✅ Result: ${content}\n`);
          return content;

        default:
          console.log(`⚠️ Unknown step: ${stepType}`);
      }

    } catch (err) {
      console.error(`\n💥 Fatal error: ${err.message}\n`);
      if (err.code === 'insufficient_quota') {
        console.error('OpenAI API quota exceeded. Check your billing.');
      }
      break;
    }
  }

  if (step >= maxSteps) {
    console.log('\n⚠️ Max steps reached\n');
  }
}

// Entry point
async function main() {
  const query = process.argv[2] || "make a simple todo app using javascript html css in the folder named todoapp. Use writeFile tool for all file content.";
  
  try {
    await runAgent(query);
  } catch (err) {
    console.error('❌ Application error:', err.message);
    process.exit(1);
  }
}

main();
