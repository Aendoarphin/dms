import { useState, useEffect } from "react";
import supabase from "@/util/supabase";

export const useAdmins = () => {
  const [admins, setAdmins] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from("administrators")
        .select("*");
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { admins, loading, error, refetch: fetchAdmins };
};