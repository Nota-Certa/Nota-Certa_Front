import { v4 as uuidv4 } from "uuid";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, senha: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    throw new Error("Falha no login");
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access_token);

  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
}

export async function getMe() {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Usuário não autenticado");

  return await res.json();
}

export async function cadastro(nome: string, empresa: string, telefone: string, email: string, cnpj: string, senha: string) {
  const response = await fetch(`${API_URL}/usuarios/empresa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      nome_razao_social: empresa,
      cnpj,
      usuario: {
        empresa_id: uuidv4(),
        nome,
        email,
        senha,
        role: "Admin"
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Falha no cadastro ${response.status}`);
  }
  return await response.json();
}

export async function getNotas() {
  const res = await fetch(`${API_URL}/notas-fiscais/notas`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar notas");
  return await res.json();
}
