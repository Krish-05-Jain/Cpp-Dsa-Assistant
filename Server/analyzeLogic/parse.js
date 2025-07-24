const fs = require('fs');
const path = require('path');
const Parser = require('tree-sitter');
const CPP = require('tree-sitter-cpp');

// Import modular analyzers

const {
  getSyntaxErrors
} = require('../logicAnalyzers/syntaxAnalyzer');


const {
  findForLoops,
  findWhileLoops,
  findDoWhileLoops,
  findNestedLoops
} = require('../logicAnalyzers/loopAnalyzer');

const { findIfStatement } = require('../logicAnalyzers/conditionAnalyzer');
const {
  findFunctionCallsAndDefs,
  getFunctionName,
  isRecursive
} = require('../logicAnalyzers/functionAnalyzer');

const { findSTLStructures } = require('../logicAnalyzers/stlanalyzer');
const { suggestPrefixSumOrHashing } = require('../logicAnalyzers/optimizationHints');
const {
  collectDeclaredVariables,
  countVariableUsage
} = require('../logicAnalyzers/variableUsageAnalyzer');
const { estimateTimeComplexity } = require('../logicAnalyzers/timeComplexityAnalyzer');

// Load C++ file
const codePath = path.join(__dirname, '../test_snippets/sample.cpp');
const code = fs.readFileSync(codePath, 'utf8');

// Parse C++ code
function parseCppCode(code) {
  const parser = new Parser();
  parser.setLanguage(CPP);

  const tree = parser.parse(code);
  const root = tree.rootNode;

  const suggestions = [];

  const errors = getSyntaxErrors(root);
  // console.log(root.toString());

suggestions.push(...errors);
  if (errors.length > 0) {
    console.error('Syntax Errors Found:');
    errors.forEach(err => {
      console.error(`Line ${err.line}: ${err.message}`);
    });
    return suggestions; // Stop further analysis on syntax errors
  }

  // --- Loops ---
  suggestions.push(...findForLoops(root).map(node => ({
    line: node.startPosition.row + 1,
    type: 'for_loop',
    message: 'For loop detected'
  })));

  suggestions.push(...findWhileLoops(root).map(node => ({
    line: node.startPosition.row + 1,
    type: 'while_loop',
    message: 'While loop detected'
  })));

  suggestions.push(...findDoWhileLoops(root).map(node => ({
    line: node.startPosition.row + 1,
    type: 'do_while_loop',
    message: 'Do-While loop detected'
  })));

  suggestions.push(...findNestedLoops(root).map(item => ({
    line: item.line,
    type: 'nested_loop',
    message: `Nested loop found inside ${item.outerType}`
  })));

  // --- Conditionals ---
  suggestions.push(...findIfStatement(root).map(node => ({
    line: node.startPosition.row + 1,
    type: 'if_statement',
    message: 'If statement detected'
  })));

  // --- STL Containers ---
  suggestions.push(...findSTLStructures(root).map(item => ({
    line: item.line,
    type: item.container,
    message: 'STL container usage detected'
  })));

  // --- Optimization Hints ---
  suggestions.push(...suggestPrefixSumOrHashing(root, code,[]));

  // --- Function Recursion Detection ---
  const { defs, calls } = findFunctionCallsAndDefs(root);
  defs.forEach((node, i) => {
    const name = getFunctionName(node);
    const recursive = isRecursive(node);
    const line = node.startPosition.row + 1;
    if (recursive) {
      suggestions.push({
        line,
        type: 'recursion',
        message: `Function '${name}' is recursive`
      });
    }
  });

  // --- Unused Variables ---
  const vars = collectDeclaredVariables(root, {});
  countVariableUsage(root, vars);
  for (const [name, data] of Object.entries(vars)) {
    const actualUsageCount = data.count - 1;
    console.log(`Tracking variable '${name}': used ${actualUsageCount} time(s) after declaration`);
    if (actualUsageCount === 0) {
      suggestions.push({
        line: data.line,
        type: 'unused_variable',
        message: `Variable '${name}' declared but never used`
      });
    }
  }

  // --- Time Complexity Estimation ---
  const { loopDepth, hasRecursion, complexity } = estimateTimeComplexity(root);
  console.log('\n🧠 Time Complexity Analysis:\n');
  console.log(`✔ Loop Depth: ${loopDepth}`);
  console.log(`✔ Recursion Detected: ${hasRecursion}`);
  console.log(`📈 Estimated Time Complexity: ${complexity}\n`);

  return suggestions;
}

// Run it on the loaded code
const results = parseCppCode(code);

// Print Suggestions
console.log('\n📌 Suggestions Summary:\n');
results.forEach((sug, i) => {
  console.log(`${i + 1}. Line ${sug.line}: [${sug.type}] ${sug.message}`);
});

module.exports = { parseCppCode };
