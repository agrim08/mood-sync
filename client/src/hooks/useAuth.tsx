import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/lib/constants';

const useAuth = () => {
  const [loginUser, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user_details`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { loginUser, loading };
};

export default useAuth;
