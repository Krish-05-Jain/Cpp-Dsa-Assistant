const express = require('express');
const router = express.Router();

const { parseCppCode } = require('../analyzeLogic/parse'); 
const { checkSyntax } = require('../logicAnalyzers/compilerCheck');
const { generateBenchmarkCode } = require('../logicAnalyzers/benchmarkGenerator');
const { getGeminiSuggestion } = require('../gemini/geminiClient');

router.post('/analyze', async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Code content must be a valid string' });
  }

  try {
    // 1. Static tree-sitter parsing & metrics
    const { suggestions, metrics } = parseCppCode(code);

    // 2. Syntax-checking compilation via g++
    const compileResult = await checkSyntax(code);

    // 3. Benchmark C++ script generation
    const benchmarkCode = generateBenchmarkCode(suggestions, code);

    // 4. Gemini AI Suggestion if API Key exists
    let aiSuggestion = null;
    if (process.env.GEMINI_API_KEY) {
      const aiResult = await getGeminiSuggestion(code);
      if (aiResult.success) {
        aiSuggestion = aiResult.text;
      } else {
        aiSuggestion = `⚠️ Gemini AI is active but encountered an error:\n\n${aiResult.message}`;
      }
    } else {
      aiSuggestion = `ℹ️ **AI-Powered suggestions are disabled** because \`GEMINI_API_KEY\` is not set on the server.\n\nTo enable this feature, create a \`.env\` file in the \`Server/\` directory and add your API key:\n\`\`\`env\nGEMINI_API_KEY=your_key_here\n\`\`\``;
    }

    // Return combined result
    res.json({
      suggestions,
      metrics,
      compileResult,
      benchmarkCode,
      aiSuggestion
    });
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: 'Analysis failed: ' + err.message });
  }
});

module.exports = router;
