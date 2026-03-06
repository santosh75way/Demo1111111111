import { redirect } from "react-router-dom";
import { getProfile } from "./api";

export async function adminLoader() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw redirect("/login");
  }

  try {
    const user = await getProfile();

    if (user.role !== "ADMIN") {
      // Not an admin — send to the user dashboard
      throw redirect("/dashboard");
    }

    // Return the user so layouts/pages can access it via useLoaderData()
    return { user };
  } catch (err: any) {
    // If this is a redirect, re-throw it
    if (err?.status || err instanceof Response) throw err;
    // Auth failure — clear storage and redirect to login
    localStorage.clear();
    throw redirect("/login");
  }
}
