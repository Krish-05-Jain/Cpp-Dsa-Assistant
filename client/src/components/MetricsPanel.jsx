import React from 'react';
import './MetricsPanel.css';

export default function MetricsPanel({ metrics, compileResult }) {
  if (!metrics) {
    return <div className="metrics-panel-empty">No metrics data available. Please analyze code first.</div>;
  }

  const { complexity, loopDepth, hasRecursion, stlContainers } = metrics;
  const isCompileSuccess = compileResult?.success;
  const compileErrorsCount = compileResult?.errors?.filter(e => e.severity === 'error').length || 0;
  const compileWarningsCount = compileResult?.errors?.filter(e => e.severity === 'warning').length || 0;

  return (
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
  );
}
