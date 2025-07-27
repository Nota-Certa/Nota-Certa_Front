"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cadastroSchema } from "./validateSchema";
import { InputField } from "@/app/components/inputFieldRF";
import { ButtonComponent } from "@/app/components/buttonSubmitRF";
import { Title } from "@/app/components/title";
import { BlueBox } from "@/app/components/bluebox";
import { useRouter } from "next/navigation";
import { cadastro } from "@/services/auth";
import { toast } from "react-toastify";

type CadastroFormData = z.infer<typeof cadastroSchema>;

export default function Cadastro() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CadastroFormData) => {
    try {
      await cadastro(
        data.nome,
        data.empresa,
        data.telefone,
        data.email,
        data.cnpj,
        data.senha
      );
      toast.success("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar. Verifique os dados.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-20 py-14">
      <Title size="lg" className="pb-14">Bem vindo ao Nota Certa!</Title>
      <p className="text-base font-normal">
        Insira seus dados para fazer cadastro na plataforma
      </p>

      <BlueBox className="mt-14 items-center">
        <Title size="md">Cadastro</Title>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 py-9 w-full">
          <div className="flex gap-x-8">
            <InputField
              label="Nome completo"
              placeholder="Insira seu nome completo"
              {...register("nome")}
            />
            {errors.nome && <span className="text-red-600 text-sm">{errors.nome.message}</span>}

            <InputField
              label="Nome da empresa"
              placeholder="Insira o nome da empresa"
              {...register("empresa")}
            />
            {errors.empresa && <span className="text-red-600 text-sm">{errors.empresa.message}</span>}

            <InputField
              label="Telefone"
              placeholder="Insira o telefone"
              {...register("telefone")}
            />
            {errors.telefone && <span className="text-red-600 text-sm">{errors.telefone.message}</span>}
          </div>

          <div className="flex gap-x-8">
            <InputField
              label="E-mail"
              placeholder="Insira o e-mail"
              type="email"
              {...register("email")}
            />
            {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}

            <InputField
              label="CNPJ"
              placeholder="Insira o CNPJ da empresa"
              {...register("cnpj")}
            />
            {errors.cnpj && <span className="text-red-600 text-sm">{errors.cnpj.message}</span>}
          </div>

          <InputField
            label="Senha"
            placeholder="Insira nova senha"
            type="password"
            {...register("senha")}
          />
          {errors.senha && <span className="text-red-600 text-sm">{errors.senha.message}</span>}

          <div className="self-center pt-4">
            <ButtonComponent label="Cadastrar" type="submit" />
          </div>
        </form>
      </BlueBox>
    </div>
  );
}
