import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for our user data
export interface UserSession {
  user: any;
  access_token: string | null;
  refresh_token: string | null;
  phone: string;
  savedAt: string;
}

export interface AppUser {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    username?: string;
  };
  created_at: string;
  updated_at?: string;
}

// Cache to avoid multiple async storage calls
let currentUserCache: AppUser | null = null;

/**
 * Get the current authenticated user from local storage (cached)
 * Fast but may not reflect recent changes
 */
export const getCurrentUser = async (): Promise<AppUser | null> => {
  try {
    // Return cached user if available
    if (currentUserCache) {
      return currentUserCache;
    }

    const userSession = await AsyncStorage.getItem('@app:user_session');
    
    if (!userSession) {
      console.log('No user session found in local storage');
      return null;
    }

    const parsedSession: UserSession = JSON.parse(userSession);
    
    if (!parsedSession.user) {
      console.log('No user data in session');
      return null;
    }

    const user: AppUser = {
      id: parsedSession.user.id,
      email: parsedSession.user.email,
      phone: parsedSession.user.phone || parsedSession.phone,
      user_metadata: parsedSession.user.user_metadata || {},
      created_at: parsedSession.user.created_at,
      updated_at: parsedSession.user.updated_at,
    };

    currentUserCache = user;
    return user;
  } catch (error) {
    console.error('Error retrieving current user:', error);
    return null;
  }
};

/**
 * Get the current user with real-time data from Supabase
 * Ensures data is up-to-date but requires network call
 */
export const getCurrentUserFromServer = async (): Promise<AppUser | null> => {
  try {
    // Clear cache to force fresh data
    currentUserCache = null;

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error retrieving user from server:', error);
      return await getCurrentUser(); // Fallback to local storage
    }

    if (!user) {
      console.log('No authenticated user found');
      return null;
    }

    // Update local storage with current data
    await updateStoredUserData(user);

    const appUser: AppUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      user_metadata: user.user_metadata || {},
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    currentUserCache = appUser;
    return appUser;
  } catch (error) {
    console.error('Error in getCurrentUserFromServer:', error);
    return await getCurrentUser(); // Fallback to local storage
  }
};

/**
 * Update the stored user session with current user data
 */
export const updateStoredUserData = async (user: any): Promise<void> => {
  try {
    const existingSession = await AsyncStorage.getItem('@app:user_session');
    
    if (existingSession) {
      const parsedSession: UserSession = JSON.parse(existingSession);
      
      const updatedSession: UserSession = {
        ...parsedSession,
        user: user,
        savedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('@app:user_session', JSON.stringify(updatedSession));
      
      // Update cache
      currentUserCache = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        user_metadata: user.user_metadata || {},
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};

/**
 * Verify user authentication status
 */
export const verifyAuthentication = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    console.error('Error verifying authentication:', error);
    return false;
  }
};

/**
 * Retrieve access token for authenticated requests
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const userSession = await AsyncStorage.getItem('@app:user_session');
    
    if (!userSession) {
      return null;
    }

    const parsedSession: UserSession = JSON.parse(userSession);
    return parsedSession.access_token;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

/**
 * Clear all user data (logout)
 */
export const clearUserSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('@app:user_session');
    currentUserCache = null;
    console.log('User session cleared successfully');
  } catch (error) {
    console.error('Error clearing user session:', error);
    throw error;
  }
};

/**
 * Get user profile with extended data from database
 */
export const getUserProfile = async (): Promise<any> => {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

/**
 * Validate session and refresh if necessary
 */
export const validateUserSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.log('Session validation failed:', error);
      await clearUserSession();
      return false;
    }

    // Update stored session with current data
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await updateStoredUserData(user);
    }

    return true;
  } catch (error) {
    console.error('Error validating user session:', error);
    return false;
  }
};