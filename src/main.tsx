
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure only one copy of React is used
window.React = React;

createRoot(document.getElementById("root")!).render(
  <App />
);
