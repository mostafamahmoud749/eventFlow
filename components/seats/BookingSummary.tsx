import Image from 'next/image';
import { X, MapPin, CalendarDays } from 'lucide-react';
import type { Event, Seat } from '@/types';
import { formatDate, formatPrice } from '@/lib/format';
import { getTotals } from '@/lib/seats';

type BookingSummaryProps = { event: Event; seats: Seat[]; onRemove?: (seat: Seat) => void };

export default function BookingSummary({ event, seats, onRemove }: BookingSummaryProps) {
  const { subtotal, fee, total } = getTotals(seats);
  return (
    <>
      <h2 className="mb-5 text-xl">Your {onRemove ? 'seats' : 'order summary'}</h2>
      <div className="relative mb-4 h-36 overflow-hidden rounded-lg">
        <Image src={event.image} alt="" fill sizes="340px" className="object-cover" />
      </div>
      <h3 className="text-lg">{event.title}</h3>
      <p className="text-muted mt-3 mb-2 flex items-center gap-2 text-xs">
        <CalendarDays className="size-3.5" />
        {formatDate(event.date, true)}
      </p>
      <p className="text-muted flex items-center gap-2 text-xs">
        <MapPin className="size-3.5" />
        {event.venue}
      </p>
      <div aria-live="polite" className="border-line mt-5 border-y py-4">
        {!seats.length ? (
          <p className="text-muted py-3 text-center text-sm leading-6">
            Your perfect seat is waiting.
            <br />
            Choose one on the map to get started.
          </p>
        ) : (
          <ul className="max-h-60 space-y-3 overflow-auto">
            {seats.map((seat) => (
              <li key={seat.id} className="flex items-center gap-2 text-xs">
                <span
                  className={`rounded px-2 py-1 font-medium ${seat.tier === 'VIP' ? 'bg-coral/15 text-[#8f3926]' : 'bg-mint text-brand'}`}
                >
                  {seat.tier}
                </span>
                <strong>{seat.id}</strong>
                <span className="ml-auto">{formatPrice(seat.price)}</span>
                {onRemove && (
                  <button
                    aria-label={`Remove seat ${seat.id}`}
                    onClick={() => onRemove(seat)}
                    className="hover:bg-canvas flex size-8 items-center justify-center rounded"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">
            Subtotal ({seats.length} {seats.length === 1 ? 'seat' : 'seats'})
          </dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Service fee (5%)</dt>
          <dd>{formatPrice(fee)}</dd>
        </div>
        <div className="border-line flex justify-between border-t pt-4 text-lg font-bold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
    </>
  );
}
