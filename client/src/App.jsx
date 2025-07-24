import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor.jsx';
import SuggestionList from './components/SuggestionList.jsx';
import './pages/Home.css';
// import GeminiSuggestion from './components/GeminiSuggestion.jsx'

export default function Home() {
  const [code, setCode] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  console.log("Backend URL:", backendURL);
  const analyzeCode = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setSuggestions(data);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">🧠 C++ DSA Optimizer</h1>
      <CodeEditor code={code} setCode={setCode} analyzeCode={analyzeCode} />
      <SuggestionList suggestions={suggestions} />
      {/* <div className='gemini'> <GeminiSuggestion/></div> */}
    </div>
  );
}
