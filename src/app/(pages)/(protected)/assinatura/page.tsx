"use client";
import { useEffect, useState } from "react";
import { Title } from "@/app/components/title";
import { BlueBox } from "@/app/components/bluebox";
import { ButtonComponent } from "@/app/components/button";
import { assinar, getEmpresaDoUsuario, getPlanos } from "@/services/auth";
import { useRouter } from "next/navigation";

interface Plano {
  id: string;
  nome: string;
  valor_mensal: number;
  limite_notas_mensal: number;
  valor_excedente: number;
  acesso_premium: boolean;
  limite_usuarios: number;
  criado_em?: string;
  atualizado_em?: string;
}

export default function AssinaturaPage() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [selectedPlano, setSelectedPlano] = useState<string>("");
  const [success, setSuccess] = useState("");
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErro("");
      try {
        const planosData = await getPlanos();
        setPlanos(planosData);

        const id = await getEmpresaDoUsuario();
        setEmpresaId(id);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErro(err.message || "Erro desconhecido ao carregar dados.");
        } else {
          setErro("Erro desconhecido ao carregar dados.");
        }
        console.error("Erro ao carregar planos ou ID da Empresa:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAssinar = async () => {
    if (!selectedPlano) {
      setErro("Selecione um plano");
      return;
    }

    if (!empresaId) {
      setErro("ID da empresa não disponível. Tente novamente mais tarde.");
      return;
    }

    setLoading(true);
    setErro("");
    setSuccess("");
    try {
      await assinar(selectedPlano, empresaId);
      setSuccess("Assinatura realizada com sucesso!");
      setSelectedPlano("");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message || "Erro desconhecido ao assinar plano.");
      } else {
        setErro("Erro desconhecido ao assinar plano.");
      }
      console.error("Erro ao assinar plano:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-20 py-14">
      <Title size="lg" className="pb-10">Assinatura de Planos</Title>
      <p className="text-base font-normal mb-8">Escolha o plano ideal para sua empresa e comece agora!</p>
      <BlueBox className="mt-6 items-center w-full max-w-3xl">
        <Title size="md" className="mb-6">Planos Disponíveis</Title>
        {loading ? (
          <p className="text-white">Carregando...</p>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {planos.length === 0 ? (
              <p className="text-white">Nenhum plano disponível.</p>
            ) : (
              planos.map((plano) => (
                <div
                  key={plano.id}
                  className={`border rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between w-full cursor-pointer transition-all ${selectedPlano === plano.id ? "border-yellow-400 bg-white text-primary-blue" : "border-white bg-primary-blue text-white"}`}
                  onClick={() => setSelectedPlano(plano.id)}
                >
                  <div>
                    <h2 className="font-bold text-2xl mb-2">{plano.nome}</h2>
                    <p className="text-lg">R$ {Number(plano.valor_mensal).toFixed(2)} / mês</p>
                    <p className="text-sm mt-2">Limite de notas: {plano.limite_notas_mensal}</p>
                    <p className="text-sm mt-1">Limite de usuários: {plano.limite_usuarios}</p>
                    <p className="text-sm mt-1">Valor excedente: R$ {Number(plano.valor_excedente).toFixed(2)} por nota</p>
                    {plano.acesso_premium && <p className="text-sm mt-1">✨ Acesso Premium</p>}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <input
                      type="radio"
                      name="plano"
                      checked={selectedPlano === plano.id}
                      onChange={() => setSelectedPlano(plano.id)}
                      className="accent-yellow-400 w-6 h-6"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {erro && <p className="text-red-400 mt-6">{erro}</p>}
        {success && <p className="text-green-400 mt-6">{success}</p>}
        <div className="self-center mt-8">
          <ButtonComponent
            label={loading ? "Processando..." : "Assinar"}
            onClick={handleAssinar}
            disabled={loading || !selectedPlano || !empresaId}
          />
        </div>
      </BlueBox>
    </div>
  );
}
