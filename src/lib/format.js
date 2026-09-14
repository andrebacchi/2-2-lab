// Formatação numérica — padrão pt-BR (vírgula decimal)

export function fmt(value, decimals = 2) {
  if (value === null || value === undefined || !Number.isFinite(value))
    return '—';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtInt(value) {
  if (value === null || value === undefined || !Number.isFinite(value))
    return '—';
  return value.toLocaleString('pt-BR');
}

export function fmtPct(value, decimals = 1) {
  if (value === null || value === undefined || !Number.isFinite(value))
    return '—';
  return fmt(value * 100, decimals) + '%';
}

// p-valor: nunca arredonda para zero
export function fmtP(p) {
  if (p === null || p === undefined || !Number.isFinite(p)) return '—';
  if (p < 0.001) return '< 0,001';
  if (p < 0.01) return fmt(p, 3);
  return fmt(p, 3);
}

export function fmtMeasure(value, decimals = 2) {
  if (value === null || value === undefined || !Number.isFinite(value))
    return 'Não estimável';
  return fmt(value, decimals);
}

// texto de intervalo de confiança "low – high" ou "não estimável"
export function ciText(ci, decimals = 2) {
  if (
    !ci ||
    ci.low === null ||
    ci.high === null ||
    !Number.isFinite(ci.low) ||
    !Number.isFinite(ci.high)
  )
    return 'não estimável';
  return `${fmt(ci.low, decimals)} – ${fmt(ci.high, decimals)}`;
}