import { auth } from "@/lib/axios";
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

// Type for the current user
type SessionUser = {
  id: number;
  name: string;
  email: string;
};

// Type for the context value
type AuthContextType = {
  user: SessionUser | null;
  loading: boolean;
  loginCallback: (user: SessionUser) => void;
  clearAuthState: () => void;
};

// Create a context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  clearAuthState: () => {},
  loginCallback: (user: SessionUser) => {},
});

// Create a provider component
const AuthProvider = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await auth.get("/currentUser");
        console.log("cenotex",response.data);
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const clearAuthState = () => {
    setCurrentUser(null);
    setLoading(false);
  };

  const loginCallback = (user: SessionUser) => {
    setCurrentUser(user);
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{ user: currentUser, loading, clearAuthState, loginCallback }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
