import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Bloggi-logo.svg";

export default function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 ease-in-out"
          >
            <img src={logo} alt="Bloggi" className="h-8 w-auto" />
            <span className="text-xl font-bold tracking-tight text-stone-900">
              Bloggi
            </span>
          </Link>
          <nav>
            <ul className="flex items-center  gap-5 text-sm font-medium">
              <li>
                <Link
                  to="/dashboard"
                  className="px-4 py-1.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                >
                  Home
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/write/new"
                      className="px-4 py-1.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                    >
                      New Post
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-1.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                    >
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="px-4 py-1.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                    >
                      Log in
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 bg-white py-6 text-center font-light text-stone-500">
        <div className="max-w-3xl mx-auto px-4 space-y-1">
          <p>&copy; {new Date().getFullYear()} Bloggi. All rights reserved.</p>
          <p>
            Created by{" "}
            <a
              href="https://github.com/AlexLi1989"
              className="underline hover:text-stone-800"
            >
              Alex Li
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
