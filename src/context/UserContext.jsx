import { createContext, useEffect, useState } from "react";
import API from "../api.js";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        API.get("/me/")
            .then(res => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
