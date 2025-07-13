"use client";
import { useEffect, useState } from "react";
import { Title } from "@/app/components/title";
import { BlueBox } from "@/app/components/bluebox";
import { ButtonComponent } from "@/app/components/button";

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

  useEffect(() => {
    async function fetchPlanos() {
      setLoading(true);
      setErro("");
      try {
        // Using the correct gateway endpoint
        const res = await fetch("http://localhost:8080/pagamentos/planos");
        if (!res.ok) throw new Error("Erro ao buscar planos");
        const data = await res.json();
        setPlanos(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErro(err.message || "Erro desconhecido");
        } else {
          setErro("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPlanos();
  }, []);

  const handleAssinar = async () => {
    if (!selectedPlano) {
      setErro("Selecione um plano");
      return;
    }
    setLoading(true);
    setErro("");
    setSuccess("");
    try {
      // TODO: Get empresa_id from authentication context or user session
      // For now, using a valid UUID format for testing - this should be replaced with actual user's empresa_id
      const empresa_id = "123e4567-e89b-12d3-a456-426614174000"; // Valid UUID format for testing
      const res = await fetch("http://localhost:8080/pagamentos/assinaturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planoId: selectedPlano,
          empresa_id: empresa_id,
          // Dates will be set automatically by the backend (30 days from now)
        }),
      });
      if (!res.ok) {
        // Try to get the detailed error message from the response
        const errorData = await res.json().catch(() => null);
        console.error("Subscription error:", errorData); // Debug log
        const errorMessage = errorData?.message
          ? Array.isArray(errorData.message)
            ? errorData.message.join(", ")
            : errorData.message
          : "Erro ao assinar plano";
        throw new Error(errorMessage);
      }
      setSuccess("Assinatura realizada com sucesso!");
      setSelectedPlano(""); // Reset selection after successful subscription
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message || "Erro desconhecido");
      } else {
        setErro("Erro desconhecido");
      }
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
            disabled={loading || !selectedPlano}
          />
        </div>
      </BlueBox>
    </div>
  );
}
