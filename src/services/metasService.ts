import { api } from "./api";
import { Meta } from "../context/MetasContext";

// Interface para criar meta (sem id, criadoEm, valorAtual)
export interface CreateMetaDto {
  nome: string;
  valor: number;
  prazo: string; // ISO string ou formato aceito pelo backend
  categoria: string;
}

// Interface para atualizar meta
export interface UpdateMetaDto extends Partial<CreateMetaDto> {
  valorAtual?: number;
}

// Serviço para gerenciar metas
export const metasService = {
  // Buscar todas as metas do usuário logado
  async getAll(): Promise<Meta[]> {
    const response = await api.get<{ metas: Meta[] }>("/api/metas");
    return response.metas || [];
  },

  // Criar nova meta
  async create(meta: CreateMetaDto): Promise<Meta> {
    const response = await api.post<{ meta: Meta }>("/api/metas", meta);
    return response.meta;
  },

  // Atualizar meta existente
  async update(id: number | string, meta: UpdateMetaDto): Promise<Meta> {
    const response = await api.put<{ meta: Meta }>(`/api/metas/${id}`, meta);
    return response.meta;
  },

  // Deletar meta
  async delete(id: number | string): Promise<void> {
    await api.delete(`/api/metas/${id}`);
  },

  // Adicionar valor à meta
  async addValue(id: number | string, valor: number): Promise<Meta> {
    const response = await api.post<{ meta: Meta }>(
      `/api/metas/${id}/add-value`,
      { valor }
    );
    return response.meta;
  },
};

