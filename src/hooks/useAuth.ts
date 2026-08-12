import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  doc, 
  getDoc,
  auth, 
  db 
} from '../lib/firebase';

export interface CustomStaffUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  isCustomStaff: true;
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Load custom session if stored in localStorage
  const loadCustomSession = () => {
    try {
      const stored = localStorage.getItem('neema_staff_session');
      if (stored) {
        const session = JSON.parse(stored);
        if (session && session.token) {
          return {
            uid: session.username,
            email: `${session.username}@neemaheep.com`,
            displayName: session.fullName,
            role: session.role,
            isCustomStaff: true,
            token: session.token
          } as CustomStaffUser;
        }
      }
    } catch (err) {
      console.error("Failed to restore staff session: ", err);
    }
    return null;
  };

  useEffect(() => {
    // 1. First check if a custom username & password user is active
    const customUser = loadCustomSession();
    if (customUser) {
      setUser(customUser);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // 2. Fall back to standard Google Firebase Auth if no custom session is loaded
    const unsubscribe = onAuthStateChanged(auth, async (gUser) => {
      if (gUser) {
        try {
          const authorizedEmails = ['muthonichar12@gmail.com', 'ngangaandrew70@gmail.com'];
          const isPreAuthorized = gUser.email ? authorizedEmails.includes(gUser.email.toLowerCase()) : false;

          const adminDoc = await getDoc(doc(db, 'admins', gUser.uid));
          if (adminDoc.exists() || isPreAuthorized) {
            setUser(gUser);
            setIsAdmin(true);
          } else {
            setUser(gUser);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error evaluating admin list:", error);
          const authorizedEmails = ['muthonichar12@gmail.com', 'ngangaandrew70@gmail.com'];
          const isPreAuthorized = gUser.email ? authorizedEmails.includes(gUser.email.toLowerCase()) : false;
          if (isPreAuthorized) {
            setUser(gUser);
            setIsAdmin(true);
          } else {
            setUser(gUser);
            setIsAdmin(false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithUsernamePassword = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      let data: any = {};
      const responseText = await res.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = { success: false, error: "Server returned an unexpected response format." };
        }
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed. Please verify your credentials.");
      }

      // Save custom session
      localStorage.setItem('neema_staff_session', JSON.stringify({
        username: data.user.username,
        fullName: data.user.fullName,
        role: data.user.role,
        token: data.token
      }));

      const loggedUser: CustomStaffUser = {
        uid: data.user.username,
        email: `${data.user.username}@neemaheep.com`,
        displayName: data.user.fullName,
        role: data.user.role,
        isCustomStaff: true,
        token: data.token
      };

      setUser(loggedUser);
      setIsAdmin(true);
      setLoading(false);
      return loggedUser;
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const changeCustomPassword = async (currentPassword: string, newPassword: string) => {
    const customUser = loadCustomSession();
    if (!customUser) {
      throw new Error("Only custom username accounts can change passwords this way.");
    }

    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customUser.token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    let data: any = {};
    const responseText = await res.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { success: false, error: "Server returned an unexpected response format." };
      }
    }

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Change password failed");
    }
    return data.message;
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('neema_staff_session');
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return { 
    user, 
    isAdmin, 
    loading, 
    signOut, 
    loginWithUsernamePassword,
    changeCustomPassword
  };
}
