"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/auth";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndRedirect() {
      try {
        await getMe();
        router.replace("/dashboard");
      } catch (error) {
        console.log("Usuário não autenticado ou sessão expirada. Redirecionando para /login", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndRedirect();
  }, [router]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }
  return null;
}