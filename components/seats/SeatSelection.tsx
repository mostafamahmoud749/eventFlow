'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Info, CalendarDays, MapPin } from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import SeatGrid from '@/components/seats/SeatGrid';
import BookingSummary from '@/components/seats/BookingSummary';
import { createSeats, getTotals } from '@/lib/seats';
import { getAllEvents, getEventHref } from '@/lib/events';
import { formatDate, formatPrice } from '@/lib/format';
import type { Seat } from '@/types';

type SeatSelectionProps = { id: string };

export default function SeatSelection({ id }: SeatSelectionProps) {
  const { data, setData, ready } = useContext(DemoContext);
  const params = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<Seat[]>([]);
  const event = getAllEvents(data.localEvents).find(
    (item) => item.id === (id === 'local' ? params.get('event') : id),
  );
  useEffect(() => {
    if (!ready) return;
    const hold = data.hold;
    setSelected(
      hold?.eventId === event?.id && hold && hold.expiresAt > Date.now() ? hold.seats : [],
    );
  }, [ready, data.hold, event?.id]);
  if (!event || event.status !== 'Published')
    return (
      <div className="page-container py-16">
        <EmptyState
          title={ready ? 'Event not found' : 'Loading…'}
          description="Find an event to choose your seats."
          href="/events"
          label="Explore events"
        />
      </div>
    );
  const purchased = data.bookings
    .filter((booking) => booking.eventId === event.id && booking.id !== 'EF-1042')
    .flatMap((booking) => booking.seats.map((seat) => seat.id));
  const seats = createSeats(event).map((seat) =>
    purchased.includes(seat.id) ? { ...seat, status: 'sold' as const } : seat,
  );

  function toggleSeat(seat: Seat) {
    if (seat.status !== 'available') return;
    setSelected((prev) =>
      prev.some((item) => item.id === seat.id)
        ? prev.filter((item) => item.id !== seat.id)
        : [...prev, seat],
    );
  }

  function continueBooking() {
    if (!event || !selected.length) return;
    const existingHold = data.hold;
    const sameSeats =
      existingHold?.eventId === event.id &&
      existingHold.seats.length === selected.length &&
      selected.every((seat) => existingHold.seats.some((item) => item.id === seat.id));
    const expiresAt =
      sameSeats && existingHold && existingHold.expiresAt > Date.now()
        ? existingHold.expiresAt
        : Date.now() + 10 * 60 * 1000;
    setData((prev) => ({
      ...prev,
      hold: { eventId: event.id, seats: selected, expiresAt },
    }));
    router.push(getEventHref(event, '/checkout'));
  }

  return (
    <div className="page-container pt-7 pb-36 lg:pb-16">
      <div className="border-line mb-7 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <Link href={getEventHref(event)} className="text-muted flex items-center gap-2 text-sm">
          <ArrowLeft className="size-4" />
          Event details
        </Link>
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="text-brand flex items-center gap-2">
            <span className="bg-brand flex size-6 items-center justify-center rounded-full text-white">
              1
            </span>
            Seats
          </span>
          <span className="bg-line h-px w-6" />
          <span className="text-muted">2 · Checkout</span>
          <span className="bg-line h-px w-6" />
          <span className="text-muted">3 · Ticket</span>
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl">A great night. Your favorite seats.</h1>
      {params.get('tier') === 'VIP' && (
        <p className="text-brand mt-3 text-sm">Looking for VIP? Choose a seat in rows A or B.</p>
      )}
      <div className="text-muted mt-4 mb-8 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-ink font-semibold">{event.title}</span>
        <span className="hidden sm:inline">·</span>
        <span className="flex items-center gap-2">
          <CalendarDays className="size-4" />
          {formatDate(event.date, true)}
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="size-4" />
          {event.venue}
        </span>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
        <SeatGrid seats={seats} selected={selected} columns={event.columns} onSelect={toggleSeat} />
        <aside className="border-line rounded-xl border bg-white p-5 lg:sticky lg:top-6">
          <BookingSummary event={event} seats={selected} onRemove={toggleSeat} />
          <Button onClick={continueBooking} disabled={!selected.length} className="mt-6 w-full">
            Continue to checkout <ArrowRight className="size-4" />
          </Button>
          <p className="text-muted mt-4 flex items-start gap-2 text-xs leading-5">
            <Info className="mt-0.5 size-4 shrink-0" />A 10-minute demo hold starts when you
            continue. No real seats are reserved.
          </p>
        </aside>
      </div>
      <div className="border-line shadow-card fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t bg-white px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] lg:hidden">
        <div>
          <p className="text-muted text-xs">{selected.length} seats selected</p>
          <p aria-live="polite" className="mt-1 font-bold">
            {formatPrice(getTotals(selected).total)}
          </p>
        </div>
        <Button disabled={!selected.length} onClick={continueBooking}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
