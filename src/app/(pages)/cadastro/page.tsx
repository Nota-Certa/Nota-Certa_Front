import { Title } from "@/app/components/title";
import { ButtonComponent } from "@/app/components/button";
import { InputField } from "@/app/components/inputField";
import { BlueBox } from "@/app/components/bluebox";

export default function Cadastro() {
  return (
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
            />
            <InputField
              type="text"
              label="Nome da empresa"
              placeholder="Insira o nome da empresa"
            />
            <InputField
              type="text"
              label="Telefone"
              placeholder="Insira o telefone da empresa"
            />
          </div>

          <div className="flex flex-row justify-between w-full gap-x-8">
            <InputField
              type="email"
              label="E-mail"
              placeholder="Insira o e-mail"
            />
            <InputField
              type="text"
              label="CNPJ"
              placeholder="Insira o CNPJ da empresa"
            />
          </div>

          <InputField
            type="password"
            label="Senha"
            placeholder="Insira nova senha"
            classNameInput="w-min"
          />
        </div>

        <div className="self-center">
          <ButtonComponent label="Cadastrar" />
        </div>
      </BlueBox>
    </div>
  );
}
