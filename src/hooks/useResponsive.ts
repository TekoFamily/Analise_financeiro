/**
 * src/hooks/useResponsive.ts
 * 📱 Hook para Design Responsivo
 *
 * Retorna informações sobre o tamanho da tela e breakpoints
 * para adaptar layouts e componentes conforme o dispositivo
 *
 * Breakpoints:
 * - isSmall: width < 375 (dispositivos pequenos)
 * - isMedium: 375 <= width < 768 (smartphones normais)
 * - isLarge: width >= 768 (tablets e maiores)
 *
 * Valores úteis:
 * - cardWidth: Largura sugerida para cards (45% em telas grandes, 92% em pequenas)
 * - inputWidth: Largura sugerida para inputs
 * - columns: Número de colunas para grids
 * - spacing: Espaçamento adaptativo
 *
 * Exemplos de uso:
 * const { isSmall, cardWidth, columns } = useResponsive();
 * <Box w={cardWidth}>...</Box>
 * <Grid columns={columns}>...</Grid>
 *
 * Referências no theme.ts:
 * - theme.spacing.* → Espaçamentos adaptativos por tamanho de tela
 */

import { useWindowDimensions } from "react-native";
import { useMemo } from "react";
import { theme } from "../config/theme";

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const responsive = useMemo(() => {
    // 📐 Breakpoints
    const isSmall = width < 375;
    const isMedium = width >= 375 && width < 768;
    const isLarge = width >= 768;
    const isExtraLarge = width >= 1024;

    // 📏 Larguras sugeridas
    const cardWidth = isLarge ? "45%" : isSmall ? "90%" : "92%";
    const inputWidth = isLarge ? "80%" : "100%";
    const modalWidth = isLarge ? "60%" : "90%";

    // 🔢 Número de colunas para grids
    const columns = isExtraLarge ? 4 : isLarge ? 3 : isMedium ? 2 : 1;

    // 📏 Espaçamentos adaptativos
    const spacing = {
      xs: isSmall ? theme.spacing.xs : theme.spacing.sm,
      sm: isSmall ? theme.spacing.sm : theme.spacing.md,
      md: isSmall ? theme.spacing.md : theme.spacing.lg,
      lg: isSmall ? theme.spacing.lg : theme.spacing.xl,
      xl: isSmall ? theme.spacing.xl : theme.spacing["2xl"],
    };

    // 📝 Tamanhos de fonte adaptativos
    const fontSize = {
      xs: isSmall ? theme.fonts.sizes.xs - 1 : theme.fonts.sizes.xs,
      sm: isSmall ? theme.fonts.sizes.sm - 1 : theme.fonts.sizes.sm,
      md: isSmall ? theme.fonts.sizes.md - 1 : theme.fonts.sizes.md,
      lg: isSmall ? theme.fonts.sizes.lg - 2 : theme.fonts.sizes.lg,
      xl: isSmall ? theme.fonts.sizes.xl - 2 : theme.fonts.sizes.xl,
    };

    // 🎨 Padding/margem sugeridos para containers
    const containerPadding = isSmall
      ? theme.spacing.sm
      : isMedium
      ? theme.spacing.md
      : theme.spacing.lg;

    // 📐 Altura de componentes
    const buttonHeight = isSmall ? 48 : 56;
    const inputHeight = isSmall ? 44 : 52;
    const headerHeight = isSmall ? 56 : 64;

    // 🖼️ Dimensões úteis
    const screenWidth = width;
    const screenHeight = height;
    const isPortrait = height > width;
    const isLandscape = width > height;

    return {
      // Breakpoints
      isSmall,
      isMedium,
      isLarge,
      isExtraLarge,

      // Larguras
      cardWidth,
      inputWidth,
      modalWidth,
      screenWidth,
      screenHeight,

      // Layout
      columns,
      isPortrait,
      isLandscape,

      // Espaçamentos
      spacing,
      containerPadding,

      // Tamanhos
      fontSize,
      buttonHeight,
      inputHeight,
      headerHeight,
    };
  }, [width, height]);

  return responsive;
}
