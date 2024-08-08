import { app } from "firebase-app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

interface AuthProps {
  children: React.ReactNode;
}
const AuthContext = createContext({
  user: null as User | null,
});

export const AuthContextProvider = ({ children }: AuthProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    // 인증 상태 감지
    onAuthStateChanged(auth, user => {
      user && setCurrentUser(user);
      !user && setCurrentUser(null);
    });
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
