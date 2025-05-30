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

    // Новый вариант: скачать все выбранные через авторизованный API
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
            headers: { 'Authorization': `Bearer ${token}` }
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
        <div>
            <h2>📁 Все доступные файлы</h2>
            <input type="file" multiple onChange={handleUpload} disabled={uploading} />
            <br /><br />
            <button onClick={downloadSelected}>⬇️ Скачать выбранные</button>
            <button onClick={handleDeleteSelected} style={{marginLeft: 10, color: 'red'}}>🗑️ Удалить выбранные</button>
            <br /><br />
            <table border="1" cellPadding={8}>
                <thead>
                <tr>
                    <th>✓</th>
                    <th>Имя файла</th>
                    <th>Владелец</th>
                    <th>Дата загрузки</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {files.map(file => (
                    <tr key={file.id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selected.has(file.id)}
                                onChange={() => toggleSelect(file.id)}
                            />
                        </td>
                        <td>{file.filename}</td>
                        <td>{file.user?.username || "неизвестно"}</td>
                        <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                        <td>
                            <button onClick={() => downloadFile(file.id, file.filename)}>Скачать</button>{" "}
                            <button onClick={() => viewFile(file.id)}>Просмотреть</button>{" "}
                            <button style={{color:'red'}} onClick={() => handleDelete(file.id)}>Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
