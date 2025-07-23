// import React, { useState } from 'react';
// import axios from 'axios';

// const GeminiSuggestion = () => {
//   const [code, setCode] = useState('');
//   const [suggestion, setSuggestion] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleAnalyze = async () => {
//     setLoading(true);
//     setSuggestion('');
//     try {
//       const response = await axios.post('http://localhost:5000/analyze', { code });
//       setSuggestion(response.data.suggestion);
//     } catch (error) {
//       console.error('Error:', error);
//       setSuggestion('Failed to get suggestion.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h2 className="text-xl font-bold mb-2">C++ Code Analyzer (AI-Powered)</h2>
//       <textarea
//         className="w-full h-48 p-2 border rounded mb-4"
//         placeholder="Paste your C++ code here..."
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//       ></textarea>
//       <button
//         className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         onClick={handleAnalyze}
//         disabled={loading}
//       >
//         {loading ? 'Analyzing...' : 'Get AI Suggestion'}
//       </button>

//       {suggestion && (
//         <div className="mt-6 bg-gray-100 p-4 rounded shadow">
//           <h3 className="font-semibold mb-2">💡 Gemini AI Suggestion:</h3>
//           <pre className="whitespace-pre-wrap">{suggestion}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GeminiSuggestion;
