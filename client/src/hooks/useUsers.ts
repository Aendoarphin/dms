import { useState, useEffect } from "react";
import axios from "axios";
import type { User } from "@supabase/supabase-js";

export const useUsers = (refresh: boolean) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      const response = await axios.get(
        "https://gxjoufckpcmbdieviauq.supabase.co/functions/v1/user",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  return { users, error, refetch: fetchUsers };
};
