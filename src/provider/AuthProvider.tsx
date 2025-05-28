import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

interface AuthContextProps {
  token: string | null;
  setToken: (newToken: string | null) => void;
  userId: string | null;
  setUserId: (newId: string | null) => void;
  logout: () => void;
}

const initialAuthContext: AuthContextProps = {
  token: null,
  setToken: () => {},
  userId: null,
  setUserId: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initialAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken_] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [userId, setUserId_] = useState<string | null>(
    localStorage.getItem("userId")
  );

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  const setUserId = (newId: string | null) => {
    setUserId_(newId);
  };

  const logout = () => {
    setToken_(null);
    setUserId_(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      userId,
      setUserId,
      logout,
    }),
    [token, userId]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
