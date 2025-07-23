const { parseCppCode } = require('./analyzeLogic/parse');

const code = `
#include <iostream>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    for (int i = 1; i < 5; i++) {
        arr[i] = arr[i - 1] + arr[i];
    }
    return 0;
}
`;

const suggestions = parseCppCode(code);
console.log("Suggestions:", suggestions);

// const Parser = require('tree-sitter');
// const CPP = require('tree-sitter-cpp');
// const fs = require('fs');
// const path = require('path');

// const parser = new Parser();
// parser.setLanguage(CPP);

// // Load C++ file
// const codePath = path.join(__dirname, '../test_snippets/sample.cpp');
// const code = fs.readFileSync(codePath, 'utf8');
// console.log("Code received in parse:", code);

// // Parse to AST
// const tree = parser.parse(code);
// const root = tree.rootNode;


// console.log(root.toString());

// //Get count of all for loops
// function findForLoops(node, results = []) {
//     if (node.type === 'for_statement') {
//       results.push(node);
//     }
//     for (let i = 0; i < node.namedChildCount; i++) {
//         findForLoops(node.namedChild(i), results);
//     }

//     return results;
// }
// const forLoopNodes = findForLoops(root);
// forLoopNodes.forEach((node,index) => {
//     console.log(`For Loop of ${index} staring at line ${node.startPosition.row + 1}:\n`);
//     console.log(`For Loop of ${index} ending at line ${node.endPosition.row + 1}:\n`);
// });


// //Get count of all while loops
// function findWhileLoops(node, results = []) {
//     if (node.type === 'while_statement') {
//       results.push(node);
//     }
//     for (let i = 0; i < node.namedChildCount; i++) {
//         findWhileLoops(node.namedChild(i), results);
//     }

//     return results;
// }
// const whileNodes = findWhileLoops(root);
// whileNodes.forEach((node,index) => {
//     console.log(`While Loop of ${index} staring at line ${node.startPosition.row + 1}:\n`);
//     console.log(`while Loop of ${index} ending at line ${node.endPosition.row + 1}:\n`);
// });

// //Get count of all do - while loops
// function findDoWhileLoops(node, results = []) {
//     if (node.type === 'do_statement') {
//       results.push(node);
//     }
//     for (let i = 0; i < node.namedChildCount; i++) {
//         findDoWhileLoops(node.namedChild(i), results);
//     }

//     return results;
// }
// const doWhileNodes = findDoWhileLoops(root);
// doWhileNodes.forEach((node, index) => {
//   console.log(`Do-While Loop of ${index} staring at line ${node.startPosition.row + 1}:\n`);
//   console.log(`Do-while Loop of ${index} ending at line ${node.endPosition.row + 1}: \n`);
// });

// //Get count of all If statement
// function findIfStatement(node, results = []) {
//     if (node.type === 'if_statement') {
//       results.push(node);
//     }
//     for (let i = 0; i < node.namedChildCount; i++) {
//         findIfStatement(node.namedChild(i), results);
//     }

//     return results;
// }
// const ifNodes = findIfStatement(root);
// ifNodes.forEach((node,index) => {
//     console.log(`If Statement of ${index} staring at line ${node.startPosition.row + 1}:\n`);
//     console.log(`If Statement of ${index} ending at line ${node.endPosition.row + 1}:\n`);
// });

// //Get all function definition, calls and declaration
// function findFunctionCallsAndDefs(node, calls = [], defs = []) {
//     if (node.type === 'call_expression') {
//         calls.push(node);
//     } else if (node.type === 'function_definition' || node.type === 'function_declaration') {
//         defs.push(node);
//     }

//     for (let i = 0; i < node.namedChildCount; i++) {
//         findFunctionCallsAndDefs(node.namedChild(i), calls, defs);
//     }

//     return { calls, defs };
// }

// function findDescendantByType(node, type) {
//     if (!node) return null;
//     if (node.type === type) return node;

//     for (let i = 0; i < node.namedChildCount; i++) {
//         const child = findDescendantByType(node.namedChild(i), type);
//         if (child) return child;
//     }

