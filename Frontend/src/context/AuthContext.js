// import React, { createContext, useState, useEffect, useContext } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     try {
//       if (credentials.email === 'abc@example.com' && credentials.password === 'abc') {
//         setUser({ email: 'abc@example.com' });
//         localStorage.setItem("user", JSON.stringify({ email: 'abc@example.com' }));
//         return { email: 'abc@example.com' };
//       } else {
//         throw new Error('Invalid credentials');
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//     }
//   };

//   const signup = async (credentials) => {
//     // For now, just return a success message
//     console.log('Signup successful:', credentials);
//     return { message: 'Signup successful' };
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   if (!children) {
//     console.error('AuthProvider did not receive children props.');
//     return null; // or throw an error
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export default AuthContext;

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post("http://localhost:3001/login", { email, password });
      const { token, message } = response.data;

      // Store token and email (or user info) in state and localStorage
      const userData = { email, token };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return message; // e.g. "Login successful"
    } catch (error) {
      // Extract backend error message or fallback
      const errorMsg = error.response?.data?.error || "Login failed";
      console.error("Login failed:", errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const signup = async (formData) => {
    try {
      const response = await axios.post("http://localhost:3001/signup", formData);
      return response.data.message;
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Signup failed";
      throw new Error(errorMsg);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
