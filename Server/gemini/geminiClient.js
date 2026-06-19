const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

let aiClient = null;

if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

async function getGeminiSuggestion(code) {
  if (!process.env.GEMINI_API_KEY || !aiClient) {
    return {
      success: false,
      message: 'Gemini API key is not configured. Please set GEMINI_API_KEY in the server environment.'
    };
  }

  try {
    // Fallback if model name changes, but gemini-2.5-flash is standard or gemini-1.5-flash
    const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a C++ DSA expert. Analyze the following C++ code. Detect issues, complexity bugs, memory leaks, and inefficient operations. Detail the time and space complexity, and provide the fully optimized C++ code. Format your response strictly in clean Markdown with sections: Analysis, Complexity, Optimization, and Optimized C++ Code (in a code block).\n\n\`\`\`cpp\n${code}\n\`\`\``;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      success: true,
      text: response.text()
    };
  } catch (err) {
    console.error('Gemini error:', err);
    return {
      success: false,
      message: `Gemini API Error: ${err.message}`
    };
  }
}

module.exports = { getGeminiSuggestion };
