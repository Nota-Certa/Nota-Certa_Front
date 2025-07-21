"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";

export default function BarraLateral() {
  const [recolhida, setRecolhida] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div
      className={`flex flex-col ${
        recolhida ? "items-center w-24 py-14" : "items-end w-fit p-14"
      } bg-primary-blue transition-all duration-300 gap-10`}
    >
      <button onClick={() => setRecolhida((v) => !v)}>
        <Image width={20} height={14} src="/icons/expandir.svg" alt="Expandir" />
      </button>

      <a href="">
        <div className="flex flex-row gap-3 items-center">
          {!recolhida && <h3 className="text-white font-bold">Dashboard</h3>}
          <Image width={20} height={20} src="/icons/dashboard.svg" alt="dashboard" />
        </div>
      </a>

      <a href="">
        <div className="flex flex-row gap-3 items-center">
          {!recolhida && <h3 className="text-white font-bold">Notas</h3>}
          <Image width={20} height={20} src="/icons/notas.svg" alt="Notas" />
        </div>
      </a>

      <a href="">
        <div className="flex flex-row gap-3 items-center">
          {!recolhida && <h3 className="text-white font-bold">Criar Notas</h3>}
          <Image width={20} height={20} src="/icons/criarNota.svg" alt="Criar notas" />
        </div>
      </a>

      <a href="">
        <div className="flex flex-row gap-3 items-center">
          {!recolhida && <h3 className="text-white font-bold">Configurações</h3>}
          <Image width={20} height={16} src="/icons/config.svg" alt="Configurações" />
        </div>
      </a>

      <button
        onClick={handleLogout}
        className="flex flex-row gap-3 items-center text-white font-bold"
        style={{ background: "none", border: "none", cursor: "pointer" }}
        aria-label="Sair"
      >
        {!recolhida && <h3>Sair</h3>}
        <Image width={20} height={16} src="/icons/sair.svg" alt="Sair" />
      </button>
    </div>
  );
}
