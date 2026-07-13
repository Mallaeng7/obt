import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { data: session, status } = useSession();
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      login(session.user);
    } else if (status === 'unauthenticated') {
      logout();
    }
  }, [session, status, login, logout]);

  return {
    session,
    status,
    signIn,
    signOut,
  };
}
