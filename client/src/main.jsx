// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
