import { useMemo } from "react";
import { Meta } from "../context/MetasContext";

export function useMetaCalculations(meta: Meta) {
  const progresso = useMemo(() => {
    return meta.valor > 0 ? (meta.valorAtual / meta.valor) * 100 : 0;
  }, [meta.valor, meta.valorAtual]);

  const diasRestantes = useMemo(() => {
    // Calcular diretamente sem cache global problemático
    const now = Date.now();
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
