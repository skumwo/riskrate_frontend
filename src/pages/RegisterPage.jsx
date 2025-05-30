import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: "",
        password: "",
        role: "user",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await API.post("/register/", form);
            setSuccess("Успешная регистрация! Теперь войдите.");
            setTimeout(() => navigate("/"), 1200);
        } catch (err) {
            setError(
                err?.response?.data?.username?.[0] ||
                err?.response?.data?.password?.[0] ||
                err?.response?.data?.role?.[0] ||
                "Ошибка регистрации"
            );
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
                onSubmit={handleSubmit}
                style={{
                    background: "white",
                    borderRadius: 12,
                    boxShadow: "0 4px 24px rgba(30,30,50,0.08)",
                    padding: "36px 32px 28px 32px",
                    minWidth: 320,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18
                }}
            >
                <h2 style={{
                    marginBottom: 14,
                    fontWeight: 700,
                    fontSize: 26,
                    letterSpacing: "0.5px",
                    color: "#2d314d"
                }}>Регистрация</h2>
                <input
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: "1px solid #b0b8d9",
                        marginBottom: 4,
                        fontSize: 16,
                        outline: "none"
                    }}
                    type="text"
                    name="username"
                    placeholder="Логин"
                    value={form.username}
                    onChange={handleChange}
                    required
                    autoFocus
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
                    name="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid #b0b8d9",
                        fontSize: 15,
                        background: "#f7f8fa",
                        marginTop: 2,
                        color: "#333"
                    }}
                >
                    <option value="user">Обычный пользователь</option>
                    <option value="admin">Администратор</option>
                </select>
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
                        marginTop: 12,
                        boxShadow: "0 2px 8px rgba(60,90,255,0.10)"
                    }}
                >Зарегистрироваться</button>
                {error && (
                    <div style={{
                        color: "#e53935",
                        marginTop: 4,
                        fontSize: 14,
                        fontWeight: 500
                    }}>{error}</div>
                )}
                {success && (
                    <div style={{
                        color: "#43a047",
                        marginTop: 4,
                        fontSize: 15,
                        fontWeight: 500
                    }}>{success}</div>
                )}
                <p style={{ fontSize: 15, marginTop: 14 }}>
                    Уже есть аккаунт?{" "}
                    <a href="/" style={{ color: "#3d5afe", textDecoration: "underline" }}>
                        Войдите
                    </a>
                </p>
            </form>
        </div>
    );
}
