import type { Event, Seat } from '@/types';

export function createSeats(event: Event): Seat[] {
  const seats: Seat[] = [];
  // Drafts may be incomplete; keep their preview within the simple editor's limits.
  const rows = Math.min(26, Math.max(0, Math.floor(event.rows)));
  const columns = Math.min(20, Math.max(0, Math.floor(event.columns)));
  for (let row = 0; row < rows; row++) {
    for (let number = 1; number <= columns; number++) {
      const label = String.fromCharCode(65 + row);
      const id = `${label}${number}`;
      seats.push({
        id,
        row: label,
        number,
        tier: row < 2 ? 'VIP' : 'Standard',
        price: row < 2 ? event.vipPrice : event.price,
        status: ['C6', 'E8', 'E9', 'F4'].includes(id)
          ? 'sold'
          : ['D5', 'G7'].includes(id)
            ? 'held'
            : 'available',
      });
    }
  }
  return seats;
}

export function getTotals(seats: Seat[]) {
  const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
  const fee = Math.round(subtotal * 0.05 * 100) / 100;
  return { subtotal, fee, total: subtotal + fee };
}