//     return null;
// }


// function getFunctionName(node) {
//     const nameField = node.childForFieldName('name');
//     if (nameField) return nameField.text;

//     const declarator = node.childForFieldName('declarator');
//     const idNode = findDescendantByType(declarator, 'identifier');
//     return idNode ? idNode.text : '[anonymous]';
// }



// function isRecursive(funcNode) {
//     const functionName = getFunctionName(funcNode);
//     if (!functionName || functionName === '[anonymous]') return false;

//     let found = false;

//     function search(node) {
//         if (node.type === 'call_expression') {
//             const calledFunc = node.child(0);
//             if (calledFunc && calledFunc.text === functionName) {
//                 found = true;
//             }
//         }

//         for (let i = 0; i < node.namedChildCount; i++) {
//             search(node.namedChild(i));
//         }
//     }

//     const body = funcNode.childForFieldName('body');
//     if (body) search(body);

//     return found;
// }




// // Usage
// const { calls, defs } = findFunctionCallsAndDefs(root);

// function getCalledFunctionName(callNode) {
//     if (!callNode || callNode.type !== 'call_expression') return '[not a call]';

//     const callee = callNode.child(0);
//     return callee?.text || '[unknown]';
// }


// // Function Calls
// calls.forEach((node, i) => {
//     const funcName = getCalledFunctionName(node);
//     const line = node.startPosition.row + 1;
//     const recursive = defs.some(node => getFunctionName(node) === funcName && isRecursive(node)); // optional
//     console.log(`Function call ${i + 1}: '${funcName}' is ${recursive ? '' : 'not '}recursive. at line: ${line}`);
// });


// // Function Definitions


// function isLoop(node) {
//     return ['for_statement', 'while_statement', 'do_statement'].includes(node.type);
// }

// function findNestedLoops(node, result = []) {
//     if (isLoop(node)) {
//         let hasNestedLoop = false;

//         function searchBody(child) {
//             if (isLoop(child)) hasNestedLoop = true;

//             for (let i = 0; i < child.namedChildCount; i++) {
//                 searchBody(child.namedChild(i));
//             }
//         }

//         const body = node.childForFieldName('body');
//         if (body) searchBody(body);

//         if (hasNestedLoop) {
//             result.push({
//                 outerType: node.type,
//                 line: node.startPosition.row + 1
//             });
//         }
//     }

//     for (let i = 0; i < node.namedChildCount; i++) {
//         findNestedLoops(node.namedChild(i), result);
//     }

//     return result;
// }


// const nestedLoops = findNestedLoops(root);
// nestedLoops.forEach(({ outerType, line }, i) => {
//     console.log(`Nested loop found inside ${outerType} at line ${line}`);
//     console.log(`${i + 1}`)
// });


// const STL_TYPES = new Set([
//     'vector', 'map', 'set', 'unordered_map', 'unordered_set',
//     'stack', 'queue', 'deque', 'list', 'priority_queue'
// ]);

// function findSTLStructures(node, result = []) {
//     if (node.type === 'type_identifier' && STL_TYPES.has(node.text)) {
//         result.push({
//             container: node.text,
//             line: node.startPosition.row + 1
//         });
//     }

//     for (let i = 0; i < node.namedChildCount; i++) {
//         findSTLStructures(node.namedChild(i), result);
//     }

//     return result;
// }

// const stlUsages = findSTLStructures(root);

// stlUsages.forEach(({ container, line }, i) => {
//     console.log(`STL container '${container}' used at line ${line}`);
// });


// function suggestPrefixSumOrHashing(node, suggestions = []){
//     if(node.type === 'for_statement'){
//         const body = node.childForFieldName('body');
//         if(!body){
//             return;
//         }
//         const loopText = code.slice(node.startIndex,node.endIndex);

//         //Prefix Sum
//         if (/\w+\[\w+\]\s*=\s*\w+\[\w+\s*[-+]\s*1\]\s*\+\s*\w+\[\w+\]/
// .test(loopText)) {
//             suggestions.push({
//                 type: 'prefix_sum',
//                 message: 'Consider using prefix sum for repeated sum queries',
//                 line: node.startPosition.row + 1
//             });
//         }

