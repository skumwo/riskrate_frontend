import { useContext, useState } from "react";
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";

export default function LoginPage() {
    const { setUser } = useContext(UserContext);
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await API.post("/token/", form);
        localStorage.setItem("token", res.data.access);

        const me = await API.get("/me/");
        setUser(me.data);

        if (me.data.role === "admin") {
            navigate("/logs");
        } else {
            navigate("/my-files");
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                    placeholder="Username"
                    onChange={e => setForm({ ...form, username: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
            </p>
        </div>
    );
}
