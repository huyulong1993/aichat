import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Mock responses with markdown content
const mockResponses = [
  `Here's a simple markdown example:
# Heading 1
## Heading 2
- List item 1
- List item 2

\`\`\`javascript
const code = "This is a code block";
console.log(code);
\`\`\`

*italic* and **bold** text.`,

  `Let me explain with a table:
| Feature | Description |
|---------|-------------|
| Tables | Easy to create |
| Lists | Very useful |
| Code | Syntax highlighted |

> This is a blockquote
> With multiple lines`,

  `Here's how to use markdown:
1. Start with headers
2. Add some **bold** text
3. Include \`inline code\`

---
### Links and Images
[Example Link](https://example.com)
![Image Alt Text](https://example.com/image.jpg)`,

  `Let's talk about code:
\`\`\`python
def hello_world():
    print("Hello, World!")
    return True
\`\`\`

And some inline math: \`E = mc^2\`

* Bullet point 1
* Bullet point 2
  * Nested point
  * Another nested point`,
];

// Chat endpoint with streaming response
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Select a random mock response
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    // Send the response
    res.json({ 
      response: randomResponse,
      format: 'markdown'
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    details: err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Chat endpoint: http://localhost:${port}/api/chat`);
}); 