import { useMsal } from "@azure/msal-react";

export default function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect({
      scopes: ["User.Read", "Tasks.ReadWrite", "Group.ReadWrite.All"],
      redirectUri: "http://localhost:3000"
    }).catch((error : any) => console.error("Login failed:", error));
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
