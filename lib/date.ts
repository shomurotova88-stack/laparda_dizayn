// Format date to Tashkent Time (UTC+5)
export function formatTashkentTime(isoString: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  return new Intl.DateTimeFormat('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d);
}
