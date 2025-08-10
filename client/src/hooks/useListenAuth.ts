import supabase from "@/util/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function useListenAuth(signedInTime: string) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionExpiration = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_DEV_SERVER_URL);
        const currentTime = new Date().getTime();
        const signedInTimestamp = new Date(signedInTime).getTime();
        const timeDiff = (currentTime - signedInTimestamp) / 1000 / 60;
        // minutes from time of sign-in
        if (
          timeDiff > import.meta.env.VITE_SESSION_DURATION &&
          localStorage.getItem(import.meta.env.VITE_COOKIE) &&
          response.ok
        ) {
          supabase.auth.signOut();
          localStorage.clear();
          window.alert("Your session has expired. Please log in again.");
          navigate("/login", { replace: true });
        } else if (!response.ok) {
          window.alert("Could not connect to server. Please try again later.");
        }
      } catch (error) {
        window.location.reload();
        console.error("Error checking session expiration:", error);
      }
    };

    const handleDocumentClick = () => {
      checkSessionExpiration();
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [signedInTime, navigate]);
}