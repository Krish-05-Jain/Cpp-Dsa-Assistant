import React from 'react';
import './SuggestionList.css';

export default function SuggestionList({ suggestions }) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return <p>No performance flaws or unused variables detected. Your code looks highly optimal!</p>;
  }

  return (
    <div className="suggestions">
      {suggestions.map((s, index) => (
        <div className="suggestion-card" key={index} data-type={s.type || 'info'}>
          <p>
            <strong>Line:</strong> <span className="suggestion-line-val">{s.line}</span>
          </p>
          <p>
            <strong>Category:</strong> <span className="suggestion-type-val">{s.type}</span>
          </p>
          <p>
            <strong>Advice:</strong> <span className="suggestion-message-val">{s.message || 'No description provided'}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
