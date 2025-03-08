import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthenticationHandler() {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Handle any redirect response
        const response = await instance.handleRedirectPromise();
        
        if (response) {
          instance.setActiveAccount(response.account);
          // navigate("/plans", { replace: true });
          window.location.reload();
          return;
        }

        const account = instance.getActiveAccount();
        console.log("Auth check - Active account:", account);
        
        if (account) {
          // Redirect logic for authenticated users
          if (location.pathname === "/" || location.pathname === "/login") {
            navigate(`${process.env.PUBLIC_URL}/plans`, { replace: true });
          }
        } else {
          // Redirect to login for unauthenticated users
          if (location.pathname !== "/login") {
            navigate(`${process.env.PUBLIC_URL}/login`, { replace: true });
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate(`${process.env.PUBLIC_URL}/login`, { replace: true });
      } finally {
        setChecked(true);
      }
    };

    checkAuth();
  }, [instance, navigate, location.pathname]);
  console.log("Current path:", location.pathname);
  console.log("Active account:", instance.getActiveAccount());
  if (!checked) return <div className="loading">Checking authentication status...</div>;

  return null;
}