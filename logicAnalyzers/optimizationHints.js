function suggestPrefixSumOrHashing(node, code, suggestions = []) {
  if (node.type === 'for_statement') {
    const loopText = code.slice(node.startIndex, node.endIndex);

    if (/for\s*\(\s*int\s+(\w+)\s*=\s*\d+;\s*\1\s*<[^;]+;\s*\1\+\+\s*\)\s*{[^}]*for\s*\(\s*int\s+(\w+)\s*=\s*\1;\s*\2\s*<[^;]+;\s*\2\+\+\s*\)\s*{[^}]*int\s+\w+\s*=\s*0;\s*for\s*\(\s*int\s+(\w+)\s*=\s*\1;\s*\3\s*<=\s*\2;\s*\3\+\+\s*\)/gs.test(loopText)) {
      suggestions.push({ type: 'prefix_sum', message: 'Use prefix sum', line: node.startPosition.row + 1 });
    }

    if (/(\w+)\s*\[\s*.*?\s*\]\s*[\+\-\*/]\s*\1\s*\[\s*.*?\s*\]\s*==?/g.test(loopText)) {
      suggestions.push({ type: 'hashing', message: 'Use hash map for faster lookup', line: node.startPosition.row + 1 });
    }

    if (/for\s*\(\s*int\s+(\w+)\s*=\s*\d+;\s*\1\s*<[^;]+;\s*\1\+\+\s*\)\s*{[^}]*for\s*\(\s*int\s+(\w+)\s*=\s*\1\s*\+\s*\d+;\s*\2\s*<\s*\1\s*\+\s*\d+;\s*\2\+\+\s*\)/gs.test(loopText)) {
      suggestions.push({ type: 'sliding_window', message: 'Use sliding window', line: node.startPosition.row + 1 });
    }

    if (/for\s*\(\s*int\s+\w+\s*=\s*\d+\s*;\s*\w+\s*<\s*\w+\s*;\s*\w+\+\+\s*\)\s*{[^}]*if\s*\(\s*\w+\s*\[\s*\w+\s*\]\s*==\s*\w+\s*\)/s.test(loopText)) {
      suggestions.push({ type: 'binary_search', message: 'Use binary search', line: node.startPosition.row + 1 });
    }

    if (/while\s*\(\s*\w+\s*<\s*\w+\s*\)\s*{[^}]*?(if\s*\(\s*\w+\[\w+\]\s*[\+\-]\s*\w+\[\w+\]\s*==?=?.*?\)[^}]*?(left|start)\+\+|(right|end)--)/.test(loopText)) {
      suggestions.push({ type: 'two_pointer', message: 'Use two-pointer technique', line: node.startPosition.row + 1 });
    }
  }

  for (let i = 0; i < node.namedChildCount; i++) {
    suggestPrefixSumOrHashing(node.namedChild(i), code, suggestions);
  }

  return suggestions;
}

module.exports = { suggestPrefixSumOrHashing };
