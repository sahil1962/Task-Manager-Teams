import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from './auth/msalInstance';
import App from './App';
import './styles.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Simple render without extra initialization
root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL ? new URL(process.env.PUBLIC_URL).pathname : ''}>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>
);