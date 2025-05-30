import API from "../api.js";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

export default function LogTable({ logs, hideRiskActions = false }) {
    const { user } = useContext(UserContext);

    const handleRiskUpdate = async (id, newRisk) => {
        try {
            await API.patch(`/logs/${id}/update-risk/`, { risk_level: newRisk });
            window.location.reload();
        } catch (err) {
            alert("Ошибка при обновлении риска");
        }
    };

    return (
        <table>
            <thead>
            <tr>
                <th>User</th>
                <th>Action</th>
                <th>File</th>
                <th>Time</th>
                <th>IP</th>
                <th>Location</th>
                <th>Risk</th>
                <th>Mark</th>
            </tr>
            </thead>
            <tbody>
            {logs.map(log => (
                <tr key={log.id}>
                    <td>{log.username}</td>
                    <td>{log.action_type}</td>
                    <td>{log.file_name}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{log.ip_address}</td>
                    <td>{log.city}, {log.country}</td>
                    {/* Показывать "n/a" если unknown, иначе реальный риск */}
                    <td>{log.risk_level === "unknown" ? "n/a" : log.risk_level}</td>
                    <td>
                        {/* Кнопки для ручной разметки только если log.risk_level !== "unknown" */}
                        {user?.role === 'admin' && !hideRiskActions && log.risk_level !== "unknown" && (
                            <>
                                <button onClick={() => handleRiskUpdate(log.id, 'critical')}>Critical</button>
                                <button onClick={() => handleRiskUpdate(log.id, 'suspicious')}>Suspicious</button>
                                <button onClick={() => handleRiskUpdate(log.id, 'normal')}>Normal</button>
                            </>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
