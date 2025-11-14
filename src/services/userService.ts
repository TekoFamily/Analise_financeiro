import { api } from "./api";

// Serviço para gerenciar dados do usuário
export const userService = {
  // Buscar renda do usuário logado
  async getRenda(): Promise<number> {
    const response = await api.get<{ rendaMensal: number }>("/api/user/renda");
    return response.rendaMensal || 0;
  },

  // Atualizar renda do usuário logado
  async updateRenda(renda: number): Promise<number> {
    const response = await api.put<{ rendaMensal: number }>("/api/user/renda", {
      rendaMensal: renda,
    });
    return response.rendaMensal;
  },
};

