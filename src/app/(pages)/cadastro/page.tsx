import { ButtonComponent } from "@/app/components/button";
import { InputField } from "@/app/components/inputField";

export default function Cadastro() {
  return (
    <div className="flex flex-col justify-center items-center px-20 py-14">
      <h1 className="text-5xl font-bold pb-14">Bem vindo ao Nota Certa!</h1>
      <p className="text-base font-normal">Insira seus dados para fazer cadastro na plataforma</p>
      <div className="bg-primary-blue text-white w-full flex flex-col items-start py-7 px-20 rounded-lg mt-14">
        <h1 className="text-4xl font-bold self-center">Cadastro</h1>
        <div className="flex flex-col gap-y-4 py-9 w-full">
          <div className="flex flex-row justify-between w-full gap-x-8">
            <InputField
              type="text"
              label="Nome completo"
              placeholder="Insira seu nome completo"></InputField>
            <InputField
              type="text"
              label="Nome da empresa"
              placeholder="Insira o nome da empresa"></InputField>
            <InputField
              type="text"
              label="Telefone"
              placeholder="Insira o telefone da empresa"></InputField>
          </div>
          <div className="flex flex-row justify-between w-full gap-x-8">
            <InputField
              type="email"
              label="E-mail"
              placeholder="Insira o e-mail"></InputField>
            <InputField
              type="text"
              label="CNPJ"
              placeholder="Insira o CNPJ da empresa"></InputField>
          </div>
          <InputField
            type="password"
            label="Senha"
            placeholder="Insira nova senha"
            classNameInput="w-min"></InputField>
        </div>
        <div className="self-center">
          <ButtonComponent label="Cadastrar"></ButtonComponent>
        </div>
      </div>
    </div>
  );
}