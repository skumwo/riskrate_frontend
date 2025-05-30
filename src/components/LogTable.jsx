import API from "../api.js";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

const RISK_COLORS = {
    normal: "#e0f7fa",
    suspicious: "#fffde7",
    critical: "#ffebee",
    unknown: "#f5f5f5"
};

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
                    <th style={thStyle}>File</th>
                    <th style={thStyle}>Time</th>
                    <th style={thStyle}>IP</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>Risk</th>
                    <th style={thStyle}>Mark</th>
                </tr>
                </thead>
                <tbody>
                {logs.map(log => (
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
                        <td style={tdStyle}>{log.username}</td>
                        <td style={tdStyle}>{log.action_type}</td>
                        <td style={tdStyle}>{log.file_name}</td>
                        <td style={tdStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                        <td style={tdStyle}>{log.ip_address}</td>
                        <td style={tdStyle}>{log.city}, {log.country}</td>
                        <td style={{ ...tdStyle, textTransform: "capitalize" }}>
                            {log.risk_level === "unknown" ? "n/a" : log.risk_level}
                        </td>
                        <td style={tdStyle}>
                            {user?.role === 'admin' && !hideRiskActions && log.risk_level !== "unknown" && (
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button style={btnCritical} onClick={() => handleRiskUpdate(log.id, 'critical')}>Critical</button>
                                    <button style={btnSuspicious} onClick={() => handleRiskUpdate(log.id, 'suspicious')}>Suspicious</button>
                                    <button style={btnNormal} onClick={() => handleRiskUpdate(log.id, 'normal')}>Normal</button>
                                </div>
                            )}
                        </td>
                    </tr>
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
