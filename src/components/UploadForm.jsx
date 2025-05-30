import { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            await API.post("/files/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Файл успешно загружен");
            setFile(null);
            // 🔁 В идеале: вызови refetch логов через props (не window.location.reload)
        } catch (err) {
            toast.error("Ошибка загрузки файла");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
            />
            <button type="submit" disabled={uploading}>
                {uploading ? "Загрузка..." : "Загрузить"}
            </button>
        </form>
    );
}
