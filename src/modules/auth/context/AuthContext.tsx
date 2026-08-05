'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSubscribed: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  loginAnonymously: () => Promise<void>;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSubscribed: false,
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  loginAnonymously: async () => {},
  loginWithGoogle: async () => null,
  logout: async () => {},
});

function createSyntheticGuestUser(): User {
  return {
    uid: `guest_${Date.now()}`,
    email: 'guest@minipost.app',
    displayName: 'Guest Creator',
    isAnonymous: true,
    emailVerified: false,
    getIdToken: async () => 'guest_token',
  } as unknown as User;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check redirect result on mount if redirect auth flow was used
    getRedirectResult(auth)
      .then((res) => {
        if (res?.user) {
          setUser(res.user);
        }
      })
      .catch((err) => {
        console.warn('[AuthContext] Redirect result check:', err);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser((prev) => (prev && prev.isAnonymous ? prev : null));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribed members check (Registered authenticated users)
  const isSubscribed = Boolean(user && !user.isAnonymous);

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const loginAnonymously = async () => {
    try {
      const cred = await signInAnonymously(auth);
      if (cred.user) {
        setUser(cred.user);
        return;
      }
    } catch (err) {
      console.warn('[AuthContext] Firebase Anonymous Auth fallback:', err);
    }
    // Synthetic local fallback if Firebase Auth domain is unverified
    setUser(createSyntheticGuestUser());
  };

  const loginWithGoogle = async (): Promise<User | null> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setUser(res.user);
        return res.user;
      }
    } catch (popupErr: any) {
      console.warn('[AuthContext] Google popup sign-in warning, trying redirect fallback:', popupErr);
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectErr) {
        console.warn('[AuthContext] Redirect failed, enabling instant Guest session:', redirectErr);
      }
    }

    // Failsafe: if popup or redirect fails due to domain policy, grant seamless guest access so user is never blocked
    try {
      const cred = await signInAnonymously(auth);
      if (cred.user) {
        setUser(cred.user);
        return cred.user;
      }
    } catch {
      // Ignore
    }

    const syntheticUser = createSyntheticGuestUser();
    setUser(syntheticUser);
    return syntheticUser;
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSubscribed,
        loginWithEmail,
        registerWithEmail,
        loginAnonymously,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
