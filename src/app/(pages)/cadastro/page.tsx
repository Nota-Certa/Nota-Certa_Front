import { Title } from "@/app/components/title";
import { ButtonComponent } from "@/app/components/button";
import { InputField } from "@/app/components/inputField";
import { BlueBox } from "@/app/components/bluebox";
import { useState } from "react";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleCadastro = async () => {
    setLoading(true);
    setErro("");
    try {
      const response = await fetch("http://localhost:3004/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "nome_razao_social": empresa,
          "cnpj": cnpj,
          "usuario":{
            nome,
            email,
            "senha_hash": senha,
            "ativo": true
          }

        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      alert("Cadastro realizado com sucesso!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="flex flex-col justify-center items-center px-20 py-14">
      <Title size="lg" className="pb-14">Bem vindo ao Nota Certa!</Title>
      <p className="text-base font-normal">
        Insira seus dados para fazer cadastro na plataforma
      </p>

      <BlueBox className="mt-14 items-center">
        <Title size="md">Cadastro</Title>

        <div className="flex flex-col gap-y-4 py-9 w-full">
          <div className="flex flex-row justify-between w-full gap-x-8">
            <InputField
              type="text"
              label="Nome completo"
              placeholder="Insira seu nome completo"
              value={nome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
            />
            <InputField
              type="text"
              label="Nome da empresa"
              placeholder="Insira o nome da empresa"
              value={empresa}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmpresa(e.target.value)}
            />
            <InputField
              type="text"
              label="Telefone"
              placeholder="Insira o telefone da empresa"
              value={telefone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)}
            />
          </div>

          <div className="flex flex-row justify-between w-full gap-x-8">
            <InputField
              type="email"
              label="E-mail"
              placeholder="Insira o e-mail"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <InputField
              type="text"
              label="CNPJ"
              placeholder="Insira o CNPJ da empresa"
              value={cnpj}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
            />
          </div>

          <InputField
            type="password"
            label="Senha"
            placeholder="Insira nova senha"
            classNameInput="w-min"
            value={senha}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
          />
        </div>

        {erro && <p className="text-red-500">{erro}</p>}
        <div className="self-center">
          <ButtonComponent label={loading ? "Cadastrando..." : "Cadastrar"} onClick={handleCadastro} disabled={loading} />
        </div>
      </BlueBox>
    </div>
  );
}
