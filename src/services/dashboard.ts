
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getNotasPeriodo() {
    const res = await fetch(`${API_URL}/notas-fiscais/periodo`, {
        method: "GET",
    });
    if (!res.ok) throw new Error("Erro ao buscar notas");
    return await res.json();
}

export async function getRanking() {
    const res = await fetch(`${API_URL}/notas-fiscais/ranking`, {
        method: "GET",
    });
    if (!res.ok) throw new Error("Erro ao buscar ranking");
    return await res.json();
}


export async function getNotas() {
    const res = await fetch(`${API_URL}/notas-fiscais/notas`, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Erro ao buscar notas");
    return await res.json();
}
