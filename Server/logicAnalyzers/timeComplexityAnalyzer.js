function estimateTimeComplexity(root) {
  let loopDepth = 0;
  let hasRecursion = false;
  const functionNames = new Set();

  function walk(node, currentDepth = 0) {
    if (node.type === 'function_declaration') {
      const nameNode = node.childForFieldName('name');
      if (nameNode) functionNames.add(nameNode.text);
    }

    if (node.type === 'call_expression') {
      const functionName = node.child(0)?.text;
      if (functionNames.has(functionName)) hasRecursion = true;
    }

    if (['for_statement', 'while_statement', 'do_statement'].includes(node.type)) {
      loopDepth = Math.max(loopDepth, currentDepth + 1);
      currentDepth++;
    }

    for (let i = 0; i < node.namedChildCount; i++) {
      walk(node.namedChild(i), currentDepth);
    }
  }

  walk(root);

  let complexity = 'O(1)';
  if (hasRecursion && loopDepth === 0) complexity = 'O(2^n) or O(n!)';
  else if (loopDepth === 1) complexity = 'O(n)';
  else if (loopDepth === 2) complexity = 'O(n^2)';
  else if (loopDepth >= 3) complexity = `O(n^${loopDepth})`;

  return { loopDepth, hasRecursion, complexity };
}

module.exports = { estimateTimeComplexity };
