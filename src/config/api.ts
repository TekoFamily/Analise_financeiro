// Configuração da API
export const API_BASE_URL = "http://100.66.7.63:3001"; // Ajuste conforme sua porta

// Tipos para as respostas da API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

