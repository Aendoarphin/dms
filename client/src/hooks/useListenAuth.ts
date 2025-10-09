import supabase from "@/util/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Event listener to update session status
export default function useListenAuth(signedInTime: string) {
  const navigate = useNavigate();
  const [lastActivityTime, setLastActivityTime] = useState(signedInTime);

  useEffect(() => {
    const checkSessionExpiration = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_DEV_SERVER_URL);
        const currentTime = new Date().getTime();
        const signedInTimestamp = new Date(lastActivityTime).getTime();
        // minutes from time of sign-in
        const timeDiff = (currentTime - signedInTimestamp) / 1000 / 60;
        if (
          // User was inactive beyond session time
          timeDiff > import.meta.env.VITE_SESSION_DURATION_IN_MINUTES &&
          localStorage.getItem(
            `sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`
          ) &&
          response.ok
        ) {
          supabase.auth.signOut();
          localStorage.removeItem(
            `sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`
          );
          window.alert(
            "Your session has expired due to inactivity. Please log in again."
          );
          navigate("/login", { replace: true });
        } else if (!response.ok) {
          window.alert("Could not connect to server. Please try again later.");
        } else {
          // User wes active within session time
          setLastActivityTime(new Date().toISOString());
        }
      } catch (error) {
        console.error("Error checking session expiration:", error);
      }
    };

    const handleDocumentClick = () => {
      if (
        localStorage.getItem(
          `sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`
        )
      )
        checkSessionExpiration();
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [signedInTime, navigate, lastActivityTime]);
}
