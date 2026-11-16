import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Bloggi-logo.svg";

export default function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div>
      <header>
        <div>
          <Link to="/">{/* <img src={logo} alt="Bloggi" /> */}</Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isAuthenticated ? (
              <li>
                <button onClick={handleLogout}>Log out</button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/signup">Sign up</Link>
                </li>
                <li>
                  <Link to="/login">Log in</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <div>
          <p>&copy; {new Date().getFullYear()} Bloggi. All rights reserved.</p>
          <p>
            Created by <a href="https://github.com/AlexLi1989">Alex Li</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
