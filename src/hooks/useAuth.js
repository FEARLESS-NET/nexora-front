import { useEffect, useState } from "react";
import { getMe } from "../utils/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);

      const currentUser = await getMe();

      setUser(currentUser);
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser: checkAuth,
  };
};