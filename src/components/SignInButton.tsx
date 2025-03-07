import { useMsal } from "@azure/msal-react";

export default function SignInButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect({
      scopes: ["User.Read", "Tasks.ReadWrite", "Group.ReadWrite.All"]
    }).catch(error => console.error("Login failed:", error));
  };

  return (
    <button 
      className="login-button"
      onClick={handleLogin}
    >
      Sign In with Microsoft
    </button>
  );
}