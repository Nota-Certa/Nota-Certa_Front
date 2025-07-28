import { http } from ".";

export const getListInvoices = () => http.get("notas-fiscais/notas");

export const getInvoice = (formData: Record<string, string>) =>
  http.get(`/notas-fiscais/notas/${formData.id}`);
