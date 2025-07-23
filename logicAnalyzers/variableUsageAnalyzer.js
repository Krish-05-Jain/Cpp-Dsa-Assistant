function findDescendantIdentifier(node) {
  if (!node) return null;
  if (node.type === 'identifier') return node;
  for (let i = 0; i < node.namedChildCount; i++) {
    const found = findDescendantIdentifier(node.namedChild(i));
    if (found) return found;
  }
  return null;
}

function collectDeclaredVariables(node, vars = {}) {
  if (node.type === 'declaration') {
    console.log("Declaration node:", node.toString());
    const declarator = node.childForFieldName('declarator');
    const nameNode = findDescendantIdentifier(declarator);
    const varName = nameNode?.text;
    if (varName && !vars[varName]) {
      vars[varName] = { count: 0, line: nameNode.startPosition.row + 1 };
    }
  }
  for (let i = 0; i < node.namedChildCount; i++) {
    collectDeclaredVariables(node.namedChild(i), vars);
  }
  return vars;
}

function countVariableUsage(node, vars) {
  if (node.type === 'identifier') {
    const name = node.text;
    console.log(vars[name]);
    if (vars[name]) vars[name].count++;
  }
  for (let i = 0; i < node.namedChildCount; i++) {
    countVariableUsage(node.namedChild(i), vars);
  }
}

module.exports = { collectDeclaredVariables, countVariableUsage };