//         // Hashing
//         if (/(\w+)\[.*\]\s*\+\s*\1\[.*\]\s*==/.test(loopText)) {
//             suggestions.push({
//                 type: 'hashing',
//                 message: 'Try using a hash map to reduce O(n²) to O(n)',
//                 line: node.startPosition.row + 1
//             });
//         }

//         //Sliding Window
//         if (/for|while\s*\(.*?=\s*k;.*?<\s*\w+;.*?\)\s*{[^}]*?(\w+)\s*\+=\s*\w+\[\w+\]\s*-\s*\w+\[\w+\s*-\s*k\]/s.test(loopText)) {
//             suggestions.push({
//                 type: 'Sliding Window',
//                 message: 'Try using a sliding Window to reduce O(n²) to O(n)',
//                 line: node.startPosition.row + 1
//             });
//         }

//         //Binary search
//         if (/while\s*\(\s*\w+\s*<=\s*\w+\s*\)\s*{?\s*int\s+\w+\s*=\s*\w+\s*\+\s*\(\s*\w+\s*-\s*\w+\s*\)\s*\/\s*2\s*;?/.test(loopText)) {
//             suggestions.push({
//                 type: 'Binary Search',
//                 message: 'Try using a Binary Search to reduce O(n²) to O(n)',
//                 line: node.startPosition.row + 1
//             });
//         }

//         //Two Pointer Technique
//         if (/while\s*\(\s*\w+\s*<\s*\w+\s*\)\s*{[^}]*?(if\s*\(\s*\w+\[\w+\]\s*[\+\-]\s*\w+\[\w+\]\s*==?=?.*?\)[^}]*?(left|start)\+\+|(right|end)--)/.test(loopText)) {
//             suggestions.push({
//               type: 'two_pointer',
//               message: 'Two-pointer technique detected for pair sum',
//               line: node.startPosition.row + 1
//             });
//           }
          
//     }

//     for (let i = 0; i < node.namedChildCount; i++) {
//         suggestPrefixSumOrHashing(node.namedChild(i), suggestions);
//     }
    

//     return suggestions;
// }


// const suggestions = suggestPrefixSumOrHashing(root, []);

// suggestions.forEach(({ line, message, type }) => {
//     console.log(`Line ${line}: ${message} ${type}`);
// });

// // Collect declarations with line numbers
// function collectDeclaredVariables(node, vars = {}) {
//     if (node.type === 'declaration') {
//         const declarator = node.childForFieldName('declarator');
//         let nameNode = null;

//         // Handle regular, pointer, and array declarations
//         if (declarator?.type === 'init_declarator' || declarator) {
//             nameNode = findDescendantIdentifier(declarator);
//         }

//         const varName = nameNode?.text;
//         if (varName && !vars.hasOwnProperty(varName)) {
//             vars[varName] = {
//                 count: 0,
//                 line: nameNode.startPosition.row + 1
//             };
//         }
//     }

//     for (let i = 0; i < node.namedChildCount; i++) {
//         collectDeclaredVariables(node.namedChild(i), vars);
//     }

//     return vars;
// }

// function countVariableUsage(node, vars) {
//     if (node.type === 'identifier') {
//         const name = node.text;
//         if (vars.hasOwnProperty(name)) {
//             vars[name].count++;
//         }
//     }

//     for (let i = 0; i < node.namedChildCount; i++) {
//         countVariableUsage(node.namedChild(i), vars);
//     }
// }

// // Helper function to find identifier inside complex declarators (like arrays, pointers)
// function findDescendantIdentifier(node) {
//     if (!node) return null;
//     if (node.type === 'identifier') return node;

//     for (let i = 0; i < node.namedChildCount; i++) {
//         const found = findDescendantIdentifier(node.namedChild(i));
//         if (found) return found;
//     }

//     return null;
// }

// const vars = collectDeclaredVariables(root);
// countVariableUsage(root, vars);

// for (const [name, data] of Object.entries(vars)) {
//     if (data.count === 1) {
//         console.log(`Variable '${name}' declared at line ${data.line} is never used.`);
//     }
// }


