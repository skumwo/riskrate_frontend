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
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        try {
            await API.post("/register/", form);
            alert("Успешная регистрация! Теперь войдите.");
            navigate("/");
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
        <div style={{ maxWidth: 350, margin: "50px auto", border: "1px solid #ccc", borderRadius: 8, padding: 24 }}>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Логин:<br />
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </label>
                <br /><br />
                <label>
                    Пароль:<br />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br /><br />
                {/* Если роль всегда user — можно скрыть, если хочешь позволять регистрировать админов — открой */}
                <label>
                    Роль:
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>
                <br /><br />
                <button type="submit">Зарегистрироваться</button>
                {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
            </form>
        </div>
    );
}
