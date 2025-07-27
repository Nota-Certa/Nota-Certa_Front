import { z } from "zod";

export const cadastroSchema = z.object({
  nome: z.string().min(1, "Nome completo é obrigatório"),
  empresa: z.string().min(1, "Nome da empresa é obrigatório"),
  telefone: z.string().min(8, "Telefone é obrigatório"),
  email: z.email("E-mail inválido"),
  cnpj: z.string()
    .length(14, "CNPJ deve conter exatamente 14 dígitos")
    .regex(/^\d+$/, "CNPJ deve conter apenas números"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});
