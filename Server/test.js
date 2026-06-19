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

const { suggestions, metrics } = parseCppCode(code);
console.log("Suggestions:", suggestions);
console.log("Metrics:", metrics);
