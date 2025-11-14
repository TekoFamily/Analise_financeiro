import { api } from "./api";
import { Despesa } from "../context/ExpensesContext";

// Interface para criar despesa (sem id, que será gerado no backend)
export interface CreateDespesaDto {
  nome: string;
  valor: number;
  data: string; // Formato: "YYYY-MM-DD" ou ISO string
  icone?: string;
  descricao?: string;
  tipo: "fixo" | "variavel";
  categoria: string;
}

// Interface para atualizar despesa
export interface UpdateDespesaDto extends Partial<CreateDespesaDto> {}

// Serviço para gerenciar despesas
export const despesasService = {
  // Buscar todas as despesas do usuário logado
  async getAll(): Promise<Despesa[]> {
    const response = await api.get<{ despesas: Despesa[] }>("/api/despesas");
    return response.despesas || [];
  },

  // Criar nova despesa
  async create(despesa: CreateDespesaDto): Promise<Despesa> {
    const response = await api.post<{ despesa: Despesa }>("/api/despesas", despesa);
    return response.despesa;
  },

  // Atualizar despesa existente
  async update(id: number, despesa: UpdateDespesaDto): Promise<Despesa> {
    const response = await api.put<{ despesa: Despesa }>(
      `/api/despesas/${id}`,
      despesa
    );
    return response.despesa;
  },

  // Deletar despesa
  async delete(id: number): Promise<void> {
    await api.delete(`/api/despesas/${id}`);
  },

  // Buscar despesas por período
  async getByPeriod(mes: number, ano: number): Promise<Despesa[]> {
    const response = await api.get<{ despesas: Despesa[] }>(
      `/api/despesas?mes=${mes}&ano=${ano}`
    );
    return response.despesas || [];
  },
};

