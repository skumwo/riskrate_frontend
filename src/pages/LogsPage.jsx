import { useEffect, useState } from "react";
import API from "../api.js";
import LogTable from "../components/LogTable.jsx";
import ActionChart from "../components/ActionChart.jsx";
import { toast } from 'react-toastify';
import GroupedLogTable from "../components/GroupedLogTable.jsx";
import UserActionChart from "../components/UserActionChart.jsx";

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState("");
    const [stats, setStats] = useState([]);
    const [shownAlertIds, setShownAlertIds] = useState(new Set());
    const [groupedLogs, setGroupedLogs] = useState([]);
    const [userStats, setUserStats] = useState([]);

    useEffect(() => {
        API.get("/logs/").then(res => setLogs(res.data));
        API.get("/grouped-actions/").then(res => setGroupedLogs(res.data));
        API.get("/logs/stats/").then(res => setStats(res.data));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        API.get("/logs/user-activity/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setUserStats(res.data);
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            API.get("/logs/alerts/").then(res => {
                const newLogs = res.data.filter(log => !shownAlertIds.has(log.id));

                if (newLogs.length > 0) {
                    newLogs.forEach(log => {
                        if (log.type === 'single') {
                            toast.warning(
                                `⚠️ Подозрительное действие: ${log.user} → ${log.action} ${log.file} [${log.risk}]`, {
                                    position: "top-right",
                                    autoClose: false,
                                });
                        } else if (log.type === 'group') {
                            toast.error(
                                `🚨 Массовое подозрительное действие: ${log.user} (${log.action} ×${log.count}) [${log.risk}]`, {
                                    position: "top-right",
                                    autoClose: false,
                                });
                        }
                    });

                    setShownAlertIds(prev => new Set([...prev, ...newLogs.map(log => log.id)]));
                }
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [shownAlertIds]);

    const retrainModel = async () => {
        if (!confirm("Ты точно хочешь переобучить модель?")) return;
        try {
            await API.post('/ml/retrain/');
            alert("Модель успешно дообучена.");
            window.location.reload();
        } catch (err) {
            alert("Ошибка при обучении модели.");
        }
    };

    const filteredLogs = logs.filter(log => !filter || log.risk_level === filter);
    const filteredGroupedLogs = groupedLogs.filter(log => !filter || log.risk_level === filter);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#f7f7fa',
                fontFamily: 'Segoe UI, sans-serif'
            }}
        >
            <h2 style={{ textAlign: 'center', marginTop: 32, marginBottom: 16, fontSize: 32 }}>
                Журнал действий пользователей (админ)
            </h2>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: 32,            // расстояние между графиками
                    width: '100%',
                    marginBottom: 20,
                    flexWrap: 'wrap'    // чтобы на маленьких экранах переносились вниз
                }}
            >
                <div style={{ flex: 1, minWidth: 350, maxWidth: 600 }}>
                    <ActionChart data={stats} height={260} width={600} />
                </div>
                <div style={{ flex: 1, minWidth: 350, maxWidth: 600 }}>
                    <UserActionChart userStats={userStats} />
                </div>
            </div>


            <div style={{ marginBottom: 24 }}>
                <button
                    onClick={retrainModel}
                    style={{
                        marginRight: 10,
                        padding: '8px 20px',
                        background: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer'
                    }}
                >
                    Обучить модель
                </button>
                <select
                    onChange={e => setFilter(e.target.value)}
                    value={filter}
                    style={{
                        marginLeft: 10,
                        padding: 8,
                        borderRadius: 6,
                        border: '1px solid #ccc',
                        background: '#fff'
                    }}
                >
                    <option value="">Все уровни риска</option>
                    <option value="normal">Normal</option>
                    <option value="suspicious">Suspicious</option>
                    <option value="critical">Critical</option>
                </select>
            </div>

            <h3 style={{marginTop: 25, textAlign: 'center', fontSize: 24}}>Групповые логи (массовые действия)</h3>
            <div style={{ width: '98%', maxWidth: 1200, margin: '0 auto' }}>
                <GroupedLogTable logs={filteredGroupedLogs} />
            </div>

            <h3 style={{marginTop: 30, textAlign: 'center', fontSize: 24}}>Обычные логи (единичные действия)</h3>
            <div style={{ width: '98%', maxWidth: 1200, margin: '0 auto', marginBottom: 32 }}>
                <LogTable logs={filteredLogs} hideRiskActions />
            </div>
        </div>
    );
}
