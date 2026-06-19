import React, { useState } from 'react';
import './BenchmarkPanel.css';

export default function BenchmarkPanel({ benchmarkCode, benchmarkResults }) {
  const [copied, setCopied] = useState(false);

  if (!benchmarkCode) {
    return <div className="benchmark-empty">Generate suggestions to see the C++ Benchmark code.</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(benchmarkCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([benchmarkCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'benchmark.cpp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="benchmark-panel">
      {/* Live Backend Benchmark Results */}
      {benchmarkResults && benchmarkResults.success ? (
        <div className="live-results-card">
          <div className="results-badge">⚡ Live Backend Execution Run</div>
          <h4 className="results-title">{benchmarkResults.benchmarkName}</h4>
          
          <div className="results-metrics-grid">
            <div className="results-metric-card brute-card">
              <span className="metric-icon">🐌</span>
              <div className="metric-info">
                <span className="metric-label">Naive Time</span>
                <span className="metric-val">{benchmarkResults.bruteTime}</span>
              </div>
            </div>
            
            <div className="results-metric-card optimized-card">
              <span className="metric-icon">⚡</span>
              <div className="metric-info">
                <span className="metric-label">Optimized Time</span>
                <span className="metric-val">{benchmarkResults.optimizedTime}</span>
              </div>
            </div>
            
            <div className="results-metric-card speedup-card">
              <span className="metric-icon">🚀</span>
              <div className="metric-info">
                <span className="metric-label">Measured Speedup</span>
                <span className="metric-val speedup-highlight">{benchmarkResults.speedup}</span>
              </div>
            </div>
          </div>
          
          <details className="raw-output-details">
            <summary>View raw execution terminal output</summary>
            <pre className="raw-output-console"><code>{benchmarkResults.rawOutput}</code></pre>
          </details>
        </div>
      ) : benchmarkResults && benchmarkResults.error ? (
        <div className="live-results-card-error">
          <p>⚠️ <strong>Live Execution Failed:</strong> {benchmarkResults.error}</p>
          <p className="fallback-hint">You can still download and run the script below on your system to measure the performance differences.</p>
        </div>
      ) : (
        <div className="live-results-card-missing">
          <p>💡 <em>Note: Live performance execution requires a local <code>g++</code> compiler on the server. You can download the benchmark script below and run it locally to compare speedups.</em></p>
        </div>
      )}

      <div className="benchmark-header">
        <div className="benchmark-title-wrap">
          <span className="fire-icon">🔥</span>
          <h3>C++ Performance Benchmark</h3>
        </div>
        <div className="benchmark-actions">
          <button className="action-btn copy-btn" onClick={handleCopy}>
            {copied ? '✔ Copied!' : '📋 Copy Code'}
          </button>
          <button className="action-btn download-btn" onClick={handleDownload}>
            💾 Download benchmark.cpp
          </button>
        </div>
      </div>

      <div className="benchmark-instructions">
        <h4>How to Compile and Run:</h4>
        <ul>
          <li>
            <span>1</span>
            <p>Save code to <code>benchmark.cpp</code> or click <strong>Download</strong>.</p>
          </li>
          <li>
            <span>2</span>
            <p>Compile in your terminal using optimizations: <br />
            <code>g++ -O3 benchmark.cpp -o benchmark</code></p>
          </li>
          <li>
            <span>3</span>
            <p>Run the compiled executable: <br />
            Windows: <code>.\benchmark.exe</code> | Mac/Linux: <code>./benchmark</code></p>
          </li>
        </ul>
      </div>

      <div className="benchmark-code-preview">
        <div className="preview-bar">
          <span className="file-name">benchmark.cpp</span>
          <span className="lang-label">C++</span>
        </div>
        <pre><code>{benchmarkCode}</code></pre>
      </div>
    </div>
  );
}
