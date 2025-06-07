// Represents the user context for the application
import type { User } from '@supabase/supabase-js';
import { createContext } from 'react';

export const UserContext = createContext<User | null>(null);
export const AuthEventContext = createContext<string | null>(null);