import { createContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, logoutUser, getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cookie se token verify karo — agar valid hai toh user set karo
    const verifyAndSetUser = useCallback(async () => {
        try {
            const data = await getMe();
            if (data && data.user) {
                setUser(data.user);
            } else {
                // Cookie nahi hai ya invalid — user null
                setUser(null)
            }
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false);
        }
    }, [])

    // App start hone pe verify karo (cookie se)
    useEffect(() => {
        verifyAndSetUser();
    }, [verifyAndSetUser]);

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