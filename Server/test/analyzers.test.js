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

console.log(`\n📊 Test Execution Summary: ${passedTests}/${totalTests} tests passed.\n`);

if (passedTests === totalTests) {
  console.log('🎉 All tests completed successfully!');
  process.exit(0);
} else {
  console.error('🚨 Some tests failed. Please review output.');
  process.exit(1);
}
