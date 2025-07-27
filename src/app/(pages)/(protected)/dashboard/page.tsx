"use client";
import React, { useEffect, useState } from "react";
import BarraLateral from "@/app/components/barraLateral";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getNotasPeriodo, getRanking } from "@/services/dashboard";

interface Cliente {
  documento: string;
  nome_razao_social: string;
  qtd: number;
}

interface Note {
  data_emissao: string;
  status: string;
  valor_total: string;

}

interface MonthlyBarData {
  name: string;
  quantidade: number;
}

interface PieChartDataItem {
  name: string;
  value: number;
}

export default function Dashboard() {
  const [ranking, setRanking] = useState<Cliente[]>([]);
  const [authorizedNotesTotalValue, setAuthorizedNotesTotalValue] = useState<number>(0);
  const [monthlyNotesBarData, setMonthlyNotesBarData] = useState<MonthlyBarData[]>([]);
  const [pieChartStatusData, setPieChartStatusData] = useState<PieChartDataItem[]>([]);
  const MAX_TARGET_VALUE: number = 80000;

  useEffect(() => {
    handleNotas();
    handleRanking();
  }, []);

  const COLORS: string[] = ["#1a202c", "#60a5fa", "#34d399", "#a78bfa"];
  const COLORS_BAR_CHART: string[] = ["#a78bfa", "#34d399", "#1a202c", "#60a5fa", "#a78bfa", "#34d399", "#a78bfa", "#34d399", "#1a202c", "#60a5fa", "#a78bfa", "#34d399"];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const processNotesData = (notes: Note[]): { totalPayedValue: number; barChartData: MonthlyBarData[] } => {
    const currentYear: number = new Date().getFullYear();
    let totalPayedValue: number = 0;
    const monthlyCounts: { [key: string]: number } = {
      "Jan": 0, "Fev": 0, "Mar": 0, "Abr": 0, "Maio": 0, "Jun": 0,
      "Jul": 0, "Ago": 0, "Set": 0, "Out": 0, "Nov": 0, "Dez": 0
    };
    const monthNames: string[] = ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    if (notes && Array.isArray(notes)) {
      notes.forEach((note: Note) => {
        if (note.data_emissao && note.status) {
          const emissionDate = new Date(note.data_emissao);
          const noteYear: number = emissionDate.getFullYear();
          const noteMonthIndex: number = emissionDate.getMonth();
          console.log(note)
          if (note.status === 'paga' && noteYear === currentYear) {
            totalPayedValue += parseFloat(note.valor_total) || 0;
            if (monthNames[noteMonthIndex]) {
              monthlyCounts[monthNames[noteMonthIndex]]++;
            }
          }
        }
      });
    }

    const barChartData: MonthlyBarData[] = monthNames.map((month: string) => ({
      name: month,
      quantidade: monthlyCounts[month]
    }));
    console.log(totalPayedValue)
    return { totalPayedValue, barChartData };
  };


  async function handleRanking(): Promise<void> {
    try {
      const result: Cliente[] = await getRanking();
      setRanking(result);
    } catch (err: any) {
      console.error("Erro ao pegar ranking:", err);
    }
  }

  async function handleNotas(): Promise<void> {
    try {
      const result: Note[] = await getNotasPeriodo();
      const { totalPayedValue, barChartData } = processNotesData(result);
      const statusPieData = processStatusPieData(result);
      setAuthorizedNotesTotalValue(totalPayedValue);
      setMonthlyNotesBarData(barChartData);
      setPieChartStatusData(statusPieData);
    } catch (err: any) {
      console.error("Erro ao pegar notas:", err);
    }
  }

  const progressPercentage: number = (authorizedNotesTotalValue / MAX_TARGET_VALUE) * 100;


  const processStatusPieData = (notes: Note[]): PieChartDataItem[] => {
    const statusCounts: { [key: string]: number } = {
      "CANCELADA": 0,
      "PAGA": 0,
      "PENDENTE": 0,
    };

    let totalRelevantNotes = 0;

    if (notes && Array.isArray(notes)) {
      notes.forEach((note: Note) => {
        if (note.status) {
          const statusKey = note.status.toUpperCase();
          if (statusCounts.hasOwnProperty(statusKey)) {
            statusCounts[statusKey]++;
            totalRelevantNotes++;
          }
        }
      });
    }

    const pieData: PieChartDataItem[] = [];
    if (totalRelevantNotes > 0) {
      const orderedStatuses = ["CANCELADA", "PAGA", "PENDENTE"];
      orderedStatuses.forEach(status => {
        const count = statusCounts[status];
        const percentage = (count / totalRelevantNotes) * 100;
        let displayName = status;
        if (status === "CANCELADA") displayName = "Cancelada";
        else if (status === "PAGA") displayName = "Paga";
        else if (status === "PENDENTE") displayName = "Pendente";

        pieData.push({ name: displayName, value: parseFloat(percentage.toFixed(1)) });
      });
    } else {
      pieData.push({ name: "Cancelada", value: 0 });
      pieData.push({ name: "Paga", value: 0 });
      pieData.push({ name: "Pendente", value: 0 });
    }

    return pieData;
  };

  return (
    <div className="flex flex-row min-h-screen font-inter">
      <BarraLateral />

      <div className="flex-1 p-8 bg-[#f5f8fe] min-h-screen overflow-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mb-6">Veja gráficos e informações gerais sobre seu negócio</p>

        <div className="flex flex-col flex-1 lg:flex-row gap-6">
          <div className="flex flex-col flex-1 gap-6 flex-">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Notas autorizadas / Ano card */}
              <div className="bg-white shadow-md p-6 rounded-lg w-82">
                <p className="text-sm text-black font-bold mb-2">Gasto / Meta</p>
                <div className="bg-gray-200 h-2 rounded-full mb-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-black">
                  <span>{formatCurrency(authorizedNotesTotalValue)}</span>
                  <span>{formatCurrency(MAX_TARGET_VALUE)}</span>
                </div>
              </div>
              <div className="bg-white shadow-md p-6 rounded-lg w-64 ml-8">
                <p className="text-sm text-black font-bold mb-2">Valor a receber</p>
                <p className="text-2xl font-bold text-gray-800">R$ 0,00</p>
              </div>
            </div>

            {/* Ranking de clientes card */}
            <div className="bg-white w-82 shadow-md rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4 text-black">Ranking de clientes</h2>
              <table className="w-full text-sm text-black">
                <thead className="border-b border-gray-200 ">
                  <tr className='bg-gray-200'>
                    <th className="text-left py-1 px-1 rounded-l-md border-b border-gray-200">Nome</th>
                    <th className="text-right py-1 px-1 pl-4 rounded-r-md border-b border-gray-200">QTD</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((cliente: Cliente) => (
                    <tr key={cliente.documento} className="border-b border-gray-100 last:border-none">
                      <td className="py-3 pr-4">{cliente.nome_razao_social}</td>
                      <td className="py-3 pl-4 text-right">{cliente.qtd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 flex-1 lg:flex-[1.5] w-24">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Gráficos</h2>
            <div className="flex flex-col gap-8">
              {/* Donut chart section */}
              <div className="flex flex-col ">
                <h3 className=" font-normal mb-4 text-black text-lg">Tipos de notas emitidas</h3>
                <div className="flex items-center md:ml-32">
                  <div className="mr-8">
                    <PieChart width={200} height={200}>
                      <Pie
                        data={pieChartStatusData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={40}
                        paddingAngle={5}
                      >
                        {pieChartStatusData.map((_, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                  <ul className="text-sm md:w-64 h-32 space-y-1 text-left md:ml-20 mt-[-1rem] ">
                    {pieChartStatusData.map((item, index: number) => (
                      <li key={index} className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-medium text-gray-800 ml-1">{item.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bar chart section */}
              <div className="flex flex-col w-full">
                <h3 className="font-normal mb-4 text-black text-lg">Quantidade de notas por mês</h3>

                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyNotesBarData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} ticks={[0, 5, 10, 15]} />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar dataKey="quantidade" radius={[6, 6, 6, 6]} barSize={40}>
                      {
                        monthlyNotesBarData.map((entry, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS_BAR_CHART[index % COLORS_BAR_CHART.length]} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
