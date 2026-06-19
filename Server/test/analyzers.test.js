const assert = require('assert');
const { parseCppCode } = require('../analyzeLogic/parse');

console.log('🧪 Starting C++ DSA Assistant Unit Tests...\n');

let totalTests = 0;
let passedTests = 0;

function testCase(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(err);
  }
}

// 1. Test O(1) Time Complexity
testCase('Time Complexity - O(1) estimation for linear code', () => {
  const code = `
    int add(int a, int b) {
        int sum = a + b;
        return sum;
    }
  `;
  const { metrics } = parseCppCode(code);
  assert.strictEqual(metrics.complexity, 'O(1)');
  assert.strictEqual(metrics.loopDepth, 0);
  assert.strictEqual(metrics.hasRecursion, false);
});

// 2. Test O(n) Time Complexity
testCase('Time Complexity - O(n) estimation for single loop', () => {
  const code = `
    void printArray(int arr[], int n) {
        for (int i = 0; i < n; i++) {
            cout << arr[i] << endl;
        }
    }
  `;
  const { metrics } = parseCppCode(code);
  assert.strictEqual(metrics.complexity, 'O(n)');
  assert.strictEqual(metrics.loopDepth, 1);
});

// 3. Test O(n^2) Time Complexity
testCase('Time Complexity - O(n^2) estimation for nested loops', () => {
  const code = `
    void bubbleSort(int arr[], int n) {
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
  `;
  const { metrics } = parseCppCode(code);
  assert.strictEqual(metrics.complexity, 'O(n^2)');
  assert.strictEqual(metrics.loopDepth, 2);
});

// 4. Test Recursion Detection
testCase('Recursion - Correctly flags recursive functions', () => {
  const code = `
    int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
  `;
  const { suggestions, metrics } = parseCppCode(code);
  
  // Verify metrics flag recursion
  assert.strictEqual(metrics.hasRecursion, true);
  
  // Verify a recursion suggestion is returned
  const hasRecursionSug = suggestions.some(sug => sug.type === 'recursion');
  assert.ok(hasRecursionSug, 'Should contain a recursion suggestion card');
});

// 5. Test Unused Variable Detection
testCase('Variables - Detects unused variables', () => {
  const code = `
    int compute(int x) {
        int unusedVar = 42;
        int usedVar = x * 2;
        return usedVar;
    }
  `;
  const { suggestions } = parseCppCode(code);
  const unusedSug = suggestions.find(sug => sug.type === 'unused_variable');
  assert.ok(unusedSug, 'Should flag unused variables');
  assert.match(unusedSug.message, /unusedVar/);
});

// 6. Test STL Containers Scanner
testCase('STL - Detects vector and map usage', () => {
  const code = `
    #include <vector>
    #include <map>
    void process() {
        std::vector<int> nums;
        std::map<int, string> mapping;
    }
  `;
  const { metrics } = parseCppCode(code);
  assert.ok(metrics.stlContainers.includes('vector'), 'Should detect vector');
  assert.ok(metrics.stlContainers.includes('map'), 'Should detect map');
});

// 7. Test Optimization Suggestions (Two Sum / Hashing)
testCase('Optimizations - Suggests Two-Pointer technique', () => {
  const code = `
    bool checkPairSum(int arr[], int n, int target) {
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (arr[i] + arr[j] == target) {
                    return true;
                }
            }
        }
        return false;
    }
  `;
  const { suggestions } = parseCppCode(code);
  const twoPointerSug = suggestions.find(sug => sug.type === 'two_pointer');
  assert.ok(twoPointerSug, 'Should suggest two-pointer optimization for nested pair-sum check');
});

