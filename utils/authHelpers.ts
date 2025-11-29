import { supabase } from "../supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Helper to detect the "no session" auth error
const isAuthSessionMissingError = (err: any) => {
  if (!err) return false;
  return (
    err.name === "AuthSessionMissingError" ||
    err.__isAuthError === true ||
    err.status === 400
  );
};

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

    const userSession = await AsyncStorage.getItem("@app:user_session");

    if (!userSession) {
      console.log("No user session found in local storage");
      return null;
    }

    const parsedSession: UserSession = JSON.parse(userSession);

    if (!parsedSession.user) {
      console.log("No user data in session");
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
    console.error("Error retrieving current user:", error);
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

    // 1) Check session first
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.warn("getCurrentUserFromServer getSession error:", sessionError);
    }

    if (!session) {
      // No Supabase session in memory -> treat as logged out
      console.log(
        "getCurrentUserFromServer: no active Supabase session, falling back to local user"
      );
      return await getCurrentUser(); // may be null
    }

    // 2) Now we are sure a session exists, we can safely call getUser
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (isAuthSessionMissingError(error)) {
        console.log(
          "getCurrentUserFromServer: AuthSessionMissingError – falling back to local user"
        );
        return await getCurrentUser();
      }

      console.error("Error retrieving user from server:", error);
      return await getCurrentUser(); // Fallback to local storage
    }

    if (!user) {
      console.log("No authenticated user found on server");
      return await getCurrentUser(); // or just `return null;`
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
  } catch (error: any) {
    if (isAuthSessionMissingError(error)) {
      console.log(
        "getCurrentUserFromServer: AuthSessionMissingError in catch – falling back to local user"
      );
      return await getCurrentUser();
    }

    console.error("Error in getCurrentUserFromServer:", error);
    return await getCurrentUser(); // Fallback to local storage
  }
};

/**
 * Update the stored user session with current user data
 */
export const updateStoredUserData = async (user: any): Promise<void> => {
  try {
    const existingSession = await AsyncStorage.getItem("@app:user_session");

    if (existingSession) {
      const parsedSession: UserSession = JSON.parse(existingSession);

      const updatedSession: UserSession = {
        ...parsedSession,
        user: user,
        savedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        "@app:user_session",
        JSON.stringify(updatedSession)
      );

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
    console.error("Error updating user data:", error);
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
    console.error("Error verifying authentication:", error);
    return false;
  }
};

/**
 * Retrieve access token for authenticated requests
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const userSession = await AsyncStorage.getItem("@app:user_session");

    if (!userSession) {
      return null;
    }

    const parsedSession: UserSession = JSON.parse(userSession);
    return parsedSession.access_token;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

/**
 * Clear all user data (logout)
 */
export const clearUserSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("@app:user_session");
    currentUserCache = null;
    console.log("User session cleared successfully");
  } catch (error) {
    console.error("Error clearing user session:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await supabase.auth.signOut(); // Supabase logout
    await clearUserSession(); // Clear local session
    console.log("Logged out successfully.");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

/**
 * Get user profile with extended data from database
 */
export const getUserProfile = async (): Promise<any> => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      // No local user => just return null instead of throwing
      console.log("getUserProfile: no authenticated user, returning null");
      return null;
    }

    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};

/**
 * Validate session and refresh if necessary
 */
export const validateUserSession = async (): Promise<boolean> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      if (isAuthSessionMissingError(error)) {
        console.log(
          "validateUserSession: AuthSessionMissingError – clearing local session"
        );
      } else {
        console.log("Session validation failed:", error);
      }
      await clearUserSession();
      return false;
    }

    if (!session) {
      console.log("validateUserSession: no session – clearing local session");
      await clearUserSession();
      return false;
    }

    // Update stored session with current data
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      if (isAuthSessionMissingError(userError)) {
        console.log(
          "validateUserSession: AuthSessionMissingError on getUser – clearing local session"
        );
        await clearUserSession();
        return false;
      }

      console.error("validateUserSession: getUser error:", userError);
      return false;
    }

    if (user) {
      await updateStoredUserData(user);
    }

    return true;
  } catch (error: any) {
    if (isAuthSessionMissingError(error)) {
      console.log(
        "validateUserSession: AuthSessionMissingError in catch – clearing local session"
      );
      await clearUserSession();
      return false;
    }

    console.error("Error validating user session:", error);
    return false;
  }
};
