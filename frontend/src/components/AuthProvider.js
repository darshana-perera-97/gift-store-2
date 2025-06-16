import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On load, pull from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (username) => {
    setUser({ username });
    localStorage.setItem("adminUser", JSON.stringify({ username }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