// 8. Test Sliding Window Optimization Suggestion
testCase('Optimizations - Suggests Sliding Window technique', () => {
  const code = `
    int maxSubarraySum(int arr[], int n, int k) {
        int max_sum = 0;
        for (int i = 0; i <= n - k; i++) {
            int current_sum = 0;
            for (int j = i; j < i + k; j++) {
                current_sum += arr[j];
            }
            max_sum = max(max_sum, current_sum);
        }
        return max_sum;
    }
  `;
  const { suggestions } = parseCppCode(code);
  const slidingWindowSug = suggestions.find(sug => sug.type === 'sliding_window');
  assert.ok(slidingWindowSug, 'Should suggest sliding-window optimization for nested subarray summation loop');
});

// 9. Test Binary Search Optimization Suggestion
testCase('Optimizations - Suggests Binary Search for linear lookups', () => {
  const code = `
    int findValue(int arr[], int n, int target) {
        for (int idx = 0; idx < n; idx++) {
            if (arr[idx] == target) {
                return idx;
            }
        }
        return -1;
    }
  `;
  const { suggestions } = parseCppCode(code);
  const binSearchSug = suggestions.find(sug => sug.type === 'binary_search');
  assert.ok(binSearchSug, 'Should suggest binary-search for simple linear search loop');
});

// 10. Test Hashing Optimization Suggestion
testCase('Optimizations - Suggests Hashing for duplicate checks', () => {
  const code = `
    bool hasDuplicates(int elements[], int size) {
        for (int start = 0; start < size; start++) {
            for (int end = start + 1; end < size; end++) {
                if (elements[start] == elements[end]) {
                    return true;
                }
            }
        }
        return false;
    }
  `;
  const { suggestions } = parseCppCode(code);
  const hashingSug = suggestions.find(sug => sug.type === 'hashing');
  assert.ok(hashingSug, 'Should suggest hashing/set optimization for nested duplicate checking loop');
});

// 11. Test Prefix Sum Optimization Suggestion
testCase('Optimizations - Suggests Prefix Sum for query arrays', () => {
  const code = `
    void runQueries(int arr[], int n, int q_count, int l[], int r[]) {
        for (int q = 0; q < q_count; q++) {
            int query_sum = 0;
            for (int idx = l[q]; idx <= r[q]; idx++) {
                query_sum += arr[idx];
            }
            cout << query_sum << endl;
        }
    }
  `;
  const { suggestions } = parseCppCode(code);
  const prefixSumSug = suggestions.find(sug => sug.type === 'prefix_sum');
  assert.ok(prefixSumSug, 'Should suggest prefix-sum optimization for nested query summing loop');
});

// 12. Test Suggestions Contain Only Actionable Performance/Flaw Items
testCase('Suggestions - Contains only actionable optimization items and no structural logs', () => {
  const code = `
    int process(int arr[], int n) {
        int unused = 10;
        if (n > 0) {
            for (int i = 0; i < n; i++) {
                if (arr[i] == 0) return i;
            }
        }
        return -1;
    }
  `;
  const { suggestions } = parseCppCode(code);
  
  // Verify loops, conditionals, and standard declarations are NOT suggestions
  const hasForLoopSug = suggestions.some(sug => sug.type === 'for_loop' || sug.message.includes('loop detected'));
  const hasIfSug = suggestions.some(sug => sug.type === 'if_statement' || sug.message.includes('statement detected'));
  
  assert.strictEqual(hasForLoopSug, false, 'Should not contain generic "for loop detected" suggestions');
  assert.strictEqual(hasIfSug, false, 'Should not contain generic "if statement detected" suggestions');
  
  // Verify it still contains binary_search and unused_variable
  const hasUnused = suggestions.some(sug => sug.type === 'unused_variable');
  const hasBinSearch = suggestions.some(sug => sug.type === 'binary_search');
  assert.ok(hasUnused, 'Should detect unused variable');
  assert.ok(hasBinSearch, 'Should detect binary search candidate');
});

console.log(`\n📊 Test Execution Summary: ${passedTests}/${totalTests} tests passed.\n`);

if (passedTests === totalTests) {
  console.log('🎉 All tests completed successfully!');
  process.exit(0);
} else {
  console.error('🚨 Some tests failed. Please review output.');
  process.exit(1);
}
