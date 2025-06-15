import { Title } from "@/app/components/title";
import { ButtonComponent } from "@/app/components/button";
import { InputField } from "@/app/components/inputField";
import { BlueBox } from "@/app/components/bluebox";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-20 py-14">
      <Title size="lg" className="pb-14">
        Bem vindo ao Nota Certa!
      </Title>
      <p className="text-base font-normal text-center">
       Insira seus dados cadastrados para fazer login na plataforma
      </p>

      <BlueBox className="mt-14 items-center max-w-xl">
        <Title size="md">
          Login
        </Title>

        <div className="flex flex-col gap-y-4 py-9 w-full">
          <InputField
            type="email"
            label="E-mail"
            placeholder="Insira seu e-mail"
          />
          <InputField
            type="password"
            label="Senha"
            placeholder="Insira sua senha"
          />

          <div className="w-full text-right">
            <a href="/recuperar-senha" className="text-sm hover:text-gray-300">
              Esqueci a senha
            </a>
          </div>
        </div>

        <div className="self-center">
          <ButtonComponent label="Entrar" />
        </div>
      </BlueBox>
      <div className="mt-6 text-sm text-center">
        Ainda não tem conta?{" "}
        <a href="/cadastro" className="text-primary-blue hover:text-blue-700 font-bold">
          Faça seu cadastro aqui
        </a>
      </div>
    </div>
  );
}