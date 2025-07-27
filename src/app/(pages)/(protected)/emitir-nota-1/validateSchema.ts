import { z } from "zod";

const isValidDate = (value: string) => !isNaN(new Date(value).getTime());

const itemSchema = z.object({
  descricao: z.string().min(1, "Descrição obrigatória"),
  quantidade: z.coerce.number().min(1, "Quantidade mínima é 1"),
  valor_unitario: z.coerce.number().min(0, "Valor não pode ser negativo"),
  impostos: z
    .object({
      ICMS: z.coerce.number().nonnegative().optional(),
      IPI: z.coerce.number().nonnegative().optional(),
      PIS: z.coerce.number().nonnegative().optional(),
      COFINS: z.coerce.number().nonnegative().optional(),
    })
    .partial()
    .optional()
});

export const notaFiscalSchema = z.object({
  empresa_id: z.uuid({ message: "ID inválido" }),
  tipo_pessoa: z.enum(["F", "J"]),
  documento: z.string().min(11, "Mínimo 11 dígitos").max(14, "Máximo 14 dígitos"),
  nome_razao_social: z.string().min(1, "Obrigatório"),
  data_emissao: z.string().refine(isValidDate, { message: "Data inválida" }),
  data_vencimento: z.string().refine(isValidDate, { message: "Data inválida" }),
  itens: z.array(itemSchema).min(1, "Adicione pelo menos um item"),
});