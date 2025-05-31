import axios from "axios";

const API = axios.create({
    baseURL: "https://4ec0-2a03-32c0-2f-8a24-4055-ee36-ba4a-d629.ngrok-free.app/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export default API;
