//App.tsx

import { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { Client } from "@microsoft/microsoft-graph-client";
import { getPlans } from "./services/plannerService";
import { Routes, Route } from "react-router-dom";
import AuthenticationHandler from "./components/AuthenticationHandler";
import ProtectedDashboard from "./components/ProtectedDashboard";
import LoginPage from "./components/LoginPage";
import PlanSelection from "./components/PlanSelection";
import TaskCreator from './components/TaskCreator';

function App() {
  const { instance } = useMsal();
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await instance.initialize();
        await instance.handleRedirectPromise();
        
        const account = instance.getActiveAccount();
        if (account) {
          const client = Client.init({
            authProvider: async (done) => {
              try {
                const token = await instance.acquireTokenSilent({
                  scopes: ["User.Read", "Group.ReadWrite.All", "Tasks.ReadWrite"],
                  account: account
                });
                done(null, token.accessToken);
              } catch (error) {
                console.error("Token acquisition failed:", error);
                done(error as Error, null);
              }
            }
          });
          
          // Add debug logging
          console.log("Fetching plans...");
          const plannerPlans = await getPlans(client);
          console.log("Plans received:", plannerPlans);
          setPlans(plannerPlans);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setInitialized(true);
      }
    };
  
    initializeApp();
  }, [instance]);

  if (!initialized) return <div className="loading">Initializing application...</div>;
  console.log("Plans data:", plans);
  console.log("Selected plan:", selectedPlan);
  
  return (
    <Routes>
      <Route path="/" element={<AuthenticationHandler />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedDashboard planId={selectedPlan} />} />
      <Route path="/plans" element={<PlanSelection plans={plans} onSelectPlan={setSelectedPlan} />} />
      <Route path="/*" element={<AuthenticationHandler />} />
      <Route path="/create-task" element={<TaskCreator planId={selectedPlan} />} />
    </Routes>
  );
}

export default App;