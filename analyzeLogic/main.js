const { parseCppCode } = require('./parse');

// This is the function you call from the controller
function runAnalysis(code) {
  if (!code || typeof code !== 'string') {
    return [
      {
        pattern: "Invalid input",
        suggestion: "Submit valid C++ code",
        explanation: "Code must be a non-empty string"
      }
    ];
  }

  const suggestions = parseCppCode(code); // returns an array of suggestions
  return suggestions;
}

module.exports = { runAnalysis };
