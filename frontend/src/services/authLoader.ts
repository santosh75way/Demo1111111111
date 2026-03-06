import { redirect } from "react-router-dom";
import { getProfile } from "@/services/api";

export const authLoader = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return redirect("/login");
  }

  try {
    const res = await getProfile();
    return res;
  } catch {
    localStorage.clear();
    return redirect("/login");
  }
};
