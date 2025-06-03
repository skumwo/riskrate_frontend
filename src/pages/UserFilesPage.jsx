import { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function UserFilesPage() {
    const [files, setFiles] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [uploading, setUploading] = useState(false);

    const fetchFiles = async () => {
        const res = await API.get("/files/");
        setFiles(res.data);
    };

    useEffect(() => {
        API.get("/files/").then(res => {
            console.log("files API response:", res.data);
            setFiles(res.data);
        });

        fetchFiles();
    }, []);

    const handleUpload = async (e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles.length) return;

        const formData = new FormData();
        for (let file of selectedFiles) {
            formData.append("file", file);
        }

        setUploading(true);
        try {
            await API.post("/files/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Файлы загружены");
            fetchFiles();
        } catch (err) {
            toast.error("Ошибка загрузки");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/files/${id}/`);
            toast.success("Файл удален");
            fetchFiles();
        } catch (err) {
            toast.error("Ошибка удаления");
        }
    };

    const handleDeleteSelected = async () => {
        if (selected.size === 0) {
            toast.info("Выберите хотя бы один файл");
            return;
        }
        if (!window.confirm("Удалить выбранные файлы?")) return;
        for (let id of selected) {
            await handleDelete(id);
        }
        setSelected(new Set());
        fetchFiles();
    };

    const toggleSelect = (id) => {
        const newSelected = new Set(selected);
        newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
        setSelected(newSelected);
    };

    const downloadSelected = async () => {
        if (selected.size === 0) {
            toast.info("Выберите хотя бы один файл");
            return;
        }
        for (let file of files) {
            if (selected.has(file.id)) {
                await downloadFile(file.id, file.filename);
            }
        }
    };

    const downloadFile = async (id, filename) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API.defaults.baseURL}/files/${id}/download/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            toast.error("Ошибка скачивания: " + res.statusText);
            return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || "file";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const viewFile = async (id) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API.defaults.baseURL}/files/${id}/view/`, {
            headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
        });
        if (!res.ok) {
            toast.error("Ошибка просмотра: " + res.statusText);
            return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
    };

    return (
        <div style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: 36,
            background: "#fafbfc",
            borderRadius: 16,
            boxShadow: "0 2px 12px 0 #eee",
        }}>
            <h2 style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 0.5,
                marginBottom: 22,
                color: "#283593"
            }}>
                📁 Файлы
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <label
                    style={{
                        display: "inline-block",
                        background: "#e8eaf6",
                        padding: "10px 20px",
                        borderRadius: 8,
                        fontWeight: 500,
                        color: "#283593",
                        cursor: uploading ? "not-allowed" : "pointer",
                        border: uploading ? "1px solid #eee" : "1.5px solid #7986cb",
                        transition: "all 0.2s"
                    }}
                >
                    <input
                        type="file"
                        multiple
                        onChange={handleUpload}
                        disabled={uploading}
                        style={{ display: "none" }}
                    />
                    {uploading ? "Загрузка..." : "➕ Загрузить файлы"}
                </label>
                <button
                    onClick={downloadSelected}
                    style={{
                        background: "#1976d2",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: 8,
                        fontWeight: 500,
                        border: "none",
                        fontSize: 15,
                        cursor: "pointer"
                    }}
                >⬇️ Скачать выбранные</button>
                <button
                    onClick={handleDeleteSelected}
                    style={{
                        marginLeft: 0,
                        background: "#e53935",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: 8,
                        fontWeight: 500,
                        border: "none",
                        fontSize: 15,
                        cursor: "pointer"
                    }}
                >🗑️ Удалить выбранные</button>
            </div>
            <table style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "white",
                borderRadius: 12,
                boxShadow: "0 1px 8px #e8eaf6"
            }}>
                <thead>
                <tr style={{
                    background: "#e3e8fd",
                    color: "#2d314d"
                }}>
                    <th style={{ padding: 12, borderRadius: "12px 0 0 0", fontSize: 17 }}>✓</th>
                    <th style={{ padding: 12, fontSize: 17 }}>Имя файла</th>
                    <th style={{ padding: 12, fontSize: 17 }}>Владелец</th>
                    <th style={{ padding: 12, fontSize: 17 }}>Дата загрузки</th>
                    <th style={{ padding: 12, borderRadius: "0 12px 0 0", fontSize: 17 }}>Действия</th>
                </tr>
                </thead>
                <tbody>
                {files.map(file => (
                    <tr key={file.id} style={{ borderBottom: "1px solid #f0f1f5" }}>
                        <td style={{ textAlign: "center" }}>
                            <input
                                type="checkbox"
                                checked={selected.has(file.id)}
                                onChange={() => toggleSelect(file.id)}
                                style={{ width: 18, height: 18 }}
                            />
                        </td>
                        <td style={{ padding: "8px 10px", fontSize: 16 }}>{file.filename}</td>
                        <td style={{ padding: "8px 10px", color: "#5f6793" }}>
                            {file.user?.username || "неизвестно"}
                        </td>
                        <td style={{ padding: "8px 10px", color: "#5f6793" }}>
                            {new Date(file.uploaded_at).toLocaleString()}
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <button
                                onClick={() => downloadFile(file.id, file.filename)}
                                style={{
                                    marginRight: 6,
                                    background: "#42a5f5",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 7,
                                    padding: "6px 13px",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    fontSize: 14
                                }}
                            >Скачать</button>
                            <button
                                onClick={() => viewFile(file.id)}
                                style={{
                                    marginRight: 6,
                                    background: "#7e57c2",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 7,
                                    padding: "6px 13px",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    fontSize: 14
                                }}
                            >Просмотреть</button>
                            <button
                                style={{
                                    background: "#e53935",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 7,
                                    padding: "6px 13px",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    fontSize: 14
                                }}
                                onClick={() => handleDelete(file.id)}
                            >Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div style={{ marginTop: 16, color: "#5f6793", fontSize: 15 }}>
                {files.length === 0 && "Нет файлов для отображения."}
            </div>
        </div>
    );
}
