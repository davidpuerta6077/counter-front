'use client'

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ApiResponse = {
  id: number;
  date_time: string;
  costumer_code: string;
};

interface BarChartProps {
  data: ApiResponse[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("");

  // Filtrar por fecha y hora seleccionada
  const filteredData = data.filter((item) => {
    const date = item.date_time.slice(0, 10);
    const hour = item.date_time.slice(11, 13);
    const matchDate = selectedDate ? date === selectedDate : true;
    const matchHour = selectedHour ? hour === selectedHour : true;
    return matchDate && matchHour;
  });

  // Agrupar por fecha y hora legible para la gráfica
  const countsByDateHour: { [dateHour: string]: number } = {};
  filteredData.forEach((item) => {
    const dateObj = new Date(item.date_time);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const hour = dateObj.getHours().toString().padStart(2, "0");
    const label = `${year}-${month}-${day} ${hour}:00`;
    countsByDateHour[label] = (countsByDateHour[label] || 0) + 1;
  });

  const sortedLabels = Object.keys(countsByDateHour).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const chartData = {
    labels: sortedLabels,
    datasets: [
      {
        label: "Conteos por hora",
        data: sortedLabels.map((label) => countsByDateHour[label]),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el contenedor defina la altura
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Conteos por hora" },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: "Fecha y Hora" },
        ticks: { autoSkip: false, maxRotation: 90, minRotation: 45 },
      },
      y: {
        title: { display: true, text: "Cantidad" },
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div>
          <label className="mr-2">Filtrar por fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="mr-2">Filtrar por hora:</label>
          <select
            value={selectedHour}
            onChange={(e) => setSelectedHour(e.target.value)}
            className="border px-2 py-1 rounded text-black bg-white"
          >
            <option value="">Todas</option>
            {[...Array(24).keys()].map((h) => (
              <option key={h} value={h.toString().padStart(2, "0")}>
                {h.toString().padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full" style={{ minHeight: 350, height: "50vw", maxHeight: 500 }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarChart;