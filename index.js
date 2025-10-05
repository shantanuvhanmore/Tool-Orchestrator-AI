import { exec } from 'child_process';
import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs/promises';
import http from 'http'; 

const client = new OpenAI({
  apiKey: process.env.MY_OPENAI_API_KEY 
});


async function readFile(filename) {
  try {
    const content = await fs.readFile(filename, 'utf8');
    return content;
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      resolve(`stdout: ${stdout}\nstderr: ${stderr}`);
    });
  });
}

function getWeatherInfo(cityname) {
  return `${cityname} has 32 Degree C`;
};

const TOOLS_MAP = {
  getWeatherInfo: getWeatherInfo,
  executeCommand: executeCommand,
  readFile: readFile 
};

const SYSTEM_PROMPT = `You are an AI assistant that operates in steps: START → THINK → ACTION → OBSERVE → OUTPUT.

ENVIRONMENT: Windows OS

Available Tools:
- getWeatherInfo(city)
- executeCommand(windows_commands_only)
- readFile(filename)

Rules:
• Output only JSON format shown below
• One step per response
• Wait for OBSERVE before next step

Output Format:
{"step": "THINK|ACTION|OUTPUT", "tool": "tool_name", "input": "parameter", "content": "text"}

Examples:

START: What is weather of Pune?
{"step": "THINK", "content": "User wants Pune weather. Use getWeatherInfo tool."}
{"step": "ACTION", "tool": "getWeatherInfo", "input": "Pune", "content": "Getting weather data"}
{"step": "OBSERVE", "content": "32 Degree C"}
{"step": "THINK", "content": "Weather is 32°C. Now provide final answer."}
{"step": "OUTPUT", "content": "Pune weather is 32°C - very hot!"}

START: Create a todo list app
{"step": "THINK", "content": "User wants a todo app. Need to create files and structure."}
{"step": "THINK", "content": "First, check current directory contents."}
{"step": "ACTION", "tool": "executeCommand", "input": "dir", "content": "Listing files"}
{"step": "OBSERVE", "content": "file1.txt, file2.js"}
{"step": "THINK", "content": "Now create HTML, CSS, JS files for todo app."}
{"step": "ACTION", "tool": "executeCommand", "input": "type nul > todo.html", "content": "Creating HTML file"}
{"step": "OBSERVE", "content": "File created"}
{"step": "ACTION", "tool": "executeCommand", "input": "echo '<html>todo app</html>' > todo.html", "content": "Adding basic HTML structure"}
{"step": "THINK", "content": "Files created. Now provide instructions."}
{"step": "OUTPUT", "content": "Todo app files created. Open todo.html to start."}
`;

async function init() {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  const user_query = "what is inside my package.json file?";
  messages.push({ role: 'user', content: user_query });

  let stepCount = 0;
  const maxSteps = 5; // Prevent infinite loops

  while (stepCount < maxSteps) {
    stepCount++;
    
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        response_format: { type: "json_object" }  // This forces JSON output
      });

      const assistantResponse = response.choices[0].message.content;
      messages.push({ role: 'assistant', content: assistantResponse });
      
      console.log('Raw response:', assistantResponse);
      
      const parsed_response = JSON.parse(assistantResponse);

      if (parsed_response.step === 'THINK') {
        console.log(`🧠 THINK: ${parsed_response.content}`);
        continue;
      }
      
      if (parsed_response.step === 'OUTPUT') {
        console.log(`🤖 OUTPUT: ${parsed_response.content}`);
        break; // Exit loop when output is reached
      }
      
      if (parsed_response.step === 'ACTION') {
        const tool_name = parsed_response.tool;
        const tool_input = parsed_response.input;

        if (TOOLS_MAP[tool_name]) {
          console.log(`🔨 ACTION: Calling ${tool_name} with input: ${tool_input}`);
          const value = await TOOLS_MAP[tool_name](tool_input);
          console.log(`👀 OBSERVE: ${value}`);
          messages.push({ 
            role: 'user', 
            content: JSON.stringify({ 
              step: 'OBSERVE', 
              content: value 
            }) 
          });
        } else {
          console.log(`❌ ERROR: Tool ${tool_name} not found`);
          messages.push({
            role: 'user',
            content: JSON.stringify({
              step: 'OBSERVE',
              content: `Error: Tool ${tool_name} not available`
            })
          });
        }
        continue;
      }
      
    } catch (error) {
      console.error('Error in loop:', error.message);
      break;
    }
  }
  
  if (stepCount >= maxSteps) {
    console.log('🛑 Maximum steps reached');
  }
}

init();