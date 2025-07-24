import React from 'react';
import './CodeEditor.css';

export default function CodeEditor({ code, setCode, analyzeCode }) {
  return (
    <div className="code-editor">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// Paste your C++ code here"
      ></textarea>
      <button onClick={analyzeCode}>Analyze</button>
    </div>
  );
}