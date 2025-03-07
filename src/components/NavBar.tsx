import { useMsal } from "@azure/msal-react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const { instance } = useMsal();

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/plans">Plans</Link>
        {/* <Link to="/create-task">Create Task</Link> */}
      </div>
      <button 
        onClick={() => instance.logoutPopup()}
        className="logout-button"
      >
        Logout
      </button>
    </nav>
  );
}