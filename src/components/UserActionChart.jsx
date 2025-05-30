import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-date-fns";

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ACTION_TYPES = ["upload", "download", "delete", "view"];
const ACTION_COLORS = {
    upload: "#1976d2",
    download: "#43a047",
    delete: "#e53935",
    view: "#ffb300"
};

function UserSelect({ value, onChange, options }) {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger
                className="inline-flex items-center justify-between w-full sm:w-72 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
                <Select.Value placeholder="Выберите пользователя" />
                <Select.Icon>
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                </Select.Icon>
            </Select.Trigger>
            <Select.Content
                className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-auto"
            >
                <Select.Viewport className="bg-white dark:bg-neutral-900 rounded-lg">
                    {options.map(opt => (
                        <Select.Item
                            key={opt}
                            value={opt}
                            className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-neutral-700 text-gray-900 dark:text-gray-100 select-none"
                        >
                            <Select.ItemText>{opt}</Select.ItemText>
                        </Select.Item>
                    ))}
                </Select.Viewport>
            </Select.Content>
        </Select.Root>
    );
}

export default function UserActionChart({ userStats }) {
    const users = useMemo(
        () => [...new Set(userStats.map(s => s.user__username))],
        [userStats]
    );
    const [selectedUser, setSelectedUser] = useState("");

    const dataByUser = userStats.filter(s => s.user__username === selectedUser);

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
            fill: false,
            tension: 0.25
        }))
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: selectedUser ? `Действия пользователя: ${selectedUser}` : "Выберите пользователя" }
        },
        scales: {
            x: {
                type: "time",
                time: { unit: "day" },
                title: { display: true, text: "Дата" }
            },
            y: {
                title: { display: true, text: "Количество действий" },
                beginAtZero: true
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto w-full mb-8 p-4 rounded-2xl shadow-md bg-white dark:bg-neutral-900">
            <div className="mb-4">
                <UserSelect
                    value={selectedUser}
                    onChange={setSelectedUser}
                    options={users}
                />
            </div>
            <div className="mt-6">
                {selectedUser && chartData.labels.length > 0 ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <div className="text-neutral-500 dark:text-neutral-400 mt-10 text-center">
                        {selectedUser
                            ? "Нет данных по этому пользователю."
                            : "Выберите пользователя для отображения графика."}
                    </div>
                )}
            </div>
        </div>
    );
}
