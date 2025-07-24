function getSyntaxErrors(node) {
  const errors = [];

  if (!node) {
    return errors;
  }

  // Check if the node itself is marked as 'missing' by the parser
  // Tree-sitter nodes often have an 'isMissing' property for missing tokens.
  // If your node object represents a 'MISSING' node as a specific type,
  // e.g., node.type === 'MISSING', then include that in the check.
  if (node.isMissing) { // This is the most direct way if your nodes expose it
    errors.push({
      line: (node.startPosition?.row + 1) || 'unknown',
      message: `Missing expected token: '${node.text || node.type}'`, // node.text might be empty for missing tokens
      type: 'missing_token_error'
    });
  } else if (node.type === 'ERROR') { // Keep this for general error nodes if they exist
     errors.push({
      line: (node.startPosition?.row + 1) || 'unknown',
      message: node.text || 'Unknown syntax error',
      type: 'syntax_error'
    });
  }


  for (let i = 0; i < node.childCount; i++) {
    const childNode = node.child(i);
    if (childNode && childNode !== node) {
      errors.push(...getSyntaxErrors(childNode));
    }
  }

  return errors;
}

module.exports = { getSyntaxErrors };