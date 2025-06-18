import supabase from '@/util/supabase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const useListenAuth = (signedInTime: string) => {
  const [lastClickTime, setLastClickTime] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = () => {
      setLastClickTime(new Date().getTime());
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (lastClickTime) {
      const currentTime = new Date().getTime();
      const signedInTimestamp = new Date(signedInTime).getTime();
      const timeDiff = (currentTime - signedInTimestamp) / 1000 / 60;
      if (timeDiff > 1) {
        supabase.auth.signOut();
        localStorage.clear();
        navigate('/login', { replace: true });
      }
    }
  }, [lastClickTime, signedInTime]);
};

export default useListenAuth;
