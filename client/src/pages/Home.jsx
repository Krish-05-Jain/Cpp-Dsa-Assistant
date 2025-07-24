// // import React, { useState } from 'react';
// import CodeEditor from 'c:/Users/jaink/OneDrive/Desktop/Project/Cpp-Dsa-Assistant/Client/src/components/CodeEditor';
// import SuggestionList from 'c:/Users/jaink/OneDrive/Desktop/Project/Cpp-Dsa-Assistant/Client/src/components/SuggestionList.jsx';
// import './Home.css';

// console.log("Calling backend at", `${import.meta.env.VITE_BACKEND_URL}`);
// console.log("Suggestions from backend:", data);

// export default function Home() {
//   const [code, setCode] = useState('');
//   const [suggestions, setSuggestions] = useState([]);

//   const analyzeCode = async () => {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ code })
//     });

//     const data = await response.json();
//     console.log('Received suggestions:', data);

//     // If backend sends: { suggestions: [...] }
//     if (Array.isArray(data)) {
//       setSuggestions(data);
//     } else if (Array.isArray(data.suggestions)) {
//       setSuggestions(data.suggestions);
//     } else {
//       setSuggestions([]);
//     }
//   } catch (err) {
//     console.error('Error analyzing code:', err);
//     setSuggestions([]);
//   }
// };



//   return (
//     <div className="home-container">
//       <h1 className="home-title">🧠 C++ DSA Optimizer</h1>
//       <CodeEditor code={code} setCode={setCode} analyzeCode={analyzeCode} />
//       <SuggestionList suggestions={suggestions} />
//     </div>
//   );
// }