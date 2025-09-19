// Normaliza string tipo datetime-local a YYYY-MM-DD
export const normalizeDate = (iso: string) => {
  if (!iso) return "";
  return iso.split("T")[0];
};

// Convierte YYYY-MM-DD → DD/MM/YYYY
export const toLocalDMY = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
