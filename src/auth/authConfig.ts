// authConfig.ts

export const msalConfig = {
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
};

export const graphScopes = [
  "User.Read",
  "User.Read.All",
  "Tasks.ReadWrite",
  "Group.ReadWrite.All"
];

// Scopes your app needs in order to create and manage Planner tasks:
export const loginRequest = {
  scopes: [
    "User.Read",
    "User.Read.All",
    "Tasks.ReadWrite",
    "Group.ReadWrite.All"
  ],
};
