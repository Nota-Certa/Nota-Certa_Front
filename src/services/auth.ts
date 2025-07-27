import { NotaAPI } from "@/app/components/tabela";
import { v4 as uuidv4 } from "uuid";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Assinatura {
  id: string;
  empresa_id: string;
  plano_id: string;
  inicio: string;
  fim: string;
  ativo: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

interface UserAPI {
  id: string;
  empresa_id: string;
  nome: string;
  email: string;
  senha?: string;
  role: string;
  ativo: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

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

export async function getPlanos(){
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Não autorizado: Token não encontrado para buscar usuário por ID.");
  }

  const response = await fetch(`${API_URL}/pagamentos/planos`, {
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
    throw new Error(`Erro ao buscar planos: ${response.statusText}`);
  }
  return await response.json();
}

export async function assinar(planoId: string, empresa_id: string) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Não autorizado: Token não encontrado para realizar assinatura.");
  }

  const dataInicio = new Date();
  const dataFim = new Date();
  dataFim.setMonth(dataFim.getMonth() + 1);

  const inicioISO = dataInicio.toISOString();
  const fimISO = dataFim.toISOString();

  const response = await fetch(`${API_URL}/pagamentos/assinaturas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      "plano_id": planoId,
      empresa_id,
      inicio: inicioISO,
      fim: fimISO,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error(`Erro ${response.status} ao fazer assinatura:`, errorData);
    const errorMessage = errorData?.message
      ? Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : errorData.message
      : `Falha ao fazer assinatura ${response.status}`;

    if (response.status === 401) {
      localStorage.removeItem("access_token");
      throw new Error("Não autorizado: Sua sessão pode ter expirado. Por favor, faça login novamente.");
    }
    throw new Error(errorMessage);
  }
  return await response.json();
}

export async function atualizarAssinatura(assinaturaId: string, payload: any) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Não autorizado: Token não encontrado.");
  }

  const response = await fetch(`${API_URL}/pagamentos/assinaturas/${assinaturaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Erro ao atualizar assinatura.");
  }

  return await response.json();
}

export async function getTodasAssinaturas() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token não encontrado");

  const response = await fetch(`${API_URL}/pagamentos/assinaturas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar assinaturas");
  }

  return await response.json();
}

export async function getAssinaturasByEmpresaId(empresaId: string): Promise<Assinatura[]> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Não autorizado: Token não encontrado para buscar assinaturas.");
  }

  const response = await fetch(`${API_URL}/pagamentos/assinaturas`, {
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
    throw new Error(`Erro ao buscar assinaturas: ${response.statusText}`);
  }

  const todasAssinaturas: Assinatura[] = await response.json();

  // Filtra as assinaturas para encontrar apenas as da empresa_id específica
  const assinaturasDaEmpresa = todasAssinaturas.filter(
    (assinatura) => assinatura.empresa_id === empresaId && assinatura.ativo === true
  );

  return assinaturasDaEmpresa;
}

export async function getUsuarios(): Promise<UserAPI[]>{
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Não autorizado: Token não encontrado para buscar assinaturas.");
  }

  const response = await fetch(`${API_URL}/usuarios`, {
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
    throw new Error(`Erro ao buscar usuarios: ${response.statusText}`);
  }
  return await response.json();
}

export async function getEmployeeCountForCompany(empresaId: string): Promise<number> {
  const allUsers = await getUsuarios();

  const employeesOfCompany = allUsers.filter(user => user.empresa_id === empresaId);

  return employeesOfCompany.length;
}

export async function checkEmployeeLimit(empresaId: string): Promise<{ canAdd: boolean; currentCount: number; maxAllowed: number; message: string }> {
  try {
    const assinaturasAtivas = await getAssinaturasByEmpresaId(empresaId);
    const currentEmployeeCount = await getEmployeeCountForCompany(empresaId);

    let maxAllowedEmployees = 0;
    let hasValidSubscription = false;

    // Defina os limites de funcionários para cada ID de assinatura
    const subscriptionLimits: { [key: string]: number } = {
      "9b1db36f-2d4f-4bb5-9e2a-5d6fc24bfa61": 3,
      "9e8fd341-d4fd-4e09-bf12-f88b34e0983b": 10,
      "7428e22e-89b5-4b1e-8cbf-4d2da8ad7d4f": 50,
    };

    // Itera sobre as assinaturas ativas para encontrar o maior limite aplicável
    for (const assinatura of assinaturasAtivas) {
      if (subscriptionLimits[assinatura.plano_id] !== undefined) {
        maxAllowedEmployees = Math.max(maxAllowedEmployees, subscriptionLimits[assinatura.plano_id]);
        hasValidSubscription = true;
      }
    }

    if (!hasValidSubscription) {
      return {
        canAdd: false,
        currentCount: currentEmployeeCount,
        maxAllowed: 0,
        message: "Nenhuma assinatura ativa encontrada para esta empresa, ou assinatura sem limite definido. Por favor, assine um plano.",
      };
    }

    const canAdd = currentEmployeeCount < maxAllowedEmployees;
    const message = canAdd
      ? `A empresa tem ${currentEmployeeCount} de ${maxAllowedEmployees} funcionários permitidos. Pode adicionar mais.`
      : `A empresa atingiu o limite de ${maxAllowedEmployees} funcionários com ${currentEmployeeCount} funcionários. Atualize seu plano para adicionar mais.`;

    return {
      canAdd,
      currentCount: currentEmployeeCount,
      maxAllowed: maxAllowedEmployees,
      message,
    };
  } catch (error) {
    console.error("Erro ao verificar o limite de funcionários:", error);
    let errorMessage = "Erro desconhecido ao verificar o limite de funcionários.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    throw new Error(`Falha ao verificar o limite de funcionários: ${errorMessage}`);
  }
}

export async function getNotasDaEmpresa(empresaId: string): Promise<NotaAPI[]> {
  const todasNotas = await getNotas();
  return todasNotas.filter(nota => nota.empresa_id === empresaId);
}

export async function getPlanoDaEmpresa(empresaId: string): Promise<string> {
  const assinaturas = await getAssinaturasByEmpresaId(empresaId);
  const assinaturaAtiva = assinaturas.find(ass => ass.ativo);

  if (!assinaturaAtiva) {
    throw new Error("Nenhuma assinatura ativa encontrada para a empresa.");
  }

  return assinaturaAtiva.plano_id;
}

export async function emitirNotaFiscal(data: any) {
  const ajustado = {
    ...data,
    data_emissao: new Date(data.data_emissao).toISOString(),
    data_vencimento: new Date(data.data_vencimento).toISOString(),
  };

  const res = await fetch(`${API_URL}/notas-fiscais/notas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ajustado),
  });

  if (!res.ok) {
    throw new Error("Erro ao emitir nota fiscal");
  }

  return res.json();
}

export async function getNotasDoUsuario(): Promise<NotaAPI[]> {
  try {
    const empresaId = await getEmpresaDoUsuario();
    const todasNotas = await getNotas();
    const notasDoUsuario = todasNotas.filter(nota => nota.empresa_id === empresaId);
    return notasDoUsuario;
  } catch (error) {
    console.error("Erro ao buscar notas do usuário:", error);
    return [];
  }
}

export async function atualizarStatusNota(id: string, novoStatus: string) {
  try {
    const response = await fetch(`${API_URL}/notas-fiscais/notas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status: novoStatus }),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar status da nota");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao atualizar status da nota:", error);
    throw error;
  }
}
