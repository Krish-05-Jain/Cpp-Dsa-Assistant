import React from 'react';
import './SuggestionList.css';

export default function SuggestionList({ suggestions }) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return <p>No suggestions found or invalid format</p>;
  }

  return (
    <div className="suggestions">
      <h2>Suggestions</h2>
      {suggestions.map((s, index) => (
        <div className="suggestion-card" key={index}>
          <p ><strong>Line:</strong> {s.line}</p>
          <p><strong>Type:</strong> {s.type}</p>
          <p><strong>Message:</strong> {s.message || 'No message provided'}</p>
        </div>
      ))}

    </div>
  );
}


