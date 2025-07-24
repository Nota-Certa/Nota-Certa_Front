'use client'
import React from 'react';
import BarraLateral from "@/app/components/barraLateral";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard() {

    const pieData = [
        { name: 'NFC-e', value: 52.1 },
        { name: 'NF-e', value: 22.8 },
        { name: 'CT-e', value: 13.9 },
        { name: 'MDF-e', value: 11.2 },
    ];

    const barData = [
        { name: 'Jan', quantidade: 120 },
        { name: 'Fev', quantidade: 290 },
        { name: 'Mar', quantidade: 250 },
        { name: 'Abr', quantidade: 330 },
        { name: 'Maio', quantidade: 100 },
        { name: 'Jun', quantidade: 260 },
    ];

    const COLORS = ['#1a202c', '#60a5fa', '#34d399', '#a78bfa'];
    const COLORS_BAR_CHART = ['#a78bfa', '#34d399', '#1a202c', '#60a5fa', '#a78bfa', '#34d399'];

    return (
        <div className="flex flex-row min-h-screen font-inter">

            <BarraLateral />

            <div className="flex-1 p-8 bg-[#f5f8fe] min-h-screen overflow-auto">

                <h1 className="text-4xl font-bold mb-2 text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mb-6">Veja gráficos e informações gerais sobre seu negócio</p>

                <div className="flex flex-col flex-1 lg:flex-row gap-6">

                    <div className="flex flex-col flex-1 gap-6 flex-">

                        <div className="flex flex-col sm:flex-row gap-4">

                            <div className="bg-white shadow-md p-6 rounded-lg w-82">
                                <p className="text-sm text-black font-bold mb-2">Notas autorizadas / Ano</p>
                                <div className="bg-gray-200 h-2 rounded-full mb-1">
                                    <div className="bg-blue-600 h-2 rounded-full w-[18%]" />
                                </div>
                                <div className="flex justify-between text-sm text-black">
                                    <span>R$ 15.000,00</span>
                                    <span>R$ 80.000,00</span>
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
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <tr key={i} className="border-b border-gray-100 last:border-none">
                                            <td className="py-3 pr-4">Recibom</td>
                                            <td className="py-3 pl-4 text-right">150</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex-1 lg:flex-[1.5]">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Gráficos</h2>
                        <div className="flex flex-col gap-8">
                            {/* Donut chart section */}
                            <div className="flex flex-col ">
                                <h3 className=" font-normal mb-4  text-black text-lg">Tipos de notas emitidas</h3>
                                <div className="flex items-center md:ml-32">
                                    <div className="mr-8">
                                        <PieChart width={200} height={200}>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                innerRadius={40}
                                                paddingAngle={5}
                                            >
                                                {pieData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </div>
                                    <ul className="text-sm md:w-64 h-32 space-y-1 text-left  md:ml-20 mt-[-1rem]">
                                        {pieData.map((item, index) => (
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

                                <BarChart width={600} height={300} data={barData} className='md:ml-32'>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} ticks={[0, 85, 170, 255, 340]} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="quantidade" radius={[6, 6, 6, 6]} barSize={40}>
                                        {
                                            barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS_BAR_CHART[index % COLORS_BAR_CHART.length]} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
