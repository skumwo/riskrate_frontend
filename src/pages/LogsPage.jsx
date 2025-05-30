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
            console.log("userStats:", res.data);
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
        <div>
            <h2>Журнал действий пользователей (админ)</h2>

            <div style={{ width: 600, marginBottom: 20 }}>
                <ActionChart data={stats} height={250} width={600} />
                <UserActionChart userStats={userStats} />
            </div>

            <button onClick={retrainModel}>Обучить модель</button>
            <select onChange={e => setFilter(e.target.value)} value={filter} style={{marginLeft:10}}>
                <option value="">Все уровни риска</option>
                <option value="normal">Normal</option>
                <option value="suspicious">Suspicious</option>
                <option value="critical">Critical</option>
            </select>

            <h3 style={{marginTop: 25}}>Групповые логи (массовые действия)</h3>
            <GroupedLogTable logs={filteredGroupedLogs} />

            <h3 style={{marginTop: 30}}>Обычные логи (единичные действия)</h3>
            <LogTable logs={filteredLogs} hideRiskActions />

        </div>
    );
}
