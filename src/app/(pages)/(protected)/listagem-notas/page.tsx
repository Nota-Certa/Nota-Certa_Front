"use client";

import BarraLateral from "@/app/components/barraLateral";
import { Tabela, NotaAPI } from "@/app/components/tabela";
import { useEffect, useState } from "react";
import { getNotasDoUsuario } from "@/services/auth";
import Busca from "@/app/components/busca";

export default function ListagemNotas() {
  const [notas, setNotas] = useState<NotaAPI[]>([]);
  const [notasFiltradas, setNotasFiltradas] = useState<NotaAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    getNotasDoUsuario()
      .then((data) => {
        setNotas(data);
        setNotasFiltradas(data);
      })
      .catch(() => {
        setNotas([]);
        setNotasFiltradas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!termoBusca.trim()) {
      setNotasFiltradas(notas);
    } else {
      const notasFiltered = notas.filter((nota: NotaAPI) => {
        const termoBuscaLower = termoBusca.toLowerCase();
        return Object.values(nota).some((valor) => {
          if (valor == null) return false;
          return String(valor).toLowerCase().includes(termoBuscaLower);
        });
      });
      setNotasFiltradas(notasFiltered);
    }
  }, [termoBusca, notas]);

  const handleBusca = (termo: string) => {
    setTermoBusca(termo);
  };

  return (
    <div className="flex flex-row">
      <BarraLateral />
      <div className="w-screen h-screen px-11 bg-[#F2F5FA]">
        <div className="flex flex-row py-12 justify-between items-center">
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-5xl font-bold">Invoices</h1>
            <p className="text-base font-normal">Veja suas notas e os status delas</p>
          </div>
          <Busca onBusca={handleBusca} />
        </div>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <>
            {termoBusca && (
              <div className="mb-4 text-sm text-gray-600">
                {notasFiltradas.length} resultado(s) encontrado(s) para &quot;{termoBusca}&quot;
              </div>
            )}
            <Tabela
              notas={notasFiltradas}
              onStatusChange={(id, novoStatus) => {
                setNotas((prev) =>
                  prev.map((n) =>
                    n.id === id ? { ...n, status: novoStatus } : n
                  )
                );
              }}
            />          </>
        )}
      </div>
    </div>
  );
}
