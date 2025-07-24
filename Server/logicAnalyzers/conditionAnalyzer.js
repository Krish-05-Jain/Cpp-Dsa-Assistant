function findIfStatement(node, results = []) {
  if (node.type === 'if_statement') results.push(node);
  for (let i = 0; i < node.namedChildCount; i++) findIfStatement(node.namedChild(i), results);
  return results;
}

module.exports = { findIfStatement };
