import BarraLateral from "@/app/components/barraLateral";
import { ButtonComponent } from "@/app/components/button";
import { InputField } from "@/app/components/inputField";

export default function Gerenciar(){
  return(
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
              <InputField label="Nome completo" placeholder="Nome completo" type={"text"}></InputField>
              <InputField label="CPF" placeholder="Nome completo" type={"text"}></InputField>
              <InputField label="E-mail" placeholder="E-mail" type={"email"}></InputField>
            </div>
            <ButtonComponent azul={true} label={"Adicionar"} ></ButtonComponent>
          </div>
        </div>

        <div className="pb-14">
          <h2 className="text-4xl font-bold mt-10 mb-4">Editar Informações</h2>
          <div className="bg-white flex flex-col justify-end gap-6 p-12 rounded-lg">
            <div className="flex flex-wrap gap-6">
              <InputField label="Nome da empresa" placeholder="Nome completo" type={"text"}></InputField>
              <InputField label="telefone" placeholder="Nome completo" type={"text"}></InputField>
              <InputField label="E-mail" placeholder="E-mail" type={"email"}></InputField>
              <InputField label="CNPJ" placeholder="CNPJ" type={"text"}></InputField>
              <InputField label="Senha" placeholder="Senha" type={"password"}></InputField>
            </div>
            <ButtonComponent azul={true} label={"Salvar alterações"} ></ButtonComponent>
          </div>
        </div>

      </div>
    </div>
  );
}