function suggestPrefixSumOrHashing(node, code, suggestions = []) {
  if (node.type === 'for_statement') {
    const loopText = code.slice(node.startIndex, node.endIndex);

    // 1. Extract outer loop variable name
    // e.g. for (int i = 0; ...) or for (size_t start = 0; ...)
    const outerVarMatch = loopText.match(/for\s*\(\s*(?:int|size_t|auto)\s+(\w+)\s*=/);
    if (outerVarMatch) {
      const outerVar = outerVarMatch[1];

      // --- Binary Search Detection ---
      // Look for linear search pattern: a loop with an equality condition arr[outerVar] == target
      // Example: if (arr[i] == x) or if (x == arr.at(i))
      const binSearchRegex = new RegExp(
        `if\\s*\\([^)]*(?:\\b\\w+\\s*\\[\\s*${outerVar}\\s*\\]|\\b\\w+\\s*\\.\\s*at\\s*\\(\\s*${outerVar}\\s*\\))\\s*==|==\\s*(?:\\b\\w+\\s*\\[\\s*${outerVar}\\s*\\]|\\b\\w+\\s*\\.\\s*at\\s*\\(\\s*${outerVar}\\s*\\))`
      );
      // Ensure it's not a nested loop (no inner for statement in loopText) to keep it simple linear search
      const hasInnerFor = (loopText.match(/for\s*\(/g) || []).length > 1;
      if (binSearchRegex.test(loopText) && !hasInnerFor) {
        suggestions.push({
          type: 'binary_search',
          message: 'Use binary search (std::binary_search or std::lower_bound) for O(log N) lookups if the collection is sorted',
          line: node.startPosition.row + 1
        });
      }

      // --- Nested Loop Optimization Detections ---
      if (hasInnerFor) {
        // Extract inner loop variable name
        // e.g. for (int j = i + 1; ...) or for (int j = i; ...)
        const innerVarMatch = loopText.match(/for\s*\(\s*(?:int|size_t|auto)\s+(\w+)\s*=/g);
        // innerVarMatch[0] is the outer loop, innerVarMatch[1] would be the inner loop
        if (innerVarMatch && innerVarMatch.length > 1) {
          const innerVarDecl = innerVarMatch[1];
          const innerVarNameMatch = innerVarDecl.match(/for\s*\(\s*(?:int|size_t|auto)\s+(\w+)\s*=/);
          if (innerVarNameMatch) {
            const innerVar = innerVarNameMatch[1];

            // 2. Two-Pointer (Pair sum) check:
            // Condition: checking sum of arr[outerVar] + arr[innerVar] == target
            const twoPointerRegex = new RegExp(
              `(?:\\b\\w+\\s*\\[\\s*${outerVar}\\s*\\]|\\b\\w+\\s*\\.\\s*at\\s*\\(\\s*${outerVar}\\s*\\))\\s*\\+\\s*(?:\\b\\w+\\s*\\[\\s*${innerVar}\\s*\\]|\\b\\w+\\s*\\.\\s*at\\s*\\(\\s*${innerVar}\\s*\\))|` +
              `(?:\\b\\w+\\s*\\[\\s*${innerVar}\\s*\\]|\\b\\w+\\s*\\.\\s*at\\s*\\(\\s*${innerVar}\\s*\\))\\s*\\+\\s*(?:\\b\\w+\\s*\\[\\s*${outerVar}\\s*\\]|\\b\\w+\\s*\\.\\s*at\\s*\\(\\s*${outerVar}\\s*\\))`
            );
            
            // 3. Sliding Window check:
            // Inner loop starts at outerVar and goes up to outerVar + something
            const isInnerStartAtOuter = new RegExp(`for\\s*\\(\\s*(?:int|size_t|auto)\\s+${innerVar}\\s*=\\s*${outerVar}`).test(loopText);
            const isInnerEndWithOffset = new RegExp(`${innerVar}\\s*<\\s*${outerVar}\\s*\\+\\s*[^;]+`).test(loopText);
            const hasAccumulation = /[^}]*(?:\+=|=.*\+)/.test(loopText);

            // 4. Hashing check (duplicate/frequency):
            // Check: arr[outerVar] == arr[innerVar] inside
            const hashingRegex = new RegExp(
              `(?:\\b(\\w+)\\s*\\[\\s*${outerVar}\\s*\\]|\\b(\\w+)\\s*\\.\\s*at\\s*\\(\\s*${outerVar}\\s*\\))\\s*==\\s*(?:\\b\\1\\b|\\b\\2\\b)\\s*(?:\\[\\s*${innerVar}\\s*\\]|\\.\\s*at\\s*\\(\\s*${innerVar}\\s*\\))`
            );

            // 5. Prefix Sum check (nested query sum):
            // Check: inner loop sums elements between L and R queries (e.g. l[q] to r[q])
            const querySumRegex = new RegExp(
              `for\\s*\\(\\s*(?:int|size_t|auto)\\s+${innerVar}\\s*=\\s*[^;]+;\\s*${innerVar}\\s*<=\\s*[^;]+;\\s*(?:${innerVar}\\+\\+|\\+\\+${innerVar})\\s*\\)[^}]*(?:\\+=|=.*\\+)`
            );

            if (twoPointerRegex.test(loopText)) {
              suggestions.push({
                type: 'two_pointer',
                message: 'Use the two-pointer technique to find target sum in O(N) time instead of O(N^2)',
                line: node.startPosition.row + 1
              });
            } else if (isInnerStartAtOuter && isInnerEndWithOffset && hasAccumulation) {
              suggestions.push({
                type: 'sliding_window',
                message: 'Use the sliding window technique to optimize subarray calculations to O(N) time',
                line: node.startPosition.row + 1
              });
            } else if (hashingRegex.test(loopText)) {
              suggestions.push({
                type: 'hashing',
                message: 'Use std::unordered_set or std::unordered_map to detect duplicates/frequencies in O(N) time instead of O(N^2)',
                line: node.startPosition.row + 1
              });
            } else if (querySumRegex.test(loopText)) {
              suggestions.push({
                type: 'prefix_sum',
                message: 'Use prefix sums to answer subarray range queries in O(1) time instead of O(N)',
                line: node.startPosition.row + 1
              });
            }
          }
        }
      }
    }

    // --- Direct Single Loop Prefix Sum check ---
    // If they build a prefix sum array: e.g. pref[i] = pref[i-1] + arr[i]
    const prefixSumRegex = /\b(\w+)\b\[\s*(\w+)\s*\]\s*=\s*\b\1\b\[\s*\2\s*[-+]\s*1\s*\]\s*\+\s*\b(\w+)\b\[\s*\2\s*\];?/;
    if (prefixSumRegex.test(loopText)) {
      // Avoid duplicate push if already detected by queries check
      if (!suggestions.some(s => s.type === 'prefix_sum' && s.line === node.startPosition.row + 1)) {
        suggestions.push({
          type: 'prefix_sum',
          message: 'Prefix sum pattern detected (building prefix sum array)',
          line: node.startPosition.row + 1
        });
      }
    }
  }

  // Recursively check child nodes
  for (let i = 0; i < node.namedChildCount; i++) {
    suggestPrefixSumOrHashing(node.namedChild(i), code, suggestions);
  }

  return suggestions;
}

module.exports = { suggestPrefixSumOrHashing };
