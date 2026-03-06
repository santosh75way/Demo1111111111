import type { RouteObject } from "react-router";
import { authLoader } from "@/services/authLoader";
import AuthLayout from "@/layouts/authLayout";
import AdminLayout from "@/layouts/adminLayout";
import AdminPage from "@/pages/admin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { adminLoader } from "@/services/adminLoader";
import UserDashboard from "@/pages/user/UserDashboard";
import ProfilePage from "@/pages/profile";
import ErrorBoundaryPage from "@/pages/error-boundary";

const protectedRoutes: RouteObject[] = [
  {
    loader: authLoader,
    element: <AuthLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        path: "/dashboard",
        element: <UserDashboard />,
      },
      {
        path: "/profile/user",
        element: <ProfilePage />,
      },
    ],
  },

  {
    loader: adminLoader,
    element: <AdminLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
];

export default protectedRoutes;
