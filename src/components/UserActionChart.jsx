import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ACTION_TYPES = ['upload', 'download', 'delete', 'view'];
const ACTION_COLORS = {
    upload: "#1976d2",
    download: "#43a047",
    delete: "#e53935",
    view: "#ffb300"
};

export default function UserActionChart({ userStats }) {
    // userStats: [{ user__username, date, action_type, count }]
    const users = useMemo(() =>
            [...new Set(userStats.map(s => s.user__username))],
        [userStats]
    );

    const [query, setQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState('');

    // Фильтрация пользователей по поиску
    const filteredUsers = users.filter(username =>
        username.toLowerCase().includes(query.toLowerCase())
    );

    // Данные только по выбранному пользователю
    const dataByUser = userStats.filter(s => s.user__username === selectedUser);

    // Формируем по датам для графика
    const dates = [...new Set(dataByUser.map(s => s.date))].sort();
    const chartDataByDate = dates.map(date => {
        const dayStats = dataByUser.filter(s => s.date === date);
        const item = { date };
        ACTION_TYPES.forEach(type => {
            const found = dayStats.find(s => s.action_type === type);
            item[type] = found ? found.count : 0;
        });
        return item;
    });

    const chartData = {
        labels: chartDataByDate.map(item => item.date),
        datasets: ACTION_TYPES.map(type => ({
            label: type.charAt(0).toUpperCase() + type.slice(1),
            data: chartDataByDate.map(item => item[type]),
            borderColor: ACTION_COLORS[type],
            backgroundColor: ACTION_COLORS[type] + "44",
            fill: false,
            tension: 0.2,
            pointRadius: 3
        }))
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: selectedUser ? `Действия пользователя: ${selectedUser}` : 'Выберите пользователя' }
        },
        scales: {
            x: {
                type: 'time',
                time: { unit: 'day' },
                title: { display: true, text: 'Дата' }
            },
            y: {
                title: { display: true, text: 'Количество действий' },
                beginAtZero: true
            }
        }
    };

    return (
        <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px #0001",
            padding: 24,
            marginTop: 20,
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Поиск пользователя..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{
                        width: 220, marginRight: 12,
                        padding: 8, borderRadius: 6,
                        border: "1px solid #ccc"
                    }}
                />
                <select
                    value={selectedUser}
                    onChange={e => setSelectedUser(e.target.value)}
                    style={{ width: 220, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                >
                    <option value="">Выберите пользователя</option>
                    {filteredUsers.map(username =>
                        <option key={username} value={username}>{username}</option>
                    )}
                </select>
            </div>
            <div style={{ height: 260, minHeight: 200 }}>
                {selectedUser && chartData.labels.length > 0 ? (
                    <Line data={chartData} options={options} height={260} />
                ) : (
                    <div style={{ color: '#888', marginTop: 40 }}>
                        {selectedUser ? "Нет данных по этому пользователю." : "Выберите пользователя для отображения графика."}
                    </div>
                )}
            </div>
        </div>
    );
}
