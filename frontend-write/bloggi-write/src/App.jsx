import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import BlogDetailPage from "./pages/BlogDetailPage";
import DashboardPage from "./pages/DashboardPage";
import NewBlogPage from "./pages/NewBlogPage";
import EditBlogPage from "./pages/EditBlogPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthedRoute from "./components/UnauthedRoute";

const defaultRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          {
            element: <UnauthedRoute />,
            children: [{ path: "/login", element: <LoginPage /> }],
          },
          {
            element: <ProtectedRoute />,
            children: [
              { path: "/dashboard", element: <DashboardPage /> },
              { path: "/blogs/:id", element: <BlogDetailPage /> },
              { path: "/write/new", element: <NewBlogPage /> },
              { path: "/write/edit/:id", element: <EditBlogPage /> },
            ],
          },
          { path: "*", element: <ErrorPage /> },
        ],
      },
    ],
  },
]);
export default function App({ router = defaultRouter }) {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}
