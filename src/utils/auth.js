
import { API_URL } from "./config";

export const getMe = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  } catch (error) {
    console.error("Get me error:", error);
    return null;
  }
};

