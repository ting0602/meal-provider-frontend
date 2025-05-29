export const formatTime = (isoString: string): string => {
  if (!isoString) return '';

  const date = new Date(isoString);
  return date.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '/'); // 2025/05/29 13:00
};
