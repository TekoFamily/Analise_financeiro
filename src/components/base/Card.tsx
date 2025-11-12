/**
 * src/components/base/Card.tsx
 * 🎴 Componente Card Reutilizável
 *
 * Usado em: Home, Metas, Histórico, Perfil
 *
 * Props:
 * - variant: "default" | "elevated" | "outlined" - Define o estilo do card
 * - children: Conteúdo do card
 * - onPress?: Função opcional para tornar o card clicável
 * - style?: Estilos adicionais
 *
 * Exemplos de uso:
 * <Card variant="elevated">Conteúdo aqui</Card>
 * <Card variant="outlined" onPress={() => {}}>Card clicável</Card>
 *
 * Referências no theme.ts:
 * - theme.colors.surface → Cor de fundo
 * - theme.spacing.md → Padding padrão
 * - theme.radii.lg → Border radius
 * - theme.shadow.md → Sombra para variant="elevated"
 * - theme.colors.border → Cor da borda para variant="outlined"
 */

import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Box } from "@gluestack-ui/themed";
import { theme } from "../../config/theme";

type CardVariant = "default" | "elevated" | "outlined";

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({
  variant = "default",
  children,
  onPress,
  style,
}: CardProps) {
  const cardStyles = [
    styles.base,
    variant === "elevated" && styles.elevated,
    variant === "outlined" && styles.outlined,
    style,
  ];

  // Se tiver onPress, retorna um Pressable
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyles,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  // Caso contrário, retorna um Box estático
  return <Box style={cardStyles}>{children}</Box>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
  },
  elevated: {
    ...theme.shadow.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
});
