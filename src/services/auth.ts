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

// import { v4 as uuidv4 } from "uuid";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // Função auxiliar para obter o token armazenado
// function getAccessToken() {
//   // Tente obter o token do localStorage
//   if (typeof window !== "undefined") { // Garante que o código só execute no lado do cliente
//     return localStorage.getItem("accessToken");
//   }
//   return null;
// }

// // Função auxiliar para armazenar o token
// function setAccessToken(token: string) {
//   if (typeof window !== "undefined") {
//     localStorage.setItem("accessToken", token);
//   }
// }

// // Função auxiliar para remover o token
// function removeAccessToken() {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem("accessToken");
//   }
// }

// export async function login(email: string, senha: string) {
//   const response = await fetch(`${API_URL}/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, senha }),
//   });

//   if (!response.ok) {
//     throw new Error("Falha no login");
//   }

//   const data = await response.json();
//   localStorage.setItem("access_token", data.access_token);

//   return data;
// }

// export function logout() {
//   localStorage.removeItem("access_token");
// }

// export async function getMe() {
//   const token = localStorage.getItem("access_token");

//   const res = await fetch(`${API_URL}/auth/me`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) throw new Error("Usuário não autenticado");

//   return await res.json();
// }

// export async function cadastro(nome: string, empresa: string, telefone: string, email: string, cnpj: string, senha: string) {
//   const response = await fetch(`${API_URL}/usuarios/empresa`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     credentials: "include",
//     body: JSON.stringify({
//       nome_razao_social: empresa,
//       cnpj,
//       usuario: {
//         empresa_id: uuidv4(),
//         nome,
//         email,
//         senha,
//         role: "Admin"
//       }
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`Falha no cadastro ${response.status}`);
//   }
//   return await response.json();
// }

// export async function cadastroUsuario(empresa_id: string, nome: string, email: string, senha: string) {

//   const payload = {
//     empresa_id,
//     nome,
//     email,
//     senha,
//     role: "Funcionário",
//   };

//   console.log("Payload JSON a ser enviado para /usuarios:", JSON.stringify(payload));

//   const response = await fetch(`${API_URL}/usuarios`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     credentials: "include",
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     const errorBody = await response.text();
//     console.error(`Erro ${response.status}: ${errorBody}`);
//     throw new Error(`Falha no cadastro ${response.status}: ${errorBody}`);
//   }
//   return await response.json();
// }

// export async function getNotas() {
//   const token = getAccessToken();
//   if (!token) throw new Error("Não autenticado.");
//   const res = await fetch(`${API_URL}/notas-fiscais/notas`, {
//     method: "GET",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     },
//   });
//   if (!res.ok) throw new Error("Erro ao buscar notas");
//   return await res.json();
// }

// export async function getEmpresas() {
//   const token = getAccessToken();
//   if (!token) throw new Error("Não autenticado.");
//   const res = await fetch(`${API_URL}/usuarios/empresas`, {
//     method: "GET",
//     headers: {
//       "Authorization": `Bearer ${token}`
//     },
//   });
//   if (!res.ok) throw new Error("Erro ao buscar empresas");
//   return await res.json();
// }

// export async function getEmpresaDoUsuario() {
//   try {
//     const userData = await getMe();

//     if (!userData || !userData.userId) {
//       throw new Error("userId não encontrado nos dados do usuário logado.");
//     }

//     const userDetails = await getUserById(userData.userId);

//     if (!userDetails || !userDetails.empresa_id) {
//       throw new Error("ID da empresa não encontrado nos detalhes do usuário.");
//     }

//     return userDetails.empresa_id;

//   } catch (error) {
//     console.error("Erro em getEmpresaDoUsuario:", error);
//     let errorMessage = "Erro desconhecido ao obter ID da empresa.";
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else if (typeof error === "string") {
//       errorMessage = error;
//     }
//     throw new Error(`Falha ao obter ID da empresa: ${errorMessage}`);
//   }
// }

// export async function editarEmpresa(
//   empresaId: string, // ID da empresa para a URL e para o campo empresa_id dentro de usuario
//   nomeRazaoSocial: string,
//   cnpj: string,
//   nomeUsuario: string,
//   emailUsuario: string,
//   senhaUsuario: string,
//   roleUsuario: string
// ) {
//   const token = getAccessToken();
//   if (!token) {
//     throw new Error("Não autorizado: Token não encontrado para editar empresa.");
//   }

//   const payload = {
//     nome_razao_social: nomeRazaoSocial,
//     cnpj: cnpj,
//     usuario: {
//       empresa_id: empresaId, // O mesmo ID da URL
//       nome: nomeUsuario,
//       email: emailUsuario,
//       senha: senhaUsuario,
//       role: roleUsuario,
//     },
//   };

//   console.log("Payload para editarEmpresa:", JSON.stringify(payload));

//   const response = await fetch(`${API_URL}/usuarios/empresa/${empresaId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`, // Envia o token de autenticação
//     },
//     credentials: "include",
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     const errorBody = await response.text();
//     console.error(`Erro ${response.status} ao editar empresa: ${errorBody}`);
//     throw new Error(`Falha ao editar empresa ${response.status}: ${errorBody}`);
//   }
//   return await response.json();
// }