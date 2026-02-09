import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const getUserFromStorage = () => {
    const isLog = localStorage.getItem("isLog") === "true";

    if (!isLog) return null;

    return {
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        role: localStorage.getItem("role") || "VISITOR",
        token: localStorage.getItem("token"),
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => getUserFromStorage());

    useEffect(() => {
        setUser(getUserFromStorage());
    }, [])

    const login = (userData) => {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("isLog", "true");

        setUser(userData);
    };


    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    const value = {
        user,
        role: user?.role || "VISITOR",
        isAuthenticated: !!user,
        login,
        logout,
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}


export const useAuth = () => useContext(AuthContext);