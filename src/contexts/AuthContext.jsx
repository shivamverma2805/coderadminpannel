import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      if (activeSession?.user) {
        await fetchUserProfile(activeSession.user.id);
      }
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    setIsLoading(true);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, avatar_url, role`)
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile(data);
        setUser(prevUser => ({ ...prevUser, ...data })); // Merge profile data into user object
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      setProfile(null); // Ensure profile is reset on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (email, password) => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    if (data.user) {
       await fetchUserProfile(data.user.id);
    }
    setIsLoading(false);
    return data;
  };

  const signup = async (email, password, fullName, role) => {
    setIsLoading(true);
    const defaultAvatarUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/4bfa6c8f-fcb4-4d67-b9c8-ea99cda758b0/097581b16d7c6b481fc48639892c1e5f.png";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          avatar_url: defaultAvatarUrl
        },
      },
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }

    if (data.user) {
       // Profile created by trigger, onAuthStateChange will fetch it.
    }
    setIsLoading(false);
    return data;
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setIsLoading(false);
      throw error;
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsLoading(false);
  };

  const updateUserProfile = async (updatedData) => {
    if (!user) throw new Error("No user logged in.");
    setIsLoading(true);
    
    const profileUpdates = {
      id: user.id,
      full_name: updatedData.fullName || profile?.full_name,
      avatar_url: updatedData.avatarUrl || profile?.avatar_url,
      role: updatedData.role || profile?.role, 
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(profileUpdates);
    
    if (error) {
      setIsLoading(false);
      throw error;
    }
    
    await fetchUserProfile(user.id); 
    setIsLoading(false);
  };


  return (
    <AuthContext.Provider value={{ user, session, profile, login, logout, signup, updateUserProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};