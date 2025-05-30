import { useEffect, useState } from "react";
import API from "../api";

export default function GroupedActionsPage() {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        API.get("/grouped-actions/").then(res => setGroups(res.data));
    }, []);

    return (
        <div>
            <h2>🗂 Массовые действия пользователей (Grouped Logs)</h2>
            <table border="1" cellPadding={8}>
                <thead>
                <tr>
                    <th>Пользователь</th>
                    <th>Тип действия</th>
                    <th>Количество</th>
                    <th>Время (период)</th>
                    <th>Файлов у пользователя</th>
                    <th>Риск</th>
                    {/* <th>Подробнее</th> */}
                </tr>
                </thead>
                <tbody>
                {groups.map(g => (
                    <tr key={g.id}>
                        <td>{g.user}</td>
                        <td>{g.action_type}</td>
                        <td>{g.actions_count}</td>
                        <td>
                            {new Date(g.start_time).toLocaleString()} —<br/>
                            {new Date(g.end_time).toLocaleString()}
                        </td>
                        <td>{g.session_file_count}</td>
                        <td>{g.risk_level}</td>
                        {/* Можно добавить кнопку "Подробнее" для раскрытия вложенных логов */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
