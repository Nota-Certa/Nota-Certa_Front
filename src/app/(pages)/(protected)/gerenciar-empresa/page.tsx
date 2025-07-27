"use client";

import BarraLateral from "@/app/components/barraLateral";
import { ButtonComponent } from "@/app/components/button";
import { InputField } from "@/app/components/inputField";
import { getEmpresaDoUsuario, cadastroFuncionario, editarEmpresa, getAssinaturasByEmpresaId, checkEmployeeLimit } from "@/services/auth";
import { useEffect, useState } from "react";

interface Assinatura {
  id: string;
  empresa_id: string;
  plano_id: string;
  inicio: string;
  fim: string;
  ativo: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

export default function Gerenciar() {
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [nomeFuncionario, setNomeFuncionario] = useState<string>("");
  const [emailFuncionario, setEmailFuncionario] = useState<string>("");
  const [senhaFuncionario, setSenhaFuncionario] = useState<string>("");
  const [nomeEmpresa, setNomeEmpresa] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [assinaturaAtiva, setAssinaturaAtiva] = useState<Assinatura | null>(null);
  const [loadingAssinatura, setLoadingAssinatura] = useState(true);
  const [erroAssinatura, setErroAssinatura] = useState<string | null>(null);
  const [canAddEmployee, setCanAddEmployee] = useState(true);
  const [employeeLimitMessage, setEmployeeLimitMessage] = useState<string>("");
  const [currentEmployeeCount, setCurrentEmployeeCount] = useState<number>(0);
  const [maxAllowedEmployees, setMaxAllowedEmployees] = useState<number>(0);
  const [loadingEmployeeLimit, setLoadingEmployeeLimit] = useState(true);

  useEffect(() => {
    const carregarDadosDaEmpresa = async () => {
      try {
        const id = await getEmpresaDoUsuario();
        setEmpresaId(id);

        if (id) {
          // Carregar informações da assinatura
          try {
            const assinaturas = await getAssinaturasByEmpresaId(id);
            if (assinaturas.length > 0) {
              setAssinaturaAtiva(assinaturas[0]);
            } else {
              setAssinaturaAtiva(null);
            }
          } catch (err) {
            console.error("Erro ao carregar assinaturas:", err);
            setErroAssinatura("Não foi possível carregar as informações da assinatura.");
          } finally {
            setLoadingAssinatura(false);
          }

          // Verificar o limite de funcionários
          try {
            const { canAdd, currentCount, maxAllowed, message } = await checkEmployeeLimit(id);
            setCanAddEmployee(canAdd);
            setCurrentEmployeeCount(currentCount);
            setMaxAllowedEmployees(maxAllowed);
            setEmployeeLimitMessage(message);
          } catch (err) {
            console.error("Erro ao verificar o limite de funcionários:", err);
            setEmployeeLimitMessage("Erro ao verificar o limite de funcionários.");
            setCanAddEmployee(false); // Assume que não pode adicionar em caso de erro
          } finally {
            setLoadingEmployeeLimit(false);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar ID da Empresa:", error);
        setErroAssinatura("Não foi possível carregar o ID da empresa.");
        setLoadingAssinatura(false);
        setLoadingEmployeeLimit(false);
      }
    };

    carregarDadosDaEmpresa();
  }, [empresaId]);

  const handleCadastroFuncionario = async () => {
    if (!empresaId) {
      alert("ID da empresa não disponível. Tente novamente mais tarde.");
      return;
    }

    if (!nomeFuncionario || !emailFuncionario || !senhaFuncionario) {
      alert("Por favor, preencha todos os campos do funcionário.");
      return;
    }

    // Verifica o limite de funcionários antes de cadastrar
    if (!canAddEmployee) {
      alert(`Não é possível cadastrar o funcionário. ${employeeLimitMessage}`);
      return;
    }

    try {
      await cadastroFuncionario(
        empresaId,
        nomeFuncionario,
        emailFuncionario,
        senhaFuncionario,
      );
      alert("Funcionário cadastrado com sucesso!");
      setNomeFuncionario("");
      setEmailFuncionario("");
      setSenhaFuncionario("");
      // Recarrega os dados para atualizar a contagem de funcionários e a mensagem de limite
      const { canAdd, currentCount, maxAllowed, message } = await checkEmployeeLimit(empresaId);
      setCanAddEmployee(canAdd);
      setCurrentEmployeeCount(currentCount);
      setMaxAllowedEmployees(maxAllowed);
      setEmployeeLimitMessage(message);
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);

      let errorMessage = "Erro desconhecido ao cadastrar funcionário.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert(`Falha ao cadastrar funcionário: ${errorMessage}`);
    }
  };

  const handleEdicaoEmpresa = async () => {
    if (!empresaId) {
      alert("ID da empresa não disponível. Tente novamente mais tarde.");
      return;
    }

    if (!nomeEmpresa || !cnpj) {
      alert("Por favor, preencha todos os campos da empresa.");
      return;
    }

    try {
      await editarEmpresa(
        empresaId,
        nomeEmpresa,
        cnpj,
      );
      alert("Dados da empresa editados com sucesso!");
      setNomeEmpresa("");
      setCnpj("");
    } catch (error) {
      console.error("Erro ao editar dados da empresa:", error);

      let errorMessage = "Erro desconhecido ao editar dados da empresa.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert(`Falha ao editar dados da empresa: ${errorMessage}`);
    }
  };

  function nomePlano(planoId: string | undefined): string{
    if (!planoId) return "Não disponível";
    if(planoId == "9b1db36f-2d4f-4bb5-9e2a-5d6fc24bfa61"){
      return "Freemium";
    } else if(planoId == "9e8fd341-d4fd-4e09-bf12-f88b34e0983b"){
      return "Básico";
    }else{
      return "Premium";
    }
  }

  return (
    <div className="flex flex-row">
      <BarraLateral></BarraLateral>
      <div className="px-11 bg-[#F2F5FA] w-screen">
        <div className="py-10">
          <h1 className="text-5xl font-bold">Gerenciamento da empresa</h1>
          <p className="text-base font-normal">Edite informações e adicione funcionários</p>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Sua assinatura ativa</h2>
          <a href="/assinatura">
            <div className="font-bold rounded-lg py-1 px-4 border-secondary-blue border-2 w-fit">
              {loadingAssinatura ? (
                <p>Carregando informações da assinatura...</p>
              ) : erroAssinatura ? (
                <p className="text-red-600">{erroAssinatura}</p>
              ) : assinaturaAtiva ? (
                <p className="text-lg">Plano: <span className="font-semibold">{nomePlano(assinaturaAtiva.plano_id)}</span></p>
              ) : (
                <p>Nenhuma assinatura ativa encontrada para sua empresa.</p>
              )}
            </div>
          </a>
          <h2 className="text-4xl font-bold mb-4 mt-10">Adicionar funcionários</h2>
          <div className="flex flex-col gap-6 bg-white p-12 rounded-lg">
            <div className="flex flex-row gap-8">
              <InputField
                label="Nome completo"
                placeholder="Nome completo"
                type={"text"}
                value={nomeFuncionario}
                onChange={(e) => setNomeFuncionario(e.target.value)}
              ></InputField>
              <InputField
                label="E-mail"
                placeholder="E-mail"
                type={"email"}
                value={emailFuncionario}
                onChange={(e) => setEmailFuncionario(e.target.value)}
              ></InputField>
              <InputField
                label="Senha"
                placeholder="Senha"
                type={"password"}
                value={senhaFuncionario}
                onChange={(e) => setSenhaFuncionario(e.target.value)}
              ></InputField>
            </div>
            <ButtonComponent
              azul={true}
              label={"Adicionar"}
              onClick={handleCadastroFuncionario}
            ></ButtonComponent>
          </div>
        </div>

        <div className="pb-14">
          <h2 className="text-4xl font-bold mt-10 mb-4">Editar Informações</h2>
          <div className="bg-white flex flex-col justify-end gap-6 p-12 rounded-lg">
            <div className="flex flex-wrap gap-6">
              <InputField label="Novo nome da empresa" placeholder="Nome ou razão social" type={"text"} onChange={(e) => setNomeEmpresa(e.target.value)}></InputField>
              <InputField label="Novo CNPJ" placeholder="CNPJ" type={"text"} onChange={(e) => setCnpj(e.target.value)}></InputField>
            </div>
            <ButtonComponent azul={true} label={"Salvar alterações"} onClick={handleEdicaoEmpresa}></ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
}