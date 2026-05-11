import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ This sets up global axios with JWT token on every request
// Must be imported here so it runs before any component mounts
import './components/user/axiosInstance';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);