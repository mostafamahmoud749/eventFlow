import { Check, Clock3, X } from 'lucide-react';
import type { Seat as SeatType } from '@/types';
import { formatPrice } from '@/lib/format';

type SeatProps = {
  seat: SeatType;
  selected: boolean;
  size: number;
  index: number;
  readOnly?: boolean;
  onSelect: (seat: SeatType) => void;
};

export default function Seat({
  seat,
  selected,
  size,
  index,
  onSelect,
  readOnly = false,
}: SeatProps) {
  const unavailable = seat.status !== 'available';
  return (
    <button
      type="button"
      data-seat-index={index}
      disabled={unavailable || readOnly}
      aria-pressed={selected}
      aria-label={`${seat.row}${seat.number}, ${seat.tier}, ${formatPrice(seat.price)}, ${selected ? 'selected' : seat.status}`}
      onClick={() => onSelect(seat)}
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition ${selected ? 'border-brand bg-brand text-white shadow-sm' : seat.status === 'sold' ? 'border-line bg-line text-muted' : seat.status === 'held' ? 'border-amber/40 text-amber bg-amber-50' : seat.tier === 'VIP' ? 'border-coral/45 text-ink hover:bg-coral/15 bg-white' : 'border-brand/30 text-ink hover:bg-mint bg-white'} disabled:cursor-not-allowed`}
    >
      {selected ? (
        <Check className="size-4" />
      ) : seat.status === 'sold' ? (
        <X className="size-4" />
      ) : seat.status === 'held' ? (
        <Clock3 className="size-4" />
      ) : (
        seat.number
      )}
    </button>
  );
}
