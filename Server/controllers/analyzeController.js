const { parseCppCode } = require('../analyzeLogic/parse');

exports.analyzeCode = (req, res) => {
  const { code } = req.body;
  console.log("Received code:\n", code); // <-- add this

  if (!code || typeof code !== 'string') {
    console.log("❌ Invalid or missing code");
    return res.status(400).json({ error: 'Invalid or missing code' });
  }

  try {
    const result = parseCppCode(code);
    console.log("✅ Suggestions generated:", result); // <-- verify this
    res.json(result);
  } catch (err) {
    console.error('❌ Analysis failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


