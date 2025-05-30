import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import API from "../api.js";

const RISK_COLORS = {
    normal: "#e0f7fa",
    suspicious: "#fffde7",
    critical: "#ffebee",
    unknown: "#f5f5f5"
};

export default function GroupedLogTable({ logs }) {
    const { user } = useContext(UserContext);
    const [openRows, setOpenRows] = useState({});

    const handleRiskUpdate = async (id, newRisk) => {
        try {
            await API.patch(`/grouped-actions/${id}/update-risk/`, { risk_level: newRisk });
            window.location.reload();
        } catch (err) {
            alert("Ошибка при обновлении риска");
        }
    };

    const toggleRow = id => setOpenRows(prev => ({
        ...prev,
        [id]: !prev[id]
    }));

    return (
        <div
            style={{
                margin: "0 auto",
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 10px #0001",
                padding: 20,
                overflowX: "auto",
                marginTop: 18
            }}
        >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Action</th>
                    <th style={thStyle}>Count</th>
                    <th style={thStyle}>Period</th>
                    <th style={thStyle}>Risk</th>
                    <th style={thStyle}>Mark</th>
                    <th style={thStyle}>Подробнее</th>
                </tr>
                </thead>
                <tbody>
                {logs.map(log => (
                    <>
                        <tr
                            key={log.id}
                            style={{
                                background: RISK_COLORS[log.risk_level] || "#f5f5f5",
                                fontWeight: log.risk_level === "critical" ? "bold" : "normal",
                                color: log.risk_level === "critical" ? "#b71c1c"
                                    : log.risk_level === "suspicious" ? "#f57c00"
                                        : "#222"
                            }}
                        >
                            <td style={tdStyle}>{log.user}</td>
                            <td style={tdStyle}>{log.action_type}</td>
                            <td style={tdStyle}>{log.actions_count}</td>
                            <td style={tdStyle}>
                                {new Date(log.start_time).toLocaleString()}<br />
                                {new Date(log.end_time).toLocaleString()}
                            </td>
                            <td style={{ ...tdStyle, textTransform: "capitalize" }}>{log.risk_level === "unknown" ? "n/a" : log.risk_level}</td>
                            <td style={tdStyle}>
                                {user?.role === 'admin' && (
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button style={btnCritical} onClick={() => handleRiskUpdate(log.id, 'critical')}>Critical</button>
                                        <button style={btnSuspicious} onClick={() => handleRiskUpdate(log.id, 'suspicious')}>Suspicious</button>
                                        <button style={btnNormal} onClick={() => handleRiskUpdate(log.id, 'normal')}>Normal</button>
                                    </div>
                                )}
                            </td>
                            <td style={tdStyle}>
                                <button
                                    style={{
                                        background: "#f1f8e9",
                                        color: "#388e3c",
                                        border: "none",
                                        borderRadius: 5,
                                        padding: "4px 10px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => toggleRow(log.id)}
                                >
                                    {openRows[log.id] ? "Скрыть" : "Подробнее"}
                                </button>
                            </td>
                        </tr>
                        {openRows[log.id] && (
                            <tr>
                                <td colSpan={7} style={{ background: "#f9fbe7", padding: 16 }}>
                                    <strong>Детализация действий:</strong>
                                    <table style={{ width: "100%", marginTop: 6, borderCollapse: "collapse" }}>
                                        <thead>
                                        <tr>
                                            <th style={thStyle}>Файл</th>
                                            <th style={thStyle}>Время</th>
                                            <th style={thStyle}>IP</th>
                                            <th style={thStyle}>Локация</th>
                                            <th style={thStyle}>Risk</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {log.actions.map(action => (
                                            <tr key={action.id}>
                                                <td style={tdStyle}>{action.file_name}</td>
                                                <td style={tdStyle}>{new Date(action.timestamp).toLocaleString()}</td>
                                                <td style={tdStyle}>{action.ip_address}</td>
                                                <td style={tdStyle}>{action.city}, {action.country}</td>
                                                <td style={tdStyle}>{action.risk_level}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        )}
                    </>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    background: "#f2f2fa",
    fontWeight: "bold",
    padding: 10,
    textAlign: "left",
    fontSize: 15,
    borderBottom: "2px solid #eee"
};
const tdStyle = {
    padding: "8px 8px",
    borderBottom: "1px solid #ececec",
    fontSize: 14
};
const btnNormal = {
    background: "#e0f2f1",
    color: "#00796b",
    border: "none",
    borderRadius: 5,
    padding: "4px 10px",
    cursor: "pointer"
};
const btnSuspicious = {
    background: "#fff8e1",
    color: "#ef6c00",
    border: "none",
    borderRadius: 5,
    padding: "4px 10px",
    cursor: "pointer"
};
const btnCritical = {
    background: "#ffcdd2",
    color: "#c62828",
    border: "none",
    borderRadius: 5,
    padding: "4px 10px",
    cursor: "pointer"
};
