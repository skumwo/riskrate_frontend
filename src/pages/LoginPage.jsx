import { useContext, useState } from "react";
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const { setUser } = useContext(UserContext);
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await API.post("/token/", form);
            localStorage.setItem("token", res.data.access);
            const me = await API.get("/me/");
            setUser(me.data);
            if (me.data.role === "admin") {
                navigate("/logs");
            } else {
                navigate("/my-files");
            }
        } catch (err) {
            setError("Неверный логин или пароль");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(120deg, #ece9f7 0%, #e0ecf3 100%)"
        }}>
            <form
                onSubmit={handleLogin}
                style={{
                    background: "white",
                    borderRadius: 12,
                    boxShadow: "0 4px 24px rgba(30,30,50,0.08)",
                    padding: "40px 32px 32px 32px",
                    minWidth: 320,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18
                }}
            >
                <h2 style={{
                    marginBottom: 20,
                    fontWeight: 700,
                    fontSize: 28,
                    letterSpacing: "1px",
                    color: "#2d314d"
                }}>Вход</h2>
                <input
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: "1px solid #b0b8d9",
                        marginBottom: 6,
                        fontSize: 16,
                        outline: "none"
                    }}
                    placeholder="Логин"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                />
                <input
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: "1px solid #b0b8d9",
                        fontSize: 16,
                        outline: "none"
                    }}
                    type="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />
                {error && (
                    <div style={{
                        color: "#e53935",
                        marginTop: -10,
                        fontSize: 14,
                        fontWeight: 500
                    }}>{error}</div>
                )}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px 0",
                        background: "#3d5afe",
                        color: "white",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: 8,
                        fontSize: 17,
                        cursor: "pointer",
                        marginTop: 10,
                        boxShadow: "0 2px 8px rgba(60,90,255,0.10)"
                    }}
                >Войти</button>
                <p style={{ fontSize: 15, marginTop: 18 }}>
                    Нет аккаунта?{" "}
                    <Link to="/register" style={{ color: "#3d5afe", textDecoration: "underline" }}>
                        Зарегистрируйтесь
                    </Link>
                </p>
            </form>
        </div>
    );
}
