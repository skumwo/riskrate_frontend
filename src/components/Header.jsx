import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";

export default function Header() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    if (!user) return null;

    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: 10, background: "#eee" }}>
            <div>
                <strong>{user.username}</strong> ({user.role})
            </div>
            <button onClick={logout}>Logout</button>
        </div>
    );
}