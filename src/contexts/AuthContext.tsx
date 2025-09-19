import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Auth] Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer Supabase calls to prevent auth state conflicts
          setTimeout(async () => {
            try {
              console.log('[Auth] Fetching profile for user:', session.user.id);
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('user_id', session.user.id)
                .maybeSingle();
              
              if (error) {
                console.error('Error fetching profile:', error);
                setRole(null);
                setIsAdmin(false);
                setIsSuperAdmin(false);
              } else if (profile) {
                const fetchedRole = profile.role;
                console.log(`[Auth] User role fetched: ${fetchedRole || 'none'}`);
                setRole(fetchedRole);
                setIsAdmin(fetchedRole === 'admin' || fetchedRole === 'editor');
                setIsSuperAdmin(fetchedRole === 'superadmin');
              } else {
                console.log('[Auth] No profile found for user');
                setRole('viewer');
                setIsAdmin(false);
                setIsSuperAdmin(false);
              }
              setLoading(false);
            } catch (error) {
              console.error('Error checking admin status:', error);
              setRole(null);
              setIsAdmin(false);
              setIsSuperAdmin(false);
              setLoading(false);
            }
          }, 100);
        } else {
          console.log('[Auth] No user session, resetting roles');
          setRole(null);
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session immediately on mount
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Auth] Error getting initial session:', error);
          setLoading(false);
          return;
        }
        
        console.log('[Auth] Initial session check:', session?.user?.id);
        if (session) {
          // Don't set loading to false here, let the auth state change handler do it
          // This prevents race conditions
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('[Auth] Error in initial session check:', error);
        setLoading(false);
      }
    };

    checkInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      role,
      isAdmin,
      isSuperAdmin,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};