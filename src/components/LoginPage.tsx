import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/authConfig";

export default function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
      .then(() => window.location.reload())
      .catch(console.error);
  };
  
  return (
    <div className="login-container">
      <h1>Task Manager Apps</h1>
      <button onClick={handleLogin}>
        Sign In with Microsoft
      </button>
    </div>
  );
}
