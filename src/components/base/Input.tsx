/**
 * src/components/input.tsx
 * 🔘 Componente de input reutilizável
 * Usado em várias telas (Signin, SignUp, Perfil)
 * Tema aplicado do arquivo src/config/theme.ts para cores, bordas e tipografia.
 * Dica: este componente pode ser movido dentro de layouts sem quebrar, e a altura pode ser
 * ajustada pelo prop h. O espaçamento interno é controlado pelo px.
 */
import { Input as GluestackInput, InputField } from "@gluestack-ui/themed";
import { ComponentProps } from "react";
import { theme } from "../../config/theme";

// Infer props for the GluestackInput component itself
type GluestackInputProps = ComponentProps<typeof GluestackInput>;

// Update Props to include 'rounded' using the inferred type
type Props = ComponentProps<typeof InputField> & {
  rounded?: GluestackInputProps["rounded"];
};

export function Input({ rounded, ...rest }: Props) {
  return (
    <GluestackInput
      bg={theme.colors.surface}
      h="$14"
      px="$4"
      borderWidth={1}
      borderColor={theme.colors.border}
      rounded={rounded}
      overflow="hidden"
      $focus={{
        borderWidth: 1,
        borderColor: theme.colors.accent,
      }}
    >
      <InputField
        color={theme.colors.text}
        fontFamily={theme.fonts.family.regular}
        placeholderTextColor={theme.colors.muted}
        {...rest}
      />
    </GluestackInput>
  );
}
