/**
 * src/components/base/Button.tsx
 * 🔘 Componente Button Reutilizável
 *
 * Usado em: Todas as telas (Login, SignUp, Home, Perfil, Metas)
 *
 * Props:
 * - title: Texto do botão
 * - variant: "solid" | "outline" - Estilo do botão
 * - isLoading: Boolean para mostrar loading spinner
 * - ...rest: Todas as props do Button do gluestack
 *
 * Referências no theme.ts:
 * - theme.colors.orange500 → Cor primária do botão solid (LARANJA)
 * - theme.colors.orange700 → Cor do botão ao pressionar
 * - theme.colors.surface → Cor do texto no botão solid
 * - theme.colors.orange500 → Cor do texto no botão outline
 * - theme.colors.border → Cor da borda no botão outline
 */

import { ComponentProps } from "react";

import {
  Button as GluestackButton,
  Text,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { theme } from "../../config/theme";

type Props = ComponentProps<typeof GluestackButton> & {
  title: string;
  variant?: "solid" | "outline";
  isLoading?: boolean;
};

export function Button({
  title,
  variant = "solid",
  isLoading,
  ...rest
}: Props) {
  return (
    <GluestackButton
      w="$full"
      h="$14"
      bg={variant === "outline" ? "transparent" : theme.colors.orange500}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor={
        variant === "outline" ? theme.colors.orange500 : "transparent"
      }
      rounded={theme.radii.md}
      disabled={isLoading}
      style={{
        backgroundColor:
          variant === "outline" ? "transparent" : theme.colors.orange500,
      }}
      $pressed={{
        bg:
          variant === "outline" ? theme.colors.gray200 : theme.colors.orange700,
      }}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner color={theme.colors.surface} />
      ) : (
        <Text
          color={
            variant === "outline" ? theme.colors.orange500 : theme.colors.surface
          }
          fontFamily={theme.fonts.family.bold}
          fontSize={theme.fonts.sizes.md}
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  );
}
