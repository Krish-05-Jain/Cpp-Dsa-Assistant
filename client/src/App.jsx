import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor.jsx';
import SuggestionList from './components/SuggestionList.jsx';
import MetricsPanel from './components/MetricsPanel.jsx';
import BenchmarkPanel from './components/BenchmarkPanel.jsx';
import About from './components/About.jsx';
import './App.css';

export default function Home() {
  const [code, setCode] = useState(
`#include <iostream>
using namespace std;

int main() {
    int arr[] = {2, 4, 1, 3, 5};
    int n = sizeof(arr) / sizeof(arr[0]);

    // Brute-force subarray sums: O(N^3)
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
}`
  );
  const [suggestions, setSuggestions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [compileResult, setCompileResult] = useState(null);
  const [benchmarkCode, setBenchmarkCode] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [errorMsg, setErrorMsg] = useState('');

  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const analyzeCode = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${backendURL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (!res.ok) {
        throw new Error(`Server returned code ${res.status}`);
      }

      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setMetrics(data.metrics || null);
      setCompileResult(data.compileResult || null);
      setBenchmarkCode(data.benchmarkCode || '');
      setAiSuggestion(data.aiSuggestion || '');
      setBenchmarkResults(data.benchmarkResults || null);

      // Set active tab based on status:
      // If compiler failed, go to compiler logs. Otherwise go to dashboard
      if (data.compileResult && !data.compileResult.success) {
        setActiveTab('compiler');
      } else {
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.error("API Error:", err);
      setErrorMsg(`Failed to connect to backend at ${backendURL}. Please ensure the Server is running.`);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\r\n/g, '\n')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/```cpp\n([\s\S]*?)```/g, '<pre class="markdown-code-block cpp"><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre class="markdown-code-block"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="markdown-inline-code">$1</code>')
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
      .replace(/\n/g, '<br />');

    // Group adjacent list items
    html = html.replace(/(<li>.*?<\/li>)+/gs, (match) => `<ul>${match}</ul>`);
    // Cleanup double breaks around headers/code
    html = html.replace(/(<br \/>\s*)*<(h[1-3]|pre|ul)/g, '<$2');
    html = html.replace(/<\/(h[1-3]|pre|ul)>\s*(<br \/>)*/g, '</$1>');

    return <div className="markdown-render" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="app-layout">
      {/* Navbar / Header */}
      <header className="app-header">
        <div className="header-logo">
          <span className="logo-brain">🧠</span>
          <div className="logo-text">
            <h2>C++ DSA Assistant</h2>
            <span className="subtitle">Real-time Static Parser & AI Optimizer</span>
          </div>
        </div>
        <div className="header-tag">Live</div>
      </header>

      {/* Main Workspace split */}
      <main className="workspace-container">
        {/* Left Side: Code Editor */}
        <section className="editor-section">
          <div className="section-header">
            <h3>📝 C++ Source Code</h3>
            {loading && <div className="loader">Analyzing...</div>}
          </div>
          <CodeEditor code={code} setCode={setCode} analyzeCode={analyzeCode} />
          {errorMsg && <div className="error-toast">{errorMsg}</div>}
        </section>

        {/* Right Side: Tabbed Results Pane */}
        <section className="results-section">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Metrics
            </button>
            <button 
              className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              🔍 Suggestions ({suggestions.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'ai' ? 'active font-glowing' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              ✨ Gemini AI
            </button>
            <button 
              className={`tab-btn ${activeTab === 'benchmark' ? 'active' : ''}`}
              onClick={() => setActiveTab('benchmark')}
            >
              🚀 Benchmark
            </button>
            <button 
              className={`tab-btn ${activeTab === 'compiler' ? 'active' : ''} ${compileResult && !compileResult.success ? 'tab-danger' : ''}`}
              onClick={() => setActiveTab('compiler')}
            >
              💻 Compiler Logs {compileResult && !compileResult.success && '⚠️'}
            </button>
          </div>

          <div className="tab-content-container">
            {activeTab === 'dashboard' && (
              <div className="tab-pane fade-in">
                <h4 className="pane-title">Code Health & Complexity Metrics</h4>
                <MetricsPanel metrics={metrics} compileResult={compileResult} />
                <div className="dashboard-intro">
                  <p>Paste your C++ DSA code on the left and click <strong>Analyze</strong>. The system performs full AST parsing using tree-sitter and returns static code metrics immediately.</p>
                </div>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="tab-pane fade-in">
                <h4 className="pane-title">Static Code Quality Suggestions</h4>
                <SuggestionList suggestions={suggestions} />
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="tab-pane fade-in">
                <h4 className="pane-title">Gemini AI Optimization Analysis</h4>
                {loading ? (
                  <div className="ai-loading">
                    <div className="spinner"></div>
                    <p>Gemini AI is examining your code for algorithmic efficiency and memory safety...</p>
                  </div>
                ) : aiSuggestion ? (
                  renderMarkdown(aiSuggestion)
                ) : (
                  <div className="ai-placeholder">
                    <p>Click <strong>Analyze</strong> on the editor to fetch Gemini suggestions.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'benchmark' && (
              <div className="tab-pane fade-in">
                <h4 className="pane-title">Standalone Benchmarking Script</h4>
                <BenchmarkPanel benchmarkCode={benchmarkCode} benchmarkResults={benchmarkResults} />
              </div>
            )}

            {activeTab === 'compiler' && (
              <div className="tab-pane fade-in">
                <h4 className="pane-title">g++ Compile Check Output</h4>
                {compileResult ? (
                  <div className="compiler-console">
                    {compileResult.compilerMissing ? (
                      <div className="console-info">
                        <p>⚠️ <strong>g++ Compiler Not Found</strong></p>
                        <p>The backend was unable to execute syntax check because g++ is not installed or not in the PATH. Static tree-sitter analysis is still active.</p>
                      </div>
                    ) : compileResult.success ? (
                      <div className="console-success">
                        <span className="console-dot pass-dot"></span>
                        <p>No compilation errors found! The code compiles successfully under <code>g++ -fsyntax-only</code>.</p>
                      </div>
                    ) : (
                      <div className="console-errors-list">
                        <div className="console-header-error">
                          <span className="console-dot fail-dot"></span>
                          <p>Compilation syntax errors found:</p>
                        </div>
                        {compileResult.errors.map((err, i) => (
                          <div key={i} className={`console-err-row ${err.severity}`}>
                            <span className="err-loc">Line {err.line}:{err.column}</span>
                            <span className="err-badge">{err.severity}</span>
                            <span className="err-msg">{err.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="compiler-placeholder">
                    <p>No compilation records. Click <strong>Analyze</strong> to perform a syntax check.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="app-footer">
        <About />
      </footer>
    </div>
  );
}
