import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import API from "../api.js";

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
        <table>
            <thead>
            <tr>
                <th>User</th>
                <th>Action</th>
                <th>Count</th>
                <th>Period</th>
                <th>Risk</th>
                <th>Mark</th>
                <th>Подробнее</th>
            </tr>
            </thead>
            <tbody>
            {logs.map(log => (
                <React.Fragment key={log.id}>
                    <tr>
                        <td>{log.user}</td>
                        <td>{log.action_type}</td>
                        <td>{log.actions_count}</td>
                        <td>
                            {new Date(log.start_time).toLocaleString()}<br />
                            {new Date(log.end_time).toLocaleString()}
                        </td>
                        <td>{log.risk_level}</td>
                        <td>
                            {user?.role === 'admin' && (
                                <>
                                    <button onClick={() => handleRiskUpdate(log.id, 'critical')}>Critical</button>
                                    <button onClick={() => handleRiskUpdate(log.id, 'suspicious')}>Suspicious</button>
                                    <button onClick={() => handleRiskUpdate(log.id, 'normal')}>Normal</button>
                                </>
                            )}
                        </td>
                        <td>
                            <button onClick={() => toggleRow(log.id)}>
                                {openRows[log.id] ? "Скрыть" : "Подробнее"}
                            </button>
                        </td>
                    </tr>
                    {openRows[log.id] && (
                        <tr>
                            <td colSpan={7}>
                                <strong>Детализация действий:</strong>
                                <table style={{ width: "100%", marginTop: 6 }}>
                                    <thead>
                                    <tr>
                                        <th>Файл</th>
                                        <th>Время</th>
                                        <th>IP</th>
                                        <th>Локация</th>
                                        <th>Risk</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {log.actions.map(action => (
                                        <tr key={action.id}>
                                            <td>{action.file_name}</td>
                                            <td>{new Date(action.timestamp).toLocaleString()}</td>
                                            <td>{action.ip_address}</td>
                                            <td>{action.city}, {action.country}</td>
                                            <td>{action.risk_level}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            ))}
            </tbody>
        </table>
    );
}
