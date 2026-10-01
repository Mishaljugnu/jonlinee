const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const STORAGE_KEY = 'j_online_supabase_session';

export interface SupabaseUser { id: string; email?: string; [key: string]: unknown }
export interface SupabaseSession { access_token: string; refresh_token: string; expires_at?: number; user: SupabaseUser }

function headers(accessToken?: string) {
  const h: Record<string, string> = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };
  if (accessToken) h.Authorization = `Bearer ${accessToken}`;
  return h;
}
export function getStoredSession(): SupabaseSession | null {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function storeSession(session: SupabaseSession | null) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}
export async function signIn(email: string, password: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) });
  const data = await res.json();
  if (!res.ok) return { error: new Error(data.error_description || data.msg || data.message || 'Invalid email or password'), session: null };
  const session = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at, user: data.user } as SupabaseSession;
  storeSession(session);
  return { error: null, session };
}
export async function refreshSession() {
  const current = getStoredSession();
  if (!current?.refresh_token) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, { method: 'POST', headers: headers(), body: JSON.stringify({ refresh_token: current.refresh_token }) });
  if (!res.ok) { storeSession(null); return null; }
  const data = await res.json();
  const session = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at, user: data.user || current.user } as SupabaseSession;
  storeSession(session); return session;
}
export async function getUser(session = getStoredSession()) {
  if (!session?.access_token) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: headers(session.access_token) });
  if (res.ok) return await res.json() as SupabaseUser;
  if (res.status === 401) { const refreshed = await refreshSession(); if (refreshed) return getUser(refreshed); }
  return null;
}
export async function getProfileRole(userId: string, accessToken: string) {
  const params = encodeURIComponent(`eq.${userId}`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=${params}&select=role`, { headers: headers(accessToken) });
  if (!res.ok) return null;
  const rows = await res.json(); return rows?.[0]?.role || null;
}
export async function signOut() {
  const session = getStoredSession();
  if (session?.access_token) await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: headers(session.access_token) }).catch(() => {});
  storeSession(null);
}
