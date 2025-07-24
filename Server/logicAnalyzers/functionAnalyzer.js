function findFunctionCallsAndDefs(node, calls = [], defs = []) {
  if (node.type === 'call_expression') calls.push(node);
  else if (node.type === 'function_definition' || node.type === 'function_declaration') defs.push(node);

  for (let i = 0; i < node.namedChildCount; i++) {
    findFunctionCallsAndDefs(node.namedChild(i), calls, defs);
  }

  return { calls, defs };
}

function findDescendantByType(node, type) {
  if (!node) return null;
  if (node.type === type) return node;
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = findDescendantByType(node.namedChild(i), type);
    if (child) return child;
  }
  return null;
}

function getFunctionName(node) {
  const nameField = node.childForFieldName('name');
  if (nameField) return nameField.text;
  const declarator = node.childForFieldName('declarator');
  const idNode = findDescendantByType(declarator, 'identifier');
  return idNode ? idNode.text : '[anonymous]';
}

function isRecursive(funcNode) {
  const functionName = getFunctionName(funcNode);
  if (!functionName || functionName === '[anonymous]') return false;

  let found = false;
  const body = funcNode.childForFieldName('body');

  const search = node => {
    if (node.type === 'call_expression' && node.child(0)?.text === functionName) found = true;
    for (let i = 0; i < node.namedChildCount; i++) search(node.namedChild(i));
  };

  if (body) search(body);
  return found;
}

module.exports = { findFunctionCallsAndDefs, getFunctionName, isRecursive };
