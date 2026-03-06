import { type RouteObject } from "react-router-dom";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import NotFoundPage from "@/pages/not-found";
import SignupPage from "@/pages/signup";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import GoogleCallback from "@/pages/google-callback";
import PublicErrorPage from "@/pages/public-error";
import PublicLayout from "@/layouts/publicLayout";
import AboutPage from "@/pages/about";
import { guestLoader } from "@/services/guestLoader";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <PublicErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  { path: "/login", element: <LoginPage />, loader: guestLoader },
  { path: "/signup", element: <SignupPage />, loader: guestLoader },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/api/auth/google/callback", element: <GoogleCallback /> },
];

export default publicRoutes;
