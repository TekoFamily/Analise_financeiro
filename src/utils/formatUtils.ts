// Funções utilitárias para formatação

export function formatCurrency(value: number | string): string {
  const num = typeof value === "string" ? Number(value.replace(/\D/g, "")) / 100 : value;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseCurrency(formatted: string): number {
  const numeric = formatted.replace(/\D/g, "");
  return numeric ? Number(numeric) / 100 : 0;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

export function formatCurrencyInput(rawValue: string): string {
  if (!rawValue) return "";
  const numericValueInput = parseFloat(rawValue.replace(/[^\d]/g, ''));
  if (isNaN(numericValueInput)) return "";

  const numericValue = (numericValueInput / 100).toFixed(2);
  const [integerPart, decimalPart] = numericValue.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${formattedInteger},${decimalPart}`;
}

export function parseCurrencyInput(formattedValue: string): string {
  if (!formattedValue) return "";
  return formattedValue.replace(/[^\d,]/g, '').replace(',', '.');
}

export function formatCurrencyDisplay(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getIconForCategory(categoria: string): string {
  const categoriaLower = categoria.toLowerCase();
  if (categoriaLower === "mercado") return "🛒";
  if (categoriaLower === "lazer") return "🎉";
  if (categoriaLower === "transporte") return "🚗";
  return "💰";
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

