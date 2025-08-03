import supabase from '@/util/supabase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const useListenAuth = (signedInTime: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionExpiration = () => {
      const currentTime = new Date().getTime();
      const signedInTimestamp = new Date(signedInTime).getTime();
      const timeDiff = (currentTime - signedInTimestamp) / 1000 / 60;
      if (timeDiff > 1) { // minutes
        supabase.auth.signOut();
        localStorage.clear();
        window.alert('Your session has expired. Please log in again.');
        navigate('/login', { replace: true });
      }
    };
    const intervalId = setInterval(checkSessionExpiration, import.meta.env.VITE_CHECK_INTERVAL * 60 * 1000); // Check every X minutes
    return () => {
      clearInterval(intervalId);
    };
  }, [signedInTime, navigate]);
};

export default useListenAuth;