const { parseCppCode } = require('../analyzeLogic/parse');

exports.analyzeCode = (req, res) => {
  const { code } = req.body;
  console.log("Received code:\n", code);

  if (!code || typeof code !== 'string') {
    console.log("❌ Invalid or missing code");
    return res.status(400).json({ error: 'Invalid or missing code' });
  }

  try {
    const { suggestions, metrics } = parseCppCode(code);
    console.log("✅ Suggestions generated:", suggestions);
    res.json({ suggestions, metrics });
  } catch (err) {
    console.error('❌ Analysis failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
