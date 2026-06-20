import { createContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, logoutUser, getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Token verify karo — agar nahi mila toh user null kar do
    const verifyAndSetUser = useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }
        try {
            const data = await getMe();
            if (data && data.user) {
                setUser(data.user);
            } else {
                // getMe failed — token invalid, user logout
                localStorage.removeItem("token")
                setUser(null)
            }
        } catch (err) {
            localStorage.removeItem("token")
            setUser(null)
        } finally {
            setLoading(false);
        }
    }, [])

    // App start hone pe verify karo
    useEffect(() => {
        verifyAndSetUser();
    }, [verifyAndSetUser]);

    // Jab bhi localStorage change ho (token delete) — re-verify karo
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "token") {
                if (!e.newValue) {
                    // Token delete hua — user logout
                    setUser(null)
                } else {
                    // Token change hua — re-verify
                    verifyAndSetUser()
                }
            }
        }
        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [verifyAndSetUser])

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await loginUser({ email, password });
            if (data && data.user) {
                setUser(data.user);
            }
            return data;
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await registerUser({ username, email, password });
            if (data && data.user) {
                setUser(data.user);
            }
            return data;
        } catch (err) {
            console.error("Registration failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, handleLogin, handleRegister, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};