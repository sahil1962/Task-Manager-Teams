import { useMsal } from "@azure/msal-react";
import { Button } from "@mui/material";
import { msalConfig } from "../auth/authConfig";

export default function LogoutButton() {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri
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
