import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SupabaseSession, SupabaseUser } from '../lib_supabase.ts';
import * as auth from '../lib_supabase.ts';
interface AuthContextValue { session: SupabaseSession | null; user: SupabaseUser | null; isAdmin: boolean; loading: boolean; signIn: (email:string,password:string)=>Promise<{error:Error|null}>; signOut:()=>Promise<{error:Error|null}> }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [session,setSession]=useState<SupabaseSession|null>(auth.getStoredSession());
  const [user,setUser]=useState<SupabaseUser|null>(null);
  const [isAdmin,setIsAdmin]=useState(false);
  const [loading,setLoading]=useState(true);
  const sync = async (s:SupabaseSession|null) => {
    const u = await auth.getUser(s); setSession(auth.getStoredSession()); setUser(u); setIsAdmin(false);
    const latest = auth.getStoredSession(); if (u && latest) setIsAdmin((await auth.getProfileRole(u.id, latest.access_token)) === 'admin');
    setLoading(false);
  };
  useEffect(()=>{ sync(session); },[]);
  const signIn = async (email:string,password:string) => { const r=await auth.signIn(email,password); if(r.error)return {error:r.error}; await sync(r.session); return {error:null}; };
  const signOut = async()=>{ try{await auth.signOut();setSession(null);setUser(null);setIsAdmin(false);return {error:null};}catch(e){return {error:e instanceof Error?e:new Error('Sign out failed')}} };
  return <AuthContext.Provider value={{session,user,isAdmin,loading,signIn,signOut}}>{children}</AuthContext.Provider>;
};
export const useAuth=()=>{const c=useContext(AuthContext);if(!c)throw new Error('useAuth must be used within AuthProvider');return c;};
