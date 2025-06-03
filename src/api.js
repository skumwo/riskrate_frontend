import axios from "axios";

const API = axios.create({
    baseURL: "https://49f1-213-211-113-148.ngrok-free.app/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    // СНИМАЕМ warning
    req.headers["ngrok-skip-browser-warning"] = "true";
    return req;
});

export default API;
