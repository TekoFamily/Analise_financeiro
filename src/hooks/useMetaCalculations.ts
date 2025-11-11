import { useMemo } from "react";
import { Meta } from "../context/MetasContext";

// Simplifique o cache de data:
let cachedNow = 0;
let cacheTime = 0;

function getCurrentTime(): number {
  const now = Date.now();
  // Cache por 5 segundos para reduzir cálculos
  if (now - cacheTime > 5000) {
    cachedNow = now;
    cacheTime = now;
  }
  return cachedNow;
}

export function useMetaCalculations(meta: Meta) {
  const progresso = useMemo(() => {
    return meta.valor > 0 ? (meta.valorAtual / meta.valor) * 100 : 0;
  }, [meta.valor, meta.valorAtual]);

  const diasRestantes = useMemo(() => {
    const now = getCurrentTime();
    return Math.ceil((meta.prazo.getTime() - now) / (1000 * 60 * 60 * 24));
  }, [meta.prazo]);

  const prazoExpirado = useMemo(() => {
    return diasRestantes < 0;
  }, [diasRestantes]);

  const status = useMemo(() => {
    if (progresso >= 100) return "concluida";
    if (prazoExpirado) return "expirada";
    return "em_andamento";
  }, [progresso, prazoExpirado]);

  return {
    progresso,
    diasRestantes,
    prazoExpirado,
    status,
  };
}

