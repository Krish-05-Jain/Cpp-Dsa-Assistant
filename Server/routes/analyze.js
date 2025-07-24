const express = require('express');
const router = express.Router();

const { parseCppCode } = require('../analyzeLogic/parse'); 
// const { getOpenAISuggestion } = require('../analyzeLogic/getOpenAISuggestion'); 

router.post('/analyze', async (req, res) => {
  const { code } = req.body;

  try {
    const parseResult = parseCppCode(code); // AST or basic structure
    // const aiSuggestion = await getOpenAISuggestion(code); // OpenAI smart output

    res.json(parseResult);
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

module.exports = router;
