import { supabase } from '@/lib/supabase';

export type UserHibroProfile = {
  id: string;
  nama_lengkap: string;
  email: string;
  foto_url: string | null;
  no_hp: string | null;
  alamat: string | null;
  role: string | null;
  cabang: string | null;
  is_active: boolean | null;
  display_name: string | null;
  jabatan_id: string | null;
  jabatan: {
    jabatan: string;
  } | null;
};

type ProfileQueryResult = Omit<UserHibroProfile, 'jabatan'> & {
  jabatan: UserHibroProfile['jabatan'] | UserHibroProfile['jabatan'][];
};

export class AuthAccessError extends Error {
  constructor(message = 'Akun ini tidak memiliki akses ke aplikasi keuangan.') {
    super(message);
    this.name = 'AuthAccessError';
  }
}

export async function getAuthorizedProfile(userId: string): Promise<UserHibroProfile> {
  const { data, error } = await supabase
    .from('users_hibro')
    .select(
      `
        id,
        nama_lengkap,
        email,
        foto_url,
        no_hp,
        alamat,
        role,
        cabang,
        is_active,
        display_name,
        jabatan_id,
        jabatan:jabatan!users_hibro_jabatan_id_fkey(jabatan)
      `
    )
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new AuthAccessError('Profil pengguna tidak ditemukan.');

  const result = data as ProfileQueryResult;
  const jabatan = Array.isArray(result.jabatan) ? (result.jabatan[0] ?? null) : result.jabatan;
  const profile: UserHibroProfile = { ...result, jabatan };
  const isBendahara = profile.jabatan?.jabatan.trim().toLowerCase() === 'bendahara';

  if (profile.is_active !== true) {
    throw new AuthAccessError('Akun Anda sedang tidak aktif.');
  }

  const hasFinanceAccess = profile.role === 'super_admin' || isBendahara;

  if (!hasFinanceAccess) {
    throw new AuthAccessError('Akses hanya tersedia untuk Super Admin atau pengguna dengan jabatan Bendahara.');
  }

  return profile;
}

export async function updateLastLogin(userId: string) {
  const { error } = await supabase
    .from('users_hibro')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);

  if (error) console.error('Failed to update last login:', error);
}
