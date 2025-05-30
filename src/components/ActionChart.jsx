import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ActionChart({ data }) {
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Actions per Day',
                data: data.map(item => item.total),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.2
            }
        ]
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Actions'
                }
            }
        }
    };

    return <Line data={chartData} options={options} />;
}
