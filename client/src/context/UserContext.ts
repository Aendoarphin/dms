import type { User } from "@supabase/supabase-js";
import { createContext } from "react";

export const UserContext: React.Context< User | null> = createContext<User | null>(null);