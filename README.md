# 🧠 C++ DSA Assistant & Optimizer

An interactive web application designed to analyze, syntax-check, optimize, and benchmark your C++ Data Structures and Algorithms (DSA) code in real-time. 

Using AST parsing (via tree-sitter), native compiler checks, and Gemini AI optimizations, this assistant guides you from naive brute-force solutions to highly optimal production-ready DSA implementations.

---

## ✨ Features

- **📊 Real-time Code Metrics**: Instantly estimates time complexity ($O(1)$, $O(n^2)$, etc.), maximum loop depth, and recursion risk, alongside scanning for standard C++ STL containers.
- **🔍 Static AST Suggestions**: Detects standard code patterns and suggests optimizations (e.g., Two-Pointer, Prefix Sums, Hashing, Binary Search, Sliding Window) and highlights unused variables.
- **💻 Compiler Syntax Checks**: Leverages the system's `g++` compiler (using `g++ -fsyntax-only`) to run immediate syntax checking and type verification, returning structured line-by-line compiler warnings and errors.
- **✨ Gemini AI Integration**: Seamlessly communicates with Gemini LLM models to generate deep, contextual C++ optimization summaries, space/time complexity breakdowns, and refined C++ code blocks.
- **🚀 Standalone Benchmark Generator**: Dynamically generates compile-ready C++ benchmarking programs containing both your original and optimized code. Download or copy to run performance tests using `std::chrono` and custom random inputs on your local system!

---

## 📂 Project Folder Structure

The project has been refactored and unified under a clean two-layer structure:

```text
Cpp-Dsa-Assistant-1/
├── Server/                      # Express Backend Server
│   ├── analyzeLogic/            # Static tree-sitter parsing logic
│   │   └── parse.js
│   ├── controllers/             # Backend route controllers
│   │   └── analyzeController.js
│   ├── gemini/                  # Gemini API client integration
│   │   └── geminiClient.js
│   ├── logicAnalyzers/          # Modular AST scanners & helper engines
│   │   ├── benchmarkGenerator.js # Dynamic benchmark code templates
│   │   ├── compilerCheck.js     # Native g++ syntax execution checking
│   │   ├── loopAnalyzer.js
│   │   ├── conditionAnalyzer.js
│   │   ├── functionAnalyzer.js
│   │   ├── optimizationHints.js
│   │   ├── stlanalyzer.js
│   │   ├── syntaxAnalyzer.js
│   │   ├── timeComplexityAnalyzer.js
│   │   └── variableUsageAnalyzer.js
│   ├── routes/                  # Express route routers
│   │   └── analyze.js
│   ├── server.js                # Server entry point (Port 5000)
│   ├── test.js                  # Backend parsing verification runner
│   └── package.json             # Unified server-side dependencies
│
├── client/                      # React Frontend App (Vite)
│   ├── src/
│   │   ├── components/          # Reusable dashboard panels & views
│   │   │   ├── About.jsx
│   │   │   ├── BenchmarkPanel.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── MetricsPanel.jsx
│   │   │   └── SuggestionList.jsx
│   │   ├── App.jsx              # Main dashboard split workspace
│   │   ├── index.css            # Global resets
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json             # Frontend dependencies
│
└── README.md                    # Main project documentation
```

---

## ⚙️ Installation & Running

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [g++ compiler](https://gcc.gnu.org/) (for syntax checking, ensure `g++` is added to your environment `PATH`)

### 1. Setup Express Server
1. Navigate to the `Server` directory:
   ```bash
   cd Server
   ```
2. Install unified dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file inside `Server/`:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   The backend will be running at `http://localhost:5000`.

### 2. Setup React Client (Frontend)
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file to configure the backend endpoint if it runs elsewhere:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Run the Vite developer server:
   ```bash
   npm run dev
   ```
   The client dashboard will open at `http://localhost:5173` (or the port specified by Vite).

---

## ⏱️ Compiling & Executing C++ Benchmarks

When you download a generated benchmark file (`benchmark.cpp`):

1. **Compile with optimizations enabled**:
   ```bash
   g++ -O3 benchmark.cpp -o benchmark
   ```
   The `-O3` flag tells the compiler to run aggressive performance optimizations, making the benchmark comparison highly realistic.
   
2. **Run the compiled application**:
   - **Windows**:
     ```cmd
     .\benchmark.exe
     ```
   - **macOS/Linux**:
     ```bash
     ./benchmark
     ```
3. **Analyze output**:
   Observe the execution time difference (often up to $1000\times$ faster for $O(N)$ vs $O(N^2)$ algorithms) and speedup factor printed to the console.
