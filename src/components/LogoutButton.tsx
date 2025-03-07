// components/LogoutButton.tsx
import { useMsal } from "@azure/msal-react";
import { Button } from "@mui/material";

export default function LogoutButton() {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "http://localhost:3000/login"
    });
  };

  return (
    <Button 
      variant="contained" 
      color="error"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}