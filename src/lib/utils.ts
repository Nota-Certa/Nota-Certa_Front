import { ItemNotaFiscal } from "@/utils/NotaFiscalPDF/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

export const formatCurrency = (e: string | number) => {
  let value;
  if (typeof e == "string") {
    value = parseFloat(e);
  } else {
    value = e;
  }
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function calcularTotais(itens: ItemNotaFiscal[]): {
  valorTotalDeItens: number;
  valorTotalDeImposto: number;
  valorTotalNota: number;
} {
  let valorTotalDeItens = 0;
  let valorTotalDeImposto = 0;

  for (const item of itens) {
    const quantidade = item.quantidade;
    const valorUnitario = parseFloat(item.valor_unitario);
    const valorItem = quantidade * valorUnitario;

    const { IPI, ICMS, PIS, COFINS } = item.impostos;
    const totalImpostosItem = IPI + ICMS + PIS + COFINS;

    valorTotalDeItens += valorItem;
    valorTotalDeImposto += totalImpostosItem;
  }

  const valorTotalNota = valorTotalDeItens + valorTotalDeImposto;

  return {
    valorTotalDeItens,
    valorTotalDeImposto,
    valorTotalNota,
  };
}
