export function toCurrency(value) {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (!value) return formatter.format(0);

  return formatter.format(value);
}
