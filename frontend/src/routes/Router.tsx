import { createBrowserRouter } from "react-router-dom";
import publicRoutes from "./Public";
import protectedRoutes from "./Protected";

const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes
]);

export default router;
