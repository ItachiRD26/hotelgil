export function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function dateRangeYMD(startYMD: string, endYMD: string): string[] {
  const [ys, ms, ds] = startYMD.split("-").map(Number);
  const [ye, me, de] = endYMD.split("-").map(Number);
  const start = new Date(ys, ms - 1, ds);
  const end = new Date(ye, me - 1, de);

  const days: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(toYMD(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}
