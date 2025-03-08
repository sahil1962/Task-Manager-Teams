import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from './auth/msalInstance';
import App from './App';
import './styles.css';
import { HashRouter } from 'react-router-dom'; // Changed from BrowserRouter

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter> {/* Use HashRouter instead */}
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </HashRouter>
  </React.StrictMode>
);