/**
 * src/hooks/useAppToast.ts
 * 🔔 Hook para Sistema de Notificações
 *
 * Por enquanto usa Alert.alert como fallback.
 * Pode ser expandido para usar Toast nativo depois.
 *
 * Métodos disponíveis:
 * - success(message: string): Exibe alerta de sucesso
 * - error(message: string): Exibe alerta de erro
 * - info(message: string): Exibe alerta informativo
 * - warning(message: string): Exibe alerta de aviso
 *
 * Exemplos de uso:
 * const toast = useAppToast();
 * toast.success("Gasto adicionado com sucesso!");
 * toast.error("Erro ao salvar dados.");
 * toast.info("Dados carregados do servidor.");
 * toast.warning("Atenção: prazo da meta próximo!");
 *
 * Referências no theme.ts:
 * - theme.colors.success → Cor de sucesso (para referência visual futura)
 * - theme.colors.danger → Cor de erro
 * - theme.colors.info → Cor informativa
 * - theme.colors.warning → Cor de aviso
 */

import { Alert } from "react-native";

export function useAppToast() {
  return {
    /**
     * ✅ Exibe alerta de sucesso
     * Usado quando operações são bem-sucedidas (salvar, criar, atualizar)
     */
    success: (message: string, title: string = "Sucesso") => {
      Alert.alert(title, message, [{ text: "OK" }]);
    },

    /**
     * ❌ Exibe alerta de erro
     * Usado quando operações falham ou há erros de validação
     */
    error: (message: string, title: string = "Erro") => {
      Alert.alert(title, message, [{ text: "OK" }]);
    },

    /**
     * ℹ️ Exibe alerta informativo
     * Usado para informações gerais e feedback neutro
     */
    info: (message: string, title: string = "Informação") => {
      Alert.alert(title, message, [{ text: "OK" }]);
    },

    /**
     * ⚠️ Exibe alerta de aviso
     * Usado para alertas e avisos que requerem atenção
     */
    warning: (message: string, title: string = "Atenção") => {
      Alert.alert(title, message, [{ text: "OK" }]);
    },

    /**
     * ❓ Exibe alerta de confirmação com callback
     * Usado quando precisa de confirmação do usuário
     */
    confirm: (
      message: string,
      onConfirm: () => void,
      onCancel?: () => void,
      title: string = "Confirmar",
    ) => {
      Alert.alert(title, message, [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: onCancel,
        },
        {
          text: "Confirmar",
          onPress: onConfirm,
        },
      ]);
    },
  };
}
