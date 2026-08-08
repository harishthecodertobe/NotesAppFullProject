import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-mark">Jot</span>
          <span className="brand-dot" aria-hidden="true" />
        </div>

        <div className="navbar-user">
          <span className="user-avatar" aria-hidden="true">
            {initial}
          </span>
          <span className="user-name">{user?.name}</span>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
