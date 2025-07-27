"use client";

import { Title } from "@/app/components/title";
import { ButtonComponent } from "@/app/components/button";
import { InputField } from "@/app/components/inputField";
import { BlueBox } from "@/app/components/bluebox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getMe, getAssinaturasByEmpresaId, getEmpresaDoUsuario } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await login(email, senha);

      const userData = await getMe();
      setUser(userData);

      const empresaId = await getEmpresaDoUsuario();

      let hasActiveSubscription = false;

      if (empresaId) {
        try {
          const assinaturas = await getAssinaturasByEmpresaId(empresaId);
          if (assinaturas.length > 0) {
            hasActiveSubscription = true;
          }
        } catch (err: unknown) {
          console.error("Erro ao verificar assinaturas após login:", err);
        }
      } else {
        console.warn("Não foi possível obter o ID da empresa após o login. Redirecionando para seleção de planos.");
      }

      if (hasActiveSubscription) {
        router.push("/dashboard");
      } else {
        router.push("/assinatura");
      }

    } catch (err: unknown) {
      let errorMessage = "Erro desconhecido ao tentar fazer login.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(`Falha no login: ${errorMessage}. Verifique seu e-mail e senha.`);
      console.error("Erro geral no fluxo de login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-20 py-14">
      <Title size="lg" className="pb-14">
        Bem vindo ao Nota Certa!
      </Title>
      <p className="text-base font-normal text-center">
        Insira seus dados cadastrados para fazer login na plataforma
      </p>

      <BlueBox className="mt-14 items-center max-w-xl">
        <Title size="md">Login</Title>

        <div className="flex flex-col gap-y-4 py-9 w-full">
          <InputField
            type="email"
            label="E-mail"
            placeholder="Insira seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            label="Senha"
            placeholder="Insira sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="w-full text-right">
            <a href="/recuperar-senha" className="text-sm hover:text-gray-300">
              Esqueci a senha
            </a>
          </div>
        </div>

        <div className="self-center">
          <ButtonComponent
            label={loading ? "Entrando..." : "Entrar"}
            onClick={handleLogin}
            disabled={loading}
          />
        </div>

        {error && <p className="text-white-600 pt-4 self-center">{error}</p>}
      </BlueBox>

      <div className="mt-6 text-sm text-center">
        Ainda não tem conta?{" "}
        <a
          href="/cadastro"
          className="text-primary-blue hover:text-blue-700 font-bold"
        >
          Faça seu cadastro aqui
        </a>
      </div>
    </div>
  );
}
