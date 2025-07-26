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

export async function cadastroFuncionario(empresa_id: string, nome: string, email: string, senha: string) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Não autorizado: Usuário não logado para cadastrar funcionário.");
  }

  const payload = {
    empresa_id,
    nome,
    email,
    senha,
    role: "Funcionário",
  };

  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Erro ${response.status}: ${errorBody}`);
    throw new Error(`Falha no cadastro ${response.status}: ${errorBody}`);
  }
  return await response.json();
}

export async function getUserById(userId: string) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Não autorizado: Token não encontrado para buscar usuário por ID.");
  }

  const response = await fetch(`${API_URL}/usuarios/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      throw new Error("Não autorizado: Sua sessão pode ter expirado. Por favor, faça login novamente.");
    }
    throw new Error(`Erro ao buscar usuário por ID: ${response.statusText}`);
  }
  return await response.json();
}

export async function getEmpresaDoUsuario() {
  try {
    const userData = await getMe();

    if (!userData || !userData.userId) {
      throw new Error("userId não encontrado nos dados do usuário logado.");
    }

    const userDetails = await getUserById(userData.userId);

    if (!userDetails || !userDetails.empresa_id) {
      throw new Error("ID da empresa não encontrado nos detalhes do usuário.");
    }

    return userDetails.empresa_id;

  } catch (error) {
    console.error("Erro em getEmpresaDoUsuario:", error);
    let errorMessage = "Erro desconhecido ao obter ID da empresa.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    throw new Error(`Falha ao obter ID da empresa: ${errorMessage}`);
  }
}

export async function editarEmpresa(empresaId: string, nomeRazaoSocial: string, cnpj: string) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Não autorizado: Token não encontrado para buscar usuário por ID.");
  }

  const payload = {
    nome_razao_social: nomeRazaoSocial,
    cnpj: cnpj,
  };

  const response = await fetch(`${API_URL}/usuarios/empresa/${empresaId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Erro ${response.status} ao editar empresa: ${errorBody}`);
    throw new Error(`Falha ao editar empresa ${response.status}: ${errorBody}`);
  }
  return await response.json();
}