import { useMsal } from "@azure/msal-react";
import { Button } from "@mui/material";
import { msalConfig } from "../auth/authConfig";

export default function LogoutButton() {
  const { instance } = useMsal();
  return (
    <Button 
      variant="contained" 
      color="error"
      // onClick={handleLogout}
      onClick={() => instance.logoutPopup()}
        className="logout-button"
    >
      Logout
    </Button>
  );
}
