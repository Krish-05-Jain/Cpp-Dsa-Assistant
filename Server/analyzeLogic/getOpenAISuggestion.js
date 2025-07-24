const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getOpenAISuggestion(code) {
  const prompt = `Analyze the following C++ code. Detect issues, bugs, inefficiencies, and suggest improvements:\n\n${code}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error('OpenAI error:', err.message);
    return 'Failed to get suggestion from OpenAI.';
  }
}

module.exports = { getOpenAISuggestion };
