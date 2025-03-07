import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/authConfig";

export default function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
      .catch((error: any) => console.error("Login failed:", error));
  };

  return (
    <div className="login-container">
      <h1>Task Manager</h1>
      <button onClick={handleLogin}>
        Sign In with Microsoft
      </button>
    </div>
  );
}
