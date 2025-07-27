"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BarraLateral from "@/app/components/barraLateral";
import { ButtonComponent } from "@/app/components/buttonSubmitRF";
import { InputField } from "@/app/components/inputFieldRF";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { notaFiscalSchema } from "./validateSchema";
import { emitirNotaFiscal, getEmpresaDoUsuario, getNotasDaEmpresa, getPlanoDaEmpresa } from "@/services/auth";

export default function Gerenciar() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [podeEmitir, setPodeEmitir] = useState(true);
  const [mensagemLimite, setMensagemLimite] = useState("");

  const limitesPorPlano: Record<string, number> = {
    "9b1db36f-2d4f-4bb5-9e2a-5d6fc24bfa61": 10,
    "9e8fd341-d4fd-4e09-bf12-f88b34e0983b": 200,
    "7428e22e-89b5-4b1e-8cbf-4d2da8ad7d4f": 500,
  };

  function verificarLimite(notas: any[], planoId: string) {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    const emitidasNoMes = notas.filter((nota) => {
      const data = new Date(nota.data_emissao);
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    }).length;

    const limite = limitesPorPlano[planoId] ?? 0;
    return {
      podeEmitir: emitidasNoMes < limite,
      emitidasNoMes,
      limite,
    };
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setValue,
    reset,
    clearErrors,
  } = useForm({
    resolver: zodResolver(notaFiscalSchema),
    defaultValues: {
      empresa_id: "",
      tipo_pessoa: "F",
      itens: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens",
  });

  const verificarPermissao = async () => {
    try {
      const empresaId = await getEmpresaDoUsuario();
      setValue("empresa_id", empresaId);
      clearErrors("empresa_id");

      const [notas, planoId] = await Promise.all([
        getNotasDaEmpresa(empresaId),
        getPlanoDaEmpresa(empresaId),
      ]);

      const resultado = verificarLimite(notas, planoId);

      setPodeEmitir(resultado.podeEmitir);
      if (!resultado.podeEmitir) {
        setMensagemLimite(
          `Limite de notas atingido: ${resultado.emitidasNoMes}/${resultado.limite} neste mês.`
        );
      } else {
        setMensagemLimite("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao verificar permissões de emissão.");
    }
  };

  useEffect(() => {
    verificarPermissao();
  }, [setValue, clearErrors]);

  const onSubmit = async (data: any) => {
    if (!podeEmitir) {
      toast.warn("Você atingiu o limite de emissão para este mês.");
      return;
    }

    setIsSubmitting(true);

    try {
      await emitirNotaFiscal(data);
      toast.success("Nota emitida com sucesso!");
      await verificarPermissao();
      reset();
    } catch (err) {
      toast.error("Erro ao emitir nota fiscal.");
      console.error("Erro ao enviar nota:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <BarraLateral />
      <div className="px-11 bg-[#F2F5FA] flex-1 h-full">
        <div className="py-12">
          <h1 className="text-5xl font-bold">Emitir NF-e</h1>
        </div>
        {!podeEmitir && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
            <strong>Aviso:</strong> {mensagemLimite}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="pb-14">
          <div className="bg-white flex flex-col gap-6 p-12 rounded-b-lg shadow">
            <div className="flex gap-6">
              <div className="w-full">
                <label className="text-sm font-medium">Tipo Pessoa *</label>
                <select {...register("tipo_pessoa")} className="border p-2 w-full rounded">
                  <option value="F">Pessoa Física</option>
                  <option value="J">Pessoa Jurídica</option>
                </select>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-full">
                <InputField label="CPF ou CNPJ *" placeholder="Digite o documento" {...register("documento")} />
                {errors.documento && <span className="text-red-600 text-sm">{errors.documento.message}</span>}
              </div>
              <div className="w-full">
                <InputField label="Nome ou Razão Social *" placeholder="Nome/Razão Social" {...register("nome_razao_social")} />
                {errors.nome_razao_social && <span className="text-red-600 text-sm">{errors.nome_razao_social.message}</span>}
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-full">
                <InputField label="Data Emissão *" type="datetime-local" {...register("data_emissao")} />
                {errors.data_emissao && <span className="text-red-600 text-sm">{errors.data_emissao.message}</span>}
              </div>
              <div className="w-full">
                <InputField label="Data Vencimento *" type="datetime-local" {...register("data_vencimento")} />
                {errors.data_vencimento && <span className="text-red-600 text-sm">{errors.data_vencimento.message}</span>}
              </div>
            </div>

            <hr className="my-4" />
            <h3 className="text-lg font-semibold">Itens da Nota</h3>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-5 gap-4 items-start">
                <div>
                  <InputField
                    label="Descrição"
                    {...register(`itens.${index}.descricao`)}
                    onChange={() => clearErrors(`itens.${index}.descricao`)}
                  />
                  {errors.itens?.[index]?.descricao && (
                    <span className="text-red-600 text-sm">{errors.itens[index].descricao.message}</span>
                  )}
                </div>
                <div>
                  <InputField
                    label="Qtd"
                    type="number"
                    min={0}
                    {...register(`itens.${index}.quantidade`, { valueAsNumber: true })}
                    onChange={() => clearErrors(`itens.${index}.quantidade`)}
                  />
                  {errors.itens?.[index]?.quantidade && (
                    <span className="text-red-600 text-sm">{errors.itens[index].quantidade.message}</span>
                  )}
                </div>
                <div>
                  <InputField
                    label="Valor Unitário"
                    type="number"
                    step="0.01"
                    {...register(`itens.${index}.valor_unitario`, { valueAsNumber: true })}
                    onChange={() => clearErrors(`itens.${index}.valor_unitario`)}
                  />
                  {errors.itens?.[index]?.valor_unitario && (
                    <span className="text-red-600 text-sm">{errors.itens[index].valor_unitario.message}</span>
                  )}
                </div>
                <div>
                  <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-2">
                      <InputField
                        label="ICMS"
                        type="number"
                        step="0.01"
                        min={0}

                        {...register(`itens.${index}.impostos.ICMS`, { valueAsNumber: true })}
                      />
                      <InputField
                        label="IPI"
                        type="number"
                        step="0.01"
                        min={0}

                        {...register(`itens.${index}.impostos.IPI`, { valueAsNumber: true })}
                      />
                      <InputField
                        label="PIS"
                        type="number"
                        step="0.01"
                        min={0}
                        {...register(`itens.${index}.impostos.PIS`, { valueAsNumber: true })}
                      />
                      <InputField
                        label="COFINS"
                        type="number"
                        step="0.01"
                        min={0}

                        {...register(`itens.${index}.impostos.COFINS`, { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-4 py-2 rounded w-fit">Remover</button>
              </div>
            ))}

            {typeof errors.itens?.message === "string" && (
              <span className="text-red-600 text-sm">{errors.itens.message}</span>
            )}

            <button
              type="button"
              onClick={() =>
                append({
                  descricao: "",
                  quantidade: 1,
                  valor_unitario: 0,
                  impostos: {
                    ICMS: 0,
                    IPI: 0,
                    PIS: 0,
                    COFINS: 0,
                  },
                })
              }
              className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
            >
            Adicionar Item
            </button>

            <div className="flex justify-end">
              <ButtonComponent
                azul={true}
                label={isSubmitting ? "Enviando..." : "Emitir Nota"}
                type="submit"
                disabled={isSubmitting || !podeEmitir}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
