function generateBenchmarkCode(suggestions, originalCode) {
  let matchedType = 'default';
  
  if (Array.isArray(suggestions)) {
    for (const sug of suggestions) {
      if (sug.type === 'prefix_sum') {
        matchedType = 'prefix_sum';
        break;
      } else if (sug.type === 'two_pointer') {
        matchedType = 'two_pointer';
        break;
      } else if (sug.type === 'sliding_window') {
        matchedType = 'sliding_window';
        break;
      } else if (sug.type === 'hashing') {
        matchedType = 'hashing';
        break;
      } else if (sug.type === 'binary_search') {
        matchedType = 'binary_search';
        break;
      }
    }
  }

  const header = `/**
 * C++ DSA Assistant - Generated Performance Benchmark
 * 
 * Instructions:
 * 1. Copy this code into a file named 'benchmark.cpp'.
 * 2. Compile it using a modern C++ compiler with optimizations enabled:
 *    g++ -O3 benchmark.cpp -o benchmark
 * 3. Run the executable:
 *    ./benchmark (Linux/Mac) or benchmark.exe (Windows)
 */

#include <iostream>
#include <vector>
#include <chrono>
#include <random>
#include <algorithm>
#include <unordered_set>
#include <unordered_map>

using namespace std;
using namespace std::chrono;
`;

  if (matchedType === 'prefix_sum') {
    return header + `
// --- ORIGINAL APPROACH (Brute Force subarray sum queries: O(N * Q)) ---
long long bruteForceSumQueries(const vector<int>& arr, const vector<pair<int, int>>& queries) {
    long long total = 0;
    for (const auto& q : queries) {
        long long currentSum = 0;
        for (int i = q.first; i <= q.second; ++i) {
            currentSum += arr[i];
        }
        total += currentSum;
    }
    return total;
}

// --- OPTIMIZED APPROACH (Prefix Sum queries: O(N + Q)) ---
long long prefixSumQueries(const vector<int>& arr, const vector<pair<int, int>>& queries) {
    int n = arr.size();
    vector<long long> prefix(n + 1, 0);
    for (int i = 0; i < n; ++i) {
        prefix[i + 1] = prefix[i] + arr[i];
    }
    
    long long total = 0;
    for (const auto& q : queries) {
        total += (prefix[q.second + 1] - prefix[q.first]);
    }
    return total;
}

int main() {
    const int N = 40000;  // Array size
    const int Q = 20000;  // Number of queries
    
    cout << "===========================================" << endl;
    cout << "   BENCHMARK: Brute Force vs Prefix Sum    " << endl;
    cout << "   Array Size: " << N << ", Queries: " << Q << endl;
    cout << "===========================================" << endl;

    // Generate random array
    vector<int> arr(N);
    mt19937 rng(1337);
    uniform_int_distribution<int> valDist(1, 100);
    for (int i = 0; i < N; ++i) {
        arr[i] = valDist(rng);
    }

    // Generate random range queries [L, R]
    vector<pair<int, int>> queries(Q);
    uniform_int_distribution<int> idxDist(0, N - 1);
    for (int i = 0; i < Q; ++i) {
        int idx1 = idxDist(rng);
        int idx2 = idxDist(rng);
        queries[i] = {min(idx1, idx2), max(idx1, idx2)};
    }

    // 1. Time Brute Force Sum Queries
    cout << "Running Brute Force Subarray Sums..." << endl;
    auto start1 = high_resolution_clock::now();
    long long bruteResult = bruteForceSumQueries(arr, queries);
    auto end1 = high_resolution_clock::now();
    auto duration1 = duration_cast<milliseconds>(end1 - start1).count();
    cout << "Brute Force Sum total: " << bruteResult << " | Time: " << duration1 << " ms" << endl;

    // 2. Time Prefix Sum Queries
    cout << "\\nRunning Prefix Sum Subarray Sums..." << endl;
    auto start2 = high_resolution_clock::now();
    long long optResult = prefixSumQueries(arr, queries);
    auto end2 = high_resolution_clock::now();
    auto duration2 = duration_cast<milliseconds>(end2 - start2).count();
    cout << "Prefix Sum Sum total: " << optResult << " | Time: " << duration2 << " ms" << endl;

    cout << "\\n===========================================" << endl;
    if (duration2 > 0) {
        cout << "SPEEDUP FACTOR: " << (double)duration1 / duration2 << "x faster!" << endl;
    } else {
        cout << "SPEEDUP FACTOR: Optimized version ran in <1 ms!" << endl;
    }
    cout << "===========================================" << endl;

    return 0;
}
`;
  }

  if (matchedType === 'two_pointer') {
    return header + `
// --- ORIGINAL APPROACH (Brute Force Pair Sum: O(N^2)) ---
bool bruteForcePairSum(const vector<int>& arr, int target) {
    int n = arr.size();
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            if (arr[i] + arr[j] == target) {
                return true;
            }
        }
    }
    return false;
}

// --- OPTIMIZED APPROACH (Two-Pointer Pair Sum: O(N)) ---
bool twoPointerPairSum(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    while (left < right) {
        int currentSum = arr[left] + arr[right];
        if (currentSum == target) {
            return true;
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return false;
}

int main() {
    const int N = 50000;
    cout << "===============================================" << endl;
    cout << "   BENCHMARK: Brute Force vs Two-Pointer       " << endl;
    cout << "   Array Size: " << N << " (Sorted array)" << endl;
    cout << "===============================================" << endl;

    // Generate a sorted array
    vector<int> arr(N);
    int current = 1;
    mt19937 rng(42);
    uniform_int_distribution<int> stepDist(1, 10);
    for (int i = 0; i < N; ++i) {
        current += stepDist(rng);
        arr[i] = current;
    }

    // Set target to a value that doesn't exist to force worst-case search
    int target = arr[N - 1] * 2 + 10; 

    // 1. Time Brute Force Pair Sum
    cout << "Running Brute Force Pair Sum..." << endl;
    auto start1 = high_resolution_clock::now();
    bool bruteResult = bruteForcePairSum(arr, target);
    auto end1 = high_resolution_clock::now();
    auto duration1 = duration_cast<milliseconds>(end1 - start1).count();
    cout << "Pair found (Brute Force): " << (bruteResult ? "Yes" : "No") << " | Time: " << duration1 << " ms" << endl;

    // 2. Time Two Pointer Pair Sum
    cout << "\\nRunning Two Pointer Pair Sum..." << endl;
    auto start2 = high_resolution_clock::now();
    bool optResult = twoPointerPairSum(arr, target);
    auto end2 = high_resolution_clock::now();
    auto duration2 = duration_cast<microseconds>(end2 - start2).count();
    cout << "Pair found (Two Pointer): " << (optResult ? "Yes" : "No") << " | Time: " << duration2 << " microseconds" << endl;

    double duration2Ms = duration2 / 1000.0;
    cout << "\\n===============================================" << endl;
    if (duration2Ms > 0) {
        cout << "SPEEDUP FACTOR: " << (double)duration1 / duration2Ms << "x faster!" << endl;
    } else {
        cout << "SPEEDUP FACTOR: Optimized version ran in <1 microsecond!" << endl;
    }
    cout << "===============================================" << endl;

    return 0;
}
`;
  }

  if (matchedType === 'sliding_window') {
    return header + `
// --- ORIGINAL APPROACH (Brute Force Subarray Sum of size K: O(N * K)) ---
long long bruteForceMaxSubarraySum(const vector<int>& arr, int k) {
    int n = arr.size();
    long long maxSum = -1e18;
    for (int i = 0; i <= n - k; ++i) {
        long long currentSum = 0;
        for (int j = i; j < i + k; ++j) {
            currentSum += arr[j];
        }
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}

// --- OPTIMIZED APPROACH (Sliding Window: O(N)) ---
long long slidingWindowMaxSubarraySum(const vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return 0;
    
    long long currentSum = 0;
    for (int i = 0; i < k; ++i) {
        currentSum += arr[i];
    }
    
    long long maxSum = currentSum;
    for (int i = k; i < n; ++i) {
        currentSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}

int main() {
    const int N = 100000;
    const int K = 500;
    cout << "===============================================" << endl;
    cout << "   BENCHMARK: Brute Force vs Sliding Window    " << endl;
    cout << "   Array Size: " << N << " | Window Size K: " << K << endl;
    cout << "===============================================" << endl;

    // Generate random values
    vector<int> arr(N);
    mt19937 rng(7);
    uniform_int_distribution<int> valDist(-100, 100);
    for (int i = 0; i < N; ++i) {
        arr[i] = valDist(rng);
    }

    // 1. Time Brute Force Sliding Window
    cout << "Running Brute Force Max Subarray Sum..." << endl;
    auto start1 = high_resolution_clock::now();
    long long bruteResult = bruteForceMaxSubarraySum(arr, K);
    auto end1 = high_resolution_clock::now();
    auto duration1 = duration_cast<milliseconds>(end1 - start1).count();
    cout << "Max Sum (Brute Force): " << bruteResult << " | Time: " << duration1 << " ms" << endl;

    // 2. Time Sliding Window Max Subarray Sum
    cout << "\\nRunning Sliding Window Max Subarray Sum..." << endl;
    auto start2 = high_resolution_clock::now();
    long long optResult = slidingWindowMaxSubarraySum(arr, K);
    auto end2 = high_resolution_clock::now();
    auto duration2 = duration_cast<microseconds>(end2 - start2).count();
    cout << "Max Sum (Sliding Window): " << optResult << " | Time: " << duration2 << " microseconds" << endl;

    double duration2Ms = duration2 / 1000.0;
    cout << "\\n===============================================" << endl;
    if (duration2Ms > 0) {
        cout << "SPEEDUP FACTOR: " << (double)duration1 / duration2Ms << "x faster!" << endl;
    } else {
        cout << "SPEEDUP FACTOR: Optimized version ran in <1 microsecond!" << endl;
    }
    cout << "===============================================" << endl;

    return 0;
}
`;
  }

  if (matchedType === 'hashing') {
    return header + `
// --- ORIGINAL APPROACH (Brute Force Duplicate Finder: O(N^2)) ---
bool bruteForceDuplicateCheck(const vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            if (arr[i] == arr[j]) {
                return true;
            }
        }
    }
    return false;
}

// --- OPTIMIZED APPROACH (Hash Set: O(N)) ---
bool hashingDuplicateCheck(const vector<int>& arr) {
    unordered_set<int> elements;
    for (int val : arr) {
        if (elements.count(val)) {
            return true;
        }
        elements.insert(val);
    }
    return false;
}

int main() {
    const int N = 30000;
    cout << "===============================================" << endl;
    cout << "   BENCHMARK: Brute Force vs Hashing (Set)     " << endl;
    cout << "   Array Size: " << N << endl;
    cout << "===============================================" << endl;

    // Generate unique array values in worst case
    vector<int> arr(N);
    for (int i = 0; i < N; ++i) {
        arr[i] = i; 
    }

    // 1. Time Brute Force Duplicate Check
    cout << "Running Brute Force Duplicate Check..." << endl;
    auto start1 = high_resolution_clock::now();
    bool bruteResult = bruteForceDuplicateCheck(arr);
    auto end1 = high_resolution_clock::now();
    auto duration1 = duration_cast<milliseconds>(end1 - start1).count();
    cout << "Duplicates found (Brute Force): " << (bruteResult ? "Yes" : "No") << " | Time: " << duration1 << " ms" << endl;

    // 2. Time Hashing Duplicate Check
    cout << "\\nRunning Hashing Duplicate Check..." << endl;
    auto start2 = high_resolution_clock::now();
    bool optResult = hashingDuplicateCheck(arr);
    auto end2 = high_resolution_clock::now();
    auto duration2 = duration_cast<microseconds>(end2 - start2).count();
    cout << "Duplicates found (Hash Set): " << (optResult ? "Yes" : "No") << " | Time: " << duration2 << " microseconds" << endl;

    double duration2Ms = duration2 / 1000.0;
    cout << "\\n===============================================" << endl;
    if (duration2Ms > 0) {
        cout << "SPEEDUP FACTOR: " << (double)duration1 / duration2Ms << "x faster!" << endl;
    } else {
        cout << "SPEEDUP FACTOR: Optimized version ran in <1 microsecond!" << endl;
    }
    cout << "===============================================" << endl;

    return 0;
}
`;
  }

  if (matchedType === 'binary_search') {
    return header + `
// --- ORIGINAL APPROACH (Linear Search: O(N)) ---
int linearSearch(const vector<int>& arr, int target) {
    int n = arr.size();
    for (int i = 0; i < n; ++i) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// --- OPTIMIZED APPROACH (Binary Search: O(log N)) ---
int binarySearch(const vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}

int main() {
    const int N = 100000;
    const int Q = 5000; // Queries
    cout << "=================================================" << endl;
    cout << "   BENCHMARK: Linear Search vs Binary Search    " << endl;
    cout << "   Array Size: " << N << " | Queries: " << Q << endl;
    cout << "=================================================" << endl;

    // Generate sorted array
    vector<int> arr(N);
    for (int i = 0; i < N; ++i) {
        arr[i] = i * 2;
    }

    // Generate search targets (mix of existing and non-existing)
    vector<int> targets(Q);
    mt19937 rng(999);
    uniform_int_distribution<int> searchDist(0, N * 2);
    for (int i = 0; i < Q; ++i) {
        targets[i] = searchDist(rng);
    }

    // 1. Time Linear Search Queries
    cout << "Running Linear Search Queries..." << endl;
    auto start1 = high_resolution_clock::now();
    long long linearSum = 0;
    for (int t : targets) {
        linearSum += linearSearch(arr, t);
    }
    auto end1 = high_resolution_clock::now();
    auto duration1 = duration_cast<milliseconds>(end1 - start1).count();
    cout << "Linear searches completed. Time: " << duration1 << " ms" << endl;

    // 2. Time Binary Search Queries
    cout << "\\nRunning Binary Search Queries..." << endl;
    auto start2 = high_resolution_clock::now();
    long long bsSum = 0;
    for (int t : targets) {
        bsSum += binarySearch(arr, t);
    }
    auto end2 = high_resolution_clock::now();
    auto duration2 = duration_cast<microseconds>(end2 - start2).count();
    cout << "Binary searches completed. Time: " << duration2 << " microseconds" << endl;

    double duration2Ms = duration2 / 1000.0;
    cout << "\\n=================================================" << endl;
    if (duration2Ms > 0) {
        cout << "SPEEDUP FACTOR: " << (double)duration1 / duration2Ms << "x faster!" << endl;
    } else {
        cout << "SPEEDUP FACTOR: Optimized version ran in <1 microsecond!" << endl;
    }
    cout << "=================================================" << endl;

    return 0;
}
`;
  }

  // DEFAULT EDUCATING SKELETON
  return header + `
// --- DEMONSTRATION SKELETON: Bubble Sort (O(N^2)) vs Quick/Intro Sort (O(N log N)) ---

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

void optimizedSort(vector<int>& arr) {
    // std::sort is an IntroSort (O(N log N))
    std::sort(arr.begin(), arr.end());
}

int main() {
    const int N = 10000;
    cout << "===============================================" << endl;
    cout << "   BENCHMARK DEMO: Bubble Sort vs std::sort     " << endl;
    cout << "   Array Size: " << N << " elements" << endl;
    cout << "===============================================" << endl;

    // Generate random values
    vector<int> arr1(N);
    mt19937 rng(42);
    uniform_int_distribution<int> dist(1, 10000);
    for (int i = 0; i < N; ++i) {
        arr1[i] = dist(rng);
    }
    vector<int> arr2 = arr1; // copy

    // 1. Time Bubble Sort
    cout << "Running Bubble Sort..." << endl;
    auto start1 = high_resolution_clock::now();
    bubbleSort(arr1);
    auto end1 = high_resolution_clock::now();
    auto duration1 = duration_cast<milliseconds>(end1 - start1).count();
    cout << "Bubble Sort Completed | Time: " << duration1 << " ms" << endl;

    // 2. Time Optimized Sort
    cout << "\\nRunning Optimized Sort (std::sort)..." << endl;
    auto start2 = high_resolution_clock::now();
    optimizedSort(arr2);
    auto end2 = high_resolution_clock::now();
    auto duration2 = duration_cast<microseconds>(end2 - start2).count();
    cout << "std::sort Completed | Time: " << duration2 << " microseconds" << endl;

    double duration2Ms = duration2 / 1000.0;
    cout << "\\n===============================================" << endl;
    if (duration2Ms > 0) {
        cout << "SPEEDUP FACTOR: " << (double)duration1 / duration2Ms << "x faster!" << endl;
    } else {
        cout << "SPEEDUP FACTOR: Optimized version ran in <1 microsecond!" << endl;
    }
    cout << "===============================================" << endl;

    return 0;
}
`;
}

module.exports = { generateBenchmarkCode };
