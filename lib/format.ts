export function formatPrice(value: number) {
  return `EGP ${new Intl.NumberFormat('en-EG', { maximumFractionDigits: 2 }).format(value)}`;
}

export function formatDate(value: string, short = false) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: short ? 'short' : 'long',
    day: 'numeric',
    month: short ? 'short' : 'long',
    year: 'numeric',
    timeZone: 'Africa/Cairo',
  }).format(new Date(`${value}T12:00:00+02:00`));
}

export function formatTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
}
