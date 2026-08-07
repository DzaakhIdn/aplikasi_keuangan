import { useMemo, useEffect, useCallback, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { Session } from '@supabase/supabase-js';

import axios from '@/lib/axios';
import { supabase } from '@/lib/supabase';

import { AuthContext } from '../auth-context';
import { getAuthorizedProfile } from './profile';
import type { UserHibroProfile } from './profile';

// ----------------------------------------------------------------------

type AuthState = {
  session: Session | null;
  profile: UserHibroProfile | null;
  loading: boolean;
};

export function AuthProvider({ children }: PropsWithChildren) {
  const validationId = useRef(0);
  const [state, setState] = useState<AuthState>({ session: null, profile: null, loading: true });

  const applySession = useCallback((session: Session | null, profile: UserHibroProfile | null) => {
    setState({ session, profile, loading: false });

    if (session?.access_token) {
      axios.defaults.headers.common.Authorization = `Bearer ${session.access_token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, []);

  const validateSession = useCallback(
    async (session: Session | null) => {
      const currentValidation = ++validationId.current;

      if (!session) {
        applySession(null, null);
        return;
      }

      try {
        const profile = await getAuthorizedProfile(session.user.id);

        if (currentValidation === validationId.current) applySession(session, profile);
      } catch (error) {
        console.error(error);
        if (currentValidation === validationId.current) applySession(null, null);
        window.setTimeout(() => void supabase.auth.signOut(), 0);
      }
    },
    [applySession]
  );

  const checkUserSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      await validateSession(session);
    } catch (error) {
      console.error(error);
      applySession(null, null);
    }
  }, [applySession, validateSession]);

  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) void validateSession(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [checkUserSession, validateSession]);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.session ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.session?.user && state.profile
        ? {
            ...state.session.user,
            accessToken: state.session.access_token,
            displayName: state.profile.display_name ?? state.profile.nama_lengkap,
            role: state.profile.role ?? 'user',
            profile: state.profile,
          }
        : null,
      session: state.session,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.profile, state.session, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
