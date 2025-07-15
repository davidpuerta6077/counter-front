'use client'

import React, { useState, useEffect } from "react";
import getService from "./services/getService";
import BarChart from "./components/charts/BarChart";

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

export default function Home() {
  const [data, setData] = useState<ApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getService(
          "https://counter-back-866144374490.us-central1.run.app/counter/list_count/crt001"
        );
        setData(result);
      } catch (err: any) {
        setError("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="p-8 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gráfica de Conteos</h1>
      <br />
      {loading && <p>Cargando datos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <BarChart data={data} />}
      <br />
      <hr />
      <br />
        <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => setShowCompare((prev) => !prev)}
      >
        {showCompare ? "Cerrar comparativo" : "Comparar"}
      </button>

      {showCompare && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Gráfica Comparativa</h2>
          <br />
          <BarChart data={data} />
        </div>
      )}
    </div>
  );
  } 