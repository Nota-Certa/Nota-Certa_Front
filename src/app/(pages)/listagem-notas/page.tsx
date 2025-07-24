"use client";

import BarraLateral from "@/app/components/barraLateral";
import { Tabela } from "@/app/components/tabela";
import { useEffect, useState } from "react";
import { getNotas } from "@/services/auth";

export default function ListagemNotas() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotas()
      .then(setNotas)
      .catch(() => setNotas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-row">
      <BarraLateral />
      <div className="w-screen h-screen px-11 bg-[#F2F5FA]">
        <div className="flex flex-row py-12 justify-between items-center">
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-5xl font-bold">Invoices</h1>
            <p className="text-base font-normal">Veja suas notas e os status delas</p>
          </div>
          <div>barra de pesquisa</div>
        </div>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <Tabela notas={notas} />
        )}
      </div>
    </div>
  );
}