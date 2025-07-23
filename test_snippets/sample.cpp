#include <iostream>
using namespace std;

int main() {
    int arr[] = {2, 4, 1, 3, 5};
    int n = sizeof(arr) / sizeof(arr[0]);

    // Brute-force: sum of subarray from i to j
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int sum = 0;
            for (int k = i; k <= j; k++) {
                sum += arr[k];
            }
            cout << "Sum from " << i << " to " << j << " is " << sum << endl;
        }
    }

    return 0;
}
