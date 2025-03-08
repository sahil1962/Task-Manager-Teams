// src/components/AuthenticationHandler.tsxT

import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";

const validPaths = ['/', '/login', '/plans', '/dashboard', '/create-task'];

export default function AuthenticationHandler() {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Validate path first
        if (!validPaths.includes(location.pathname)) {
          navigate('/login', { replace: true });
          return;
        }

        const response = await instance.handleRedirectPromise();
        
        if (response) {
          instance.setActiveAccount(response.account);
          window.location.reload();
          // navigate("/plans", { replace: true });
          window.location.reload();

          return;
        }

        const account = instance.getActiveAccount();
        
        if (account) {
          if (["/", "/login"].includes(location.pathname)) {
            navigate("/plans", { replace: true });
          }
        } else {
          if (location.pathname !== "/login") {
            navigate("/login", { replace: true });
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login", { replace: true });
      } finally {
        setChecked(true);
      }
    };

    checkAuth();
  }, [instance, navigate, location.pathname]);

  if (!checked) return <div className="loading">Checking authentication status...</div>;

  return null;
}