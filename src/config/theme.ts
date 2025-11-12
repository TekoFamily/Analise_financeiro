/**
 * src/config/theme.ts
 *
 * 🎨 Este arquivo centraliza todas as configurações de design da aplicação.
 * A ideia é que toda cor, tipografia, espaçamento e tamanhos utilizados no app
 * sejam definidos aqui para facilitar manutenção, padronização e evolução do design.
 *
 * Como usar:
 *  - Importar: import { theme } from '@src/config/theme';
 *  - Exemplo: style={{ backgroundColor: theme.colors.background, padding: theme.spacing.md }}
 *
 * Observação sobre fontes:
 *  - No App você já carrega Roboto (Roboto_400Regular / Roboto_700Bold).
 *  - Certifique-se de usar os nomes abaixo em componentes que aceitem fontFamily.
 */

export type Theme = typeof theme;

// 🧱 Paleta de cores principal do app
// - Use os nomes semânticos (primary, secondary, danger, etc.) nos componentes.
// - Evite usar hex direto em componentes para manter tudo centralizado.
const colors = {
  // Básicas
  primary: "#3B82F6", // Azul principal (ações primárias)
  secondary: "#10B981", // Verde destaque (ações secundárias)
  accent: "#F59E0B", // Laranja de ênfase (destaques, CTAs)
  background: "#F9FAFB", // Fundo geral da aplicação
  surface: "#FFFFFF", // Cartões, caixas e elementos em destaque
  text: "#111827", // Texto principal
  muted: "#6B7280", // Texto secundário / desabilitado
  border: "#E5E7EB", // Bordas e divisores

  // Feedback
  success: "#22C55E", // Sucesso/positivo
  warning: "#F59E0B", // Atenção/aviso
  danger: "#EF4444", // Erros/negativo
  info: "#0EA5E9", // Informações

  // Auxiliares
  overlay: "rgba(0,0,0,0.5)",

  // Escala de cinza para nuances
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  // Escala de laranja (usado em Home, ResumoDoMes, Metas)
  orange50: "#FFF7ED",
  orange100: "#FFEDD5",
  orange200: "#FED7AA",
  orange300: "#FDBA74",
  orange400: "#FB923C",
  orange500: "#FF9100", // Laranja principal do app
  orange600: "#EA580C",
  orange700: "#C2410C",
  orange800: "#9A3412",
  orange900: "#7C2D12",

  // Escala de verde (usado em Button, badges, sucesso)
  green50: "#F0FDF4",
  green100: "#DCFCE7",
  green200: "#BBF7D0",
  green300: "#86EFAC",
  green400: "#4ADE80",
  green500: "#22C55E",
  green600: "#16A34A",
  green700: "#15803D",
  green800: "#166534",
  green900: "#14532D",

  // Escala de azul (usado em cards de despesas)
  blue50: "#EFF6FF",
  blue100: "#DBEAFE",
  blue200: "#BFDBFE",
  blue300: "#93C5FD",
  blue400: "#60A5FA",
  blue500: "#3B82F6",
  blue600: "#2563EB",
  blue700: "#1D4ED8",
  blue800: "#1E40AF",
  blue900: "#1E3A8A",

  // Escala de vermelho (usado em erros, metas expiradas)
  red50: "#FEF2F2",
  red100: "#FEE2E2",
  red200: "#FECACA",
  red300: "#FCA5A5",
  red400: "#F87171",
  red500: "#EF4444",
  red600: "#DC2626",
  red700: "#B91C1C",
  red800: "#991B1B",
  red900: "#7F1D1D",
} as const;

// 🔤 Tipografia
// - Os nomes das fontes devem corresponder às que são carregadas no App.
// - As "sizes" são em dp (React Native).
const fonts = {
  family: {
    regular: "Roboto_400Regular", // Fonte padrão do corpo de texto
    bold: "Roboto_700Bold", // Títulos e destaques
    // Adicione variações se necessário (medium, italic, etc.)
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16, // Tamanho padrão de parágrafo
    lg: 20,
    xl: 24,
    "2xl": 32, // Títulos maiores
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.3,
    relaxed: 1.5,
  },
} as const;

// 📏 Espaçamentos
// - Utilize sempre theme.spacing.* ao invés de valores "mágicos" diretamente.
// - Facilitam ajustes gerais de espaçamento de forma consistente.
const spacing = {
  xs: 4,
  sm: 8,
  md: 16, // Espaço padrão
  lg: 24,
  xl: 32,
  "2xl": 40,
} as const;

// 📐 Raios de borda
// - Padroniza cantos arredondados.
const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// 🌫️ Sombras (iOS) / Elevação (Android)
// - Use para dar profundidade a cartões e elementos de destaque.
// - Em RN, shadow* impacta iOS, elevation impacta Android.
const shadow = {
  // Sombra leve, para cartões básicos
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // Sombra média, para cartões em maior destaque
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  // Sombra forte, para modais/popovers
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

// ⚙️ Outros tokens úteis
const other = {
  opacity: {
    disabled: 0.5, // Opacidade padrão para elementos desabilitados
  },
  zIndex: {
    dropdown: 1000,
    modal: 1100,
    toast: 1200,
  },
} as const;

// 🧩 Tema central exportado
// - Este objeto deve ser importado onde for necessário aplicar design consistente.
export const theme = {
  colors,
  fonts,
  spacing,
  radii,
  shadow,
  other,

  animations: {
    buttonPress: {
      scale: 0.96,
      opacity: 0.9,
      duration: 150,
    },
    buttonHover: {
      scale: 1.02,
      duration: 200,
    }
  }



} as const;


// 🛠️ Helpers opcionais

// Retorna um espaçamento a partir de chave (xs, sm, md, ...) ou número direto
export const space = (keyOrValue: keyof typeof spacing | number): number => {
  if (typeof keyOrValue === "number") return keyOrValue;
  return spacing[keyOrValue];
};

// Retorna um tamanho de fonte tipado
export const fontSize = (key: keyof typeof fonts.sizes): number =>
  fonts.sizes[key];

// Retorna um raio de borda tipado
export const radius = (key: keyof typeof radii): number => radii[key];

// Tipos úteis para cores tipadas
export type ThemeColor = keyof typeof colors;

// Exemplo de uso em estilo inline (comentado):
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     padding: theme.spacing.md, // 🧭 Controle central de espaçamento
//   },
//   title: {
//     color: theme.colors.text,
//     fontSize: theme.fonts.sizes.xl,
//     fontFamily: theme.fonts.family.bold,
//   },
// });
