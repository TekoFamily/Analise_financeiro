/**
 * src/components/base/Typography.tsx
 * 📝 Componentes de Tipografia Reutilizáveis
 *
 * Componentes disponíveis:
 * - Heading: Títulos e cabeçalhos (usa fontFamily bold)
 * - Body: Texto de corpo/parágrafos (usa fontFamily regular)
 * - Caption: Texto pequeno/legendas (usa fontFamily regular)
 *
 * Props compartilhadas:
 * - size?: Tamanho do texto (xs, sm, md, lg, xl, 2xl)
 * - color?: Cor do texto (aceita qualquer cor do theme ou custom)
 * - muted?: Boolean para aplicar cor muted (texto secundário)
 * - align?: Alinhamento do texto (left, center, right, justify)
 * - children: Conteúdo do texto
 *
 * Exemplos de uso:
 * <Heading size="xl">Título Principal</Heading>
 * <Body muted>Texto secundário em cinza</Body>
 * <Caption align="center">Legenda centralizada</Caption>
 *
 * Referências no theme.ts:
 * - theme.fonts.family.bold → Fonte negrito para Heading
 * - theme.fonts.family.regular → Fonte regular para Body e Caption
 * - theme.fonts.sizes.* → Tamanhos de fonte (xs, sm, md, lg, xl, 2xl)
 * - theme.colors.text → Cor padrão de texto
 * - theme.colors.muted → Cor de texto secundário/desabilitado
 */

import React from "react";
import { Text } from "@gluestack-ui/themed";
import { theme } from "../../config/theme";

type FontSize = keyof typeof theme.fonts.sizes;
type TextAlign = "left" | "center" | "right" | "justify";

interface BaseTextProps {
  size?: FontSize;
  color?: string;
  muted?: boolean;
  align?: TextAlign;
  children: React.ReactNode;
  numberOfLines?: number;
  style?: any;
}

/**
 * 🔤 Heading - Componente para títulos e cabeçalhos
 * Usa fonte bold por padrão
 */
export function Heading({
  size = "lg",
  color,
  muted = false,
  align = "left",
  children,
  numberOfLines,
  style,
}: BaseTextProps) {
  const textColor = color || (muted ? theme.colors.muted : theme.colors.text);

  return (
    <Text
      fontSize={theme.fonts.sizes[size]}
      fontFamily={theme.fonts.family.bold}
      color={textColor}
      textAlign={align}
      numberOfLines={numberOfLines}
      style={style}
    >
      {children}
    </Text>
  );
}

/**
 * 📄 Body - Componente para texto de corpo/parágrafos
 * Usa fonte regular por padrão
 */
export function Body({
  size = "md",
  color,
  muted = false,
  align = "left",
  children,
  numberOfLines,
  style,
}: BaseTextProps) {
  const textColor = color || (muted ? theme.colors.muted : theme.colors.text);

  return (
    <Text
      fontSize={theme.fonts.sizes[size]}
      fontFamily={theme.fonts.family.regular}
      color={textColor}
      textAlign={align}
      numberOfLines={numberOfLines}
      style={style}
    >
      {children}
    </Text>
  );
}

/**
 * 🔖 Caption - Componente para texto pequeno/legendas
 * Usa fonte regular e tamanho xs por padrão
 */
export function Caption({
  size = "xs",
  color,
  muted = true, // Captions geralmente são muted por padrão
  align = "left",
  children,
  numberOfLines,
  style,
}: BaseTextProps) {
  const textColor = color || (muted ? theme.colors.muted : theme.colors.text);

  return (
    <Text
      fontSize={theme.fonts.sizes[size]}
      fontFamily={theme.fonts.family.regular}
      color={textColor}
      textAlign={align}
      numberOfLines={numberOfLines}
      style={style}
    >
      {children}
    </Text>
  );
}