// let loopDepth = 0;
// let hasRecursion = false;
// const functionNames = new Set();

// // Walk the AST
// function walk(node, currentDepth = 0) {
//     if (node.type === 'function_declaration') {
//         const nameNode = node.childForFieldName('name');
//         if (nameNode) {
//             functionNames.add(nameNode.text);
//         }
//     }

//     // Detect function calls
//     if (node.type === 'call_expression') {
//         const functionName = node.child(0)?.text;
//         if (functionNames.has(functionName)) {
//             hasRecursion = true;
//         }
//     }

//     // Detect loops
//     if (['for_statement', 'while_statement', 'do_statement'].includes(node.type)) {
//         loopDepth = Math.max(loopDepth, currentDepth + 1);
//         currentDepth++;
//     }

//     for (let i = 0; i < node.namedChildCount; i++) {
//         walk(node.namedChild(i), currentDepth);
//     }
// }

// walk(root);

// // Estimate time complexity
// let complexity = 'O(1)';
// if (hasRecursion && loopDepth === 0) {
//     complexity = 'O(2^n) or O(n!) (recursive)';
// } else if (loopDepth === 1) {
//     complexity = 'O(n)';
// } else if (loopDepth === 2) {
//     complexity = 'O(n^2)';
// } else if (loopDepth === 3) {
//     complexity = 'O(n^3)';
// } else if (loopDepth > 3) {
//     complexity = `O(n^${loopDepth})`;
// }

// console.log('\n🧠 Time Complexity Analysis:\n');
// console.log(`✔ Loop Depth: ${loopDepth}`);
// console.log(`✔ Recursion Detected: ${hasRecursion}`);
// console.log(`📈 Estimated Time Complexity: ${complexity}\n`);


// function parseCppCode(code) {
//   const Parser = require('tree-sitter');
//   const CPP = require('tree-sitter-cpp');

//   const parser = new Parser();
//   parser.setLanguage(CPP);

//   const tree = parser.parse(code);
//   const root = tree.rootNode;

//   const suggestions = [];

//   // For loop detection
//   suggestions.push(...findForLoops(root).map(node => ({
//     line: node.startPosition.row + 1,
//     type: 'for_loop',
//     message: 'For loop detected'
//   })));

//   // While loop detection
//   suggestions.push(...findWhileLoops(root).map(node => ({
//     line: node.startPosition.row + 1,
//     type: 'while_loop',
//     message: 'While loop detected'
//   })));

//   // Do-while loop detection
//   suggestions.push(...findDoWhileLoops(root).map(node => ({
//     line: node.startPosition.row + 1,
//     type: node.text,
//     message: 'Do-While loop detected'
//   })));

//   // If statement
//   suggestions.push(...findIfStatement(root).map(node => ({
//     line: node.startPosition.row + 1,
//     type: 'if_statement',
//     message: 'If statement detected'
//   })));

//   // Nested loops
//   suggestions.push(...findNestedLoops(root).map(item => ({
//     line: node.startPosition.row + 1,
//     type: node.startIndex,
//     message: 'Nested loop detected'
//   })));

//   // STL containers
//   suggestions.push(...findSTLStructures(root).map(item => ({
//     line: item.line,
//     type: item.container,
//     message: 'STL container usage detected'
//   })));


//   // Prefix sum, hashing, sliding window etc. already return correct format
//   suggestions.push(...suggestPrefixSumOrHashing(root));
//   console.log("Final suggestions from parseCppCode():", suggestions);

//   defs.forEach((node, i) => {
//     const name = getFunctionName(node);
//     const recursive = isRecursive(node);
//     const line = node.startPosition.row + 1;
//     console.log(`Function definition ${i + 1}: '${name}' is ${recursive ? '' : 'not '}recursive. at line: ${line}`);
//     if (recursive) {
//     suggestions.push({
//       line,
//       type: 'recursion',
//       message: `Function '${name}' is recursive.`
//     });
//   }
// });

//   return suggestions;
// }

// module.exports = { parseCppCode };

