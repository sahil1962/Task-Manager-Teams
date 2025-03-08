import { useMsal } from "@azure/msal-react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
  const { instance } = useMsal();

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/plans">Plans</Link>
        <Link to="/create-task">Create Task</Link>
      </div>
      <LogoutButton />
    </nav>
  );
}