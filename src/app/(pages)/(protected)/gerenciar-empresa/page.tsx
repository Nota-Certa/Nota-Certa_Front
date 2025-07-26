"use client";

import BarraLateral from "@/app/components/barraLateral";
import { ButtonComponent } from "@/app/components/button";
import { InputField } from "@/app/components/inputField";
import { getEmpresaDoUsuario, cadastroFuncionario, editarEmpresa } from "@/services/auth";
import { useEffect, useState } from "react";

export default function Gerenciar() {
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [nomeFuncionario, setNomeFuncionario] = useState<string>("");
  const [emailFuncionario, setEmailFuncionario] = useState<string>("");
  const [senhaFuncionario, setSenhaFuncionario] = useState<string>("");
  const [nomeEmpresa, setNomeEmpresa] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");

  useEffect(() => {
    const carregarEmpresaId = async () => {
      try {
        const id = await getEmpresaDoUsuario();
        setEmpresaId(id);
      } catch (error) {
        console.error("Erro ao carregar ID da Empresa:", error);
      }
    };

    carregarEmpresaId();
  }, []);

  const handleCadastroFuncionario = async () => {
    if (!empresaId) {
      alert("ID da empresa não disponível. Tente novamente mais tarde.");
      return;
    }

    if (!nomeFuncionario || !emailFuncionario || !senhaFuncionario) {
      alert("Por favor, preencha todos os campos do funcionário.");
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

  return (
    <div className="flex flex-row">
      <BarraLateral></BarraLateral>
      <div className="px-11 bg-[#F2F5FA] w-screen">
        <div className="py-12">
          <h1 className="text-5xl font-bold">Gerenciamento da empresa</h1>
          <p className="text-base font-normal">Edite informações e adicione funcionários</p>
        </div>

        <div className="mt-12">
          <h2 className="text-4xl font-bold mb-4">Adicionar funcionários</h2>
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