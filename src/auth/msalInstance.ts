// msalInstance

import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
    auth: {
      clientId: process.env.REACT_APP_CLIENT_ID!,
      authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
      redirectUri: window.location.origin,
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    }
  });
  
  // Initialize before first use
  msalInstance.initialize().catch(console.error);
