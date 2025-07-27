"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { atualizarStatusNota } from "@/services/auth";

// Tipo da nota conforme o backend
export type NotaAPI = {
  id: string;
  empresa_id: string;
  documento: string;
  tipo_pessoa: string;
  nome_razao_social: string;
  status: string;
  data_emissao: string;
  data_vencimento: string;
  itens: {
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    impostos: {
      ICMS?: number;
      ISS?: number;
      PIS?: number;
      COFINS?: number;
      IPI?: number;
    };
  }[];
};

type NotaTabela = {
  id: string;
  documento: string;
  dataEmissao: string;
  dataVencimento: string;
  descricao: string;
  valor: string;
  impostos: string;
  prestador: string;
  tipoPrestador: string;
  status: string;
};

function formatarData(dataISO: string) {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR");
}

function calcularValorTotal(itens: NotaAPI["itens"]) {
  return itens.reduce((total, item) => total + item.valor_unitario * item.quantidade, 0).toFixed(2);
}

function calcularImpostoTotal(itens: NotaAPI["itens"]) {
  return itens.reduce((total, item) => {
    const impostos = item.impostos;
    const somaImpostos =
      (impostos.ICMS || 0) +
      (impostos.ISS || 0) +
      (impostos.PIS || 0) +
      (impostos.COFINS || 0) +
      (impostos.IPI || 0);

    return total + somaImpostos;
  }, 0).toFixed(2);
}

function montarDescricao(itens: NotaAPI["itens"]) {
  if (itens.length === 1) return itens[0].descricao;
  return itens.map(item => item.descricao).join(", ");
}

export function Tabela({
  notas,
  onStatusChange,
}: {
  notas: NotaAPI[];
  onStatusChange?: (id: string, novoStatus: string) => void;
}) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;
  const totalPaginas = Math.ceil(notas.length / itensPorPagina);

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const notasPagina = notas.slice(indiceInicial, indiceFinal);

  // Mapeia as notas do backend para o formato da tabela
  const notasTabela: NotaTabela[] = notasPagina.map((nota) => ({
    id: nota.id,
    documento: nota.documento,
    dataEmissao: formatarData(nota.data_emissao),
    dataVencimento: formatarData(nota.data_vencimento),
    descricao: montarDescricao(nota.itens),
    valor: calcularValorTotal(nota.itens),
    impostos: calcularImpostoTotal(nota.itens),
    prestador: nota.nome_razao_social,
    tipoPrestador: nota.tipo_pessoa,
    status: nota.status,
  }));

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">CPF/CNPJ</TableHead>
            <TableHead>Data de emissão</TableHead>
            <TableHead>Data de vencimento</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Impostos</TableHead>
            <TableHead>Nome/Razão Social</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notasTabela.map((nota) => (
            <TableRow key={nota.id}>
              <TableCell className="font-medium">{nota.documento}</TableCell>
              <TableCell>{nota.dataEmissao}</TableCell>
              <TableCell>{nota.dataVencimento}</TableCell>
              <TableCell>{nota.descricao}</TableCell>
              <TableCell>R$ {nota.valor}</TableCell>
              <TableCell>R$ {nota.impostos}</TableCell>
              <TableCell>{nota.prestador}</TableCell>
              <TableCell>{nota.tipoPrestador}</TableCell>
              <TableCell>
                <select
                  value={nota.status}
                  onChange={async (e) => {
                    const novoStatus = e.target.value;
                    try {
                      await atualizarStatusNota(nota.id, novoStatus);
                      if (onStatusChange) {
                        onStatusChange(nota.id, novoStatus);
                      }
                    } catch (err) {
                      alert("Erro ao atualizar status.");
                    }
                  }}
                  className={`py-2 px-3 rounded-xl text-white font-semibold w-fit cursor-pointer ${
                    nota.status === "paga"
                      ? "bg-[#37912B]"
                      : nota.status === "cancelada"
                        ? "bg-[#CE5454]"
                        : nota.status === "pendente"
                          ? "bg-[#e7c54a]"
                          : "bg-[#696969]"
                  }`}
                >
                  <option value="pendente">pendente</option>
                  <option value="paga">paga</option>
                  <option value="cancelada">cancelada</option>
                </select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
      {/* Paginação */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => mudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          className="px-3 py-1 rounded disabled:opacity-50 border"
        >
          Anterior
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => mudarPagina(i + 1)}
            className={`px-3 py-1 rounded border ${paginaAtual === i + 1 ? "bg-[#2B448E] text-white" : "bg-white text-black"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => mudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
          className="px-3 py-1 rounded disabled:opacity-50 border"
        >
          Próximo
        </button>
      </div>
    </>
  );
}
