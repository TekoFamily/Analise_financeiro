/**
 * src/components/ToggleSaldoButton.tsx
 *
 * 👁️ Componente: ToggleSaldoButton
 * - Propósito: Alterna a visibilidade do saldo (mostrar/ocultar) por meio de um botão simples com ícone.
 * - Onde é usado: Principalmente na Home (painel de saldo), mas pode ser reutilizado em qualquer tela que exiba valores sensíveis.
 * - Como usar:
 *    <ToggleSaldoButton visivel={saldoVisivel} onToggle={() => setSaldoVisivel(v => !v)} />
 *
 * - Movimentação/Redimensionamento:
 *    • Pode ficar ao lado do valor do saldo (em um HStack/Row) ou acima/abaixo conforme o layout.
 *    • O tamanho do ícone pode ser ajustado alterando a prop fontSize do Text (ex.: 24, 28, 32).
 *
 * - Acessibilidade:
 *    • O botão expõe rótulos para leitores de tela conforme o estado (mostrar/ocultar saldo).
 */

import React from "react";
import { Pressable, Text } from "@gluestack-ui/themed";

type Props = {
  visivel: boolean;
  onToggle: () => void;
};

export function ToggleSaldoButton({ visivel, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={visivel ? "Ocultar saldo" : "Mostrar saldo"}
    >
      <Text fontSize={30}>{visivel ? "👁️" : "🙈"}</Text>
    </Pressable>
  );
}
