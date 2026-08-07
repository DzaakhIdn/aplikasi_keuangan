import { createContext, useContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import type { UserHibroProfile } from './supabase/profile';

// ----------------------------------------------------------------------

export type AuthContextValue = {
  user:
    | (User & {
        accessToken: string;
        displayName: string;
        role: string;
        profile: UserHibroProfile;
      })
    | null;
  session: Session | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
