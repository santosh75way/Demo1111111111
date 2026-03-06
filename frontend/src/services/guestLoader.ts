import { redirect } from "react-router-dom";
import type { User } from "@/libs/types";

export const guestLoader = async () => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user: User = JSON.parse(userStr);
        if (user.role === "ADMIN") {
          return redirect("/admin/dashboard");
        }
      }
    } catch (e) {
      // Ignore parse error
    }
    return redirect("/dashboard");
  }
  return null;
};
