import React from 'react';
import './MetricsPanel.css';

export default function MetricsPanel({ metrics, compileResult, benchmarkResults }) {
  if (!metrics) {
    return <div className="metrics-panel-empty">No metrics data available. Please analyze code first.</div>;
  }

  const { complexity, loopDepth, hasRecursion, stlContainers } = metrics;
  const isCompileSuccess = compileResult?.success;
  const compileErrorsCount = compileResult?.errors?.filter(e => e.severity === 'error').length || 0;
  const compileWarningsCount = compileResult?.errors?.filter(e => e.severity === 'warning').length || 0;

  return (
    <div className="metrics-panel-container">
      <div className="metrics-grid">
        {/* Time Complexity Card */}
        <div className="metric-card complexity-card">
          <div className="metric-icon">📈</div>
          <div className="metric-details">
            <h3>Complexity Estimate</h3>
            <p className="metric-value">{complexity || 'O(1)'}</p>
            <span className="metric-label">Based on loop depth & recursion</span>
          </div>
        </div>

        {/* Compiler Status Card */}
        <div className={`metric-card compiler-card ${isCompileSuccess ? 'compile-pass' : 'compile-fail'}`}>
          <div className="metric-icon">{isCompileSuccess ? '✔' : '✖'}</div>
          <div className="metric-details">
            <h3>Compiler Check</h3>
            <p className="metric-value">
              {compileResult?.compilerMissing 
                ? 'N/A' 
                : isCompileSuccess 
                  ? 'Passed' 
                  : 'Failed'}
            </p>
            <span className="metric-label">
              {compileResult?.compilerMissing 
                ? 'g++ not installed' 
                : `${compileErrorsCount} errors, ${compileWarningsCount} warnings`}
            </span>
          </div>
        </div>

        {/* Loop Depth Card */}
        <div className="metric-card loops-card">
          <div className="metric-icon">🔄</div>
          <div className="metric-details">
            <h3>Max Loop Depth</h3>
            <p className="metric-value">{loopDepth}</p>
            <span className="metric-label">{loopDepth > 1 ? 'Nested loops detected' : 'Flat or no loops'}</span>
          </div>
        </div>

        {/* Recursion Card */}
        <div className="metric-card recursion-card">
          <div className="metric-icon">🪆</div>
          <div className="metric-details">
            <h3>Recursion</h3>
            <p className="metric-value">{hasRecursion ? 'Yes' : 'No'}</p>
            <span className="metric-label">{hasRecursion ? 'Call stack risks apply' : 'Safe call execution'}</span>
          </div>
        </div>

        {/* STL Containers Card */}
        <div className="metric-card stl-card">
          <div className="metric-icon">📦</div>
          <div className="metric-details">
            <h3>STL Containers</h3>
            <div className="stl-pills">
              {stlContainers && stlContainers.length > 0 ? (
                stlContainers.map((container, i) => (
                  <span key={i} className="stl-pill">{container}</span>
                ))
              ) : (
                <span className="stl-pill-empty">None detected</span>
              )}
            </div>
            <span className="metric-label">Standard C++ structures used</span>
          </div>
        </div>
      </div>

      {/* Live Backend Benchmark Results */}
      {benchmarkResults && (
        <div className="live-benchmark-wrapper">
          {benchmarkResults.success ? (
            <div className="live-results-card">
              <div className="results-badge">⚡ Live Performance Run Results</div>
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
          ) : benchmarkResults.error ? (
            <div className="live-results-card-error">
              <p>⚠️ <strong>Live Execution Failed:</strong> {benchmarkResults.error}</p>
              <p className="fallback-hint">You can still download the benchmark script in the Benchmark tab and run it locally to measure performance.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
