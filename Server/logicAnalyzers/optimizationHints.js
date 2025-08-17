function suggestPrefixSumOrHashing(node, code, suggestions = []) {
  if (node.type === 'for_statement') {
    const loopText = code.slice(node.startIndex, node.endIndex);

    const prefixSumRegex = /\b(\w+)\b\[\s*(\w+)\s*\]\s*=\s*\b\1\b\[\s*\2\s*[-+]\s*1\s*\]\s*\+\s*\b(\w+)\b\[\s*\2\s*\];?/;
    if (prefixSumRegex.test(loopText)) {
      suggestions.push({ type: 'prefix_sum', message: 'Use prefix sum', line: node.startPosition.row + 1 });
    }

    const hashMapRegex = /(\w+)\s*\[\s*.*?\s*\]\s*[\+\-\*/]\s*\1\s*\[\s*.*?\s*\]\s*==?/g;
    if (hashMapRegex.test(loopText)) {
      suggestions.push({ type: 'hashing', message: 'Use hash map for faster lookup', line: node.startPosition.row + 1 });
    }

    const slidingWindowRegex = /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<=\s*\w+\s*-\s*\w+\s*;\s*i\+\+\s*\)\s*{[^}]*int\s+sum\s*=\s*0\s*;[^}]*for\s*\(\s*int\s+j\s*=\s*i\s*;\s*j\s*<\s*i\s*\+\s*\w+\s*;\s*j\+\+\s*\)[^}]*sum\s*\+=/s;
    if (slidingWindowRegex.test(loopText)) {
      suggestions.push({ type: 'sliding_window', message: 'Use sliding window', line: node.startPosition.row + 1 });
    }

    const binarySearchFindRegex = /for\s*\(\s*int\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*\w+\s*;\s*\w+\+\+\s*\)[^}]*if\s*\(\s*\w+\s*\[\s*\w+\s*\]\s*==/s;
    if (binarySearchFindRegex.test(loopText)) {
      suggestions.push({ type: 'binary_search', message: 'Use binary search is sorting allowed', line: node.startPosition.row + 1 });
    }

    const twoPointerRegex = /for\s*\(\s*int\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*\w+\s*;\s*\w+\+\+\s*\)[^}]*for\s*\(\s*int\s+\w+\s*=\s*\w+\s*\+\s*1\s*;\s*\w+\s*<\s*\w+\s*;\s*\w+\+\+\s*\)[^}]*if\s*\(\s*\w+\s*\[\s*\w+\s*\]\s*\+\s*\w+\s*\[\s*\w+\s*\]/s;
    if (twoPointerRegex.test(loopText)) {
      suggestions.push({ type: 'two_pointer', message: 'Use two-pointer technique', line: node.startPosition.row + 1 });
    }
  }

  // Recursively check child nodes
  for (let i = 0; i < node.namedChildCount; i++) {
    suggestPrefixSumOrHashing(node.namedChild(i), code, suggestions);
  }

  return suggestions;
}

module.exports = { suggestPrefixSumOrHashing };
