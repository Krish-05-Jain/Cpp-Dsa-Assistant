const STL_TYPES = new Set([
  'vector', 'map', 'set', 'unordered_map', 'unordered_set',
  'stack', 'queue', 'deque', 'list', 'priority_queue'
]);

function findSTLStructures(node, result = []) {
  if (node.type === 'type_identifier' && STL_TYPES.has(node.text)) {
    result.push({ container: node.text, line: node.startPosition.row + 1 });
  }
  for (let i = 0; i < node.namedChildCount; i++) findSTLStructures(node.namedChild(i), result);
  return result;
}

module.exports = { findSTLStructures };
