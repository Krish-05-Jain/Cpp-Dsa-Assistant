function findForLoops(node, results = []) {
  if (node.type === 'for_statement') results.push(node);
  for (let i = 0; i < node.namedChildCount; i++) findForLoops(node.namedChild(i), results);
  return results;
}

function findWhileLoops(node, results = []) {
  if (node.type === 'while_statement') results.push(node);
  for (let i = 0; i < node.namedChildCount; i++) findWhileLoops(node.namedChild(i), results);
  return results;
}

function findDoWhileLoops(node, results = []) {
  if (node.type === 'do_statement') results.push(node);
  for (let i = 0; i < node.namedChildCount; i++) findDoWhileLoops(node.namedChild(i), results);
  return results;
}

function isLoop(node) {
  return ['for_statement', 'while_statement', 'do_statement'].includes(node.type);
}

function findNestedLoops(node, result = []) {
  if (isLoop(node)) {
    let hasNestedLoop = false;
    const body = node.childForFieldName('body');
    if (body) {
      const searchBody = child => {
        if (isLoop(child)) hasNestedLoop = true;
        for (let i = 0; i < child.namedChildCount; i++) searchBody(child.namedChild(i));
      };
      searchBody(body);
    }
    if (hasNestedLoop) result.push({ outerType: node.type, line: node.startPosition.row + 1 });
  }
  for (let i = 0; i < node.namedChildCount; i++) findNestedLoops(node.namedChild(i), result);
  return result;
}

module.exports = { findForLoops, findWhileLoops, findDoWhileLoops, findNestedLoops };
