import type { AuthChangeEvent } from "@supabase/supabase-js";
import { createContext } from "react";

export const AuthEventContext: React.Context< AuthChangeEvent | null> = createContext<AuthChangeEvent | null>(null);