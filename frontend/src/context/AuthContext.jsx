import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/config";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data);
    return res.data;
  };

  const completeLogin = (user) => {
    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, completeLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
