'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Check, Clock3, Minus, Plus, RotateCcw, X } from 'lucide-react';
import Seat from '@/components/seats/Seat';
import type { Seat as SeatType } from '@/types';
import { formatPrice } from '@/lib/format';

type SeatGridProps = {
  seats: SeatType[];
  selected: SeatType[];
  columns: number;
  readOnly?: boolean;
  onSelect: (seat: SeatType) => void;
};

export default function SeatGrid({
  seats,
  selected,
  columns,
  onSelect,
  readOnly = false,
}: SeatGridProps) {
  const [size, setSize] = useState(44);
  const map = useRef<HTMLDivElement>(null);
  const rows = [...new Set(seats.map((seat) => seat.row))];

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLButtonElement;
    const index = Number(target.dataset.seatIndex);
    if (!target.dataset.seatIndex) return;
    const offsets: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
    };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    let next = index + offset;
    while (next >= 0 && next < seats.length) {
      if (Math.abs(offset) === 1 && Math.floor(next / columns) !== Math.floor(index / columns))
        return;
      if (seats[next].status === 'available') {
        map.current?.querySelector<HTMLButtonElement>(`[data-seat-index="${next}"]`)?.focus();
        return;
      }
      next += offset;
    }
  }

  return (
    <div className="border-line min-w-0 rounded-xl border bg-white p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl">{readOnly ? 'Seat availability' : 'Find your favorite spot'}</h2>
        <div className="flex gap-1">
          <button
            aria-label="Zoom out seating map"
            disabled={size === 44}
            onClick={() => setSize(size - 8)}
            className="border-line flex size-11 items-center justify-center rounded-lg border disabled:opacity-30"
          >
            <Minus className="size-4" />
          </button>
          <button
            aria-label="Reset seating map zoom"
            onClick={() => setSize(44)}
            className="border-line flex size-11 items-center justify-center rounded-lg border"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            aria-label="Zoom in seating map"
            disabled={size === 68}
            onClick={() => setSize(size + 8)}
            className="border-line flex size-11 items-center justify-center rounded-lg border disabled:opacity-30"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
      <p id="seat-help" className="text-muted mb-4 text-xs">
        {readOnly
          ? 'Scroll or zoom to inspect the seating layout.'
          : 'Scroll to move around the map. Use arrow keys to move between seats, then Enter or Space to select.'}
      </p>
      <div
        ref={map}
        onKeyDown={handleKeyDown}
        role="group"
        aria-label={readOnly ? 'Seat availability preview' : 'Interactive seating map'}
        aria-describedby="seat-help"
        className="bg-canvas overflow-auto overscroll-x-contain rounded-xl p-4 sm:p-6"
      >
        <div className="mx-auto w-max min-w-full">
          <div className="border-brand/30 bg-brand/10 text-brand mx-auto mb-7 w-4/5 rounded-t-[50%] border-t-4 py-4 text-center text-sm font-semibold tracking-[5px]">
            STAGE
          </div>
          {rows.map((row, rowIndex) => {
            const rowSeats = seats.filter((seat) => seat.row === row);
            return (
              <div key={row}>
                {(rowIndex === 0 || rowIndex === 2) && (
                  <div className="mt-5 mb-4 text-center">
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold ${rowIndex === 0 ? 'bg-coral/15 text-[#8f3926]' : 'bg-brand/10 text-brand'}`}
                    >
                      {rowIndex === 0 ? 'VIP' : 'STANDARD'} · {formatPrice(rowSeats[0].price)}
                    </span>
                  </div>
                )}
                <div className="mb-2 flex items-center justify-center gap-1.5">
                  <span className="text-muted w-6 shrink-0 text-xs font-semibold">{row}</span>
                  {rowSeats.map((seat, column) => (
                    <div key={seat.id} className={column === Math.ceil(columns / 2) ? 'ml-4' : ''}>
                      <Seat
                        seat={seat}
                        selected={selected.some((item) => item.id === seat.id)}
                        size={size}
                        index={rowIndex * columns + column}
                        onSelect={onSelect}
                        readOnly={readOnly}
                      />
                    </div>
                  ))}
                  <span className="text-muted ml-1 w-4 shrink-0 text-xs font-semibold">{row}</span>
                </div>
              </div>
            );
          })}
          <p className="text-muted mt-5 text-center text-[10px] font-medium tracking-[3px]">
            REAR OF VENUE
          </p>
        </div>
      </div>
      <div className="text-muted mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className="border-brand/30 flex size-5 items-center justify-center rounded border bg-white text-[10px]">
            12
          </span>
          Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="border-amber/40 text-amber size-5 rounded border bg-amber-50 p-0.5" />
          Held
        </span>
        <span className="inline-flex items-center gap-1.5">
          <X className="bg-line size-5 rounded p-0.5" />
          Sold
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="bg-brand size-5 rounded p-0.5 text-white" />
          Selected
        </span>
      </div>
    </div>
  );
}
