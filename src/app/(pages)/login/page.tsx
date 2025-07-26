"use client";

import { Title } from "@/app/components/title";
import { ButtonComponent } from "@/app/components/button";
import { InputField } from "@/app/components/inputField";
import { BlueBox } from "@/app/components/bluebox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    try {
      await login(email, senha);
      router.push("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Credenciais inválidas!");
    }
  }

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
          <ButtonComponent label="Entrar" onClick={handleSubmit} />
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
