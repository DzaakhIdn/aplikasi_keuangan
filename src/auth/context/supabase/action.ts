import type { Provider } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

import { authPaths } from '../../paths';
import { getAuthorizedProfile, updateLastLogin } from './profile';

type PasswordCredentials = {
  email: string;
  password: string;
};

/** **************************************
 * Sign in
 *************************************** */

// ----------------------------------------------------------------------

export const signInWithPassword = async ({ email, password }: PasswordCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;

  try {
    const profile = await getAuthorizedProfile(data.user.id);
    await updateLastLogin(data.user.id);

    return { ...data, profile };
  } catch (accessError) {
    await supabase.auth.signOut();
    throw accessError;
  }
};

/** **************************************
 * Sign out
 *************************************** */

// ----------------------------------------------------------------------

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw error;
  }

  return { error };
};

/** **************************************
 * Reset password
 *************************************** */

// ----------------------------------------------------------------------

type ResetPasswordParams = {
  email: string;
  redirectTo?: string;
};

/** **************************************
 * Sign up
 *************************************** */

export const signUp = async ({ email, password }: PasswordCredentials) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;

  return data;
};

/** **************************************
 * OAuth
 *************************************** */

export const signInWithOAuth = async (provider: Provider, redirectTo = window.location.origin) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });

  if (error) throw error;

  return data;
};

export const resetPassword = async ({
  email,
  redirectTo = `${window.location.origin}${authPaths.updatePassword}`,
}: ResetPasswordParams) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};

/** **************************************
 * Update password
 *************************************** */

// ----------------------------------------------------------------------

export const updatePassword = async ({ password }: { password: string }) => {
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error(error);
    throw error;
  }

  return { data, error };
};
