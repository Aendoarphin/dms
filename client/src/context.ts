import type { Session } from "@supabase/supabase-js";
import { createContext } from "react";

export const SessionContext = createContext<Session | null>(null);
export const SbClientContext = createContext<boolean>(false);