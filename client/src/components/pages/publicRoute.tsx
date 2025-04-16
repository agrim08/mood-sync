import { useState, useEffect, JSX } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/auth/user_details`, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.user) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
