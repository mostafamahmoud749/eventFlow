'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, MapPin, Ticket, ChevronDown, Download } from 'lucide-react';
import type { Booking, Event } from '@/types';
import Button from '@/components/common/Button';
import { formatDate, formatPrice, formatTime } from '@/lib/format';

type TicketCardProps = {
  booking: Booking;
  event: Event;
  expanded?: boolean;
};

export default function TicketCard({ booking, event, expanded = false }: TicketCardProps) {
  const [open, setOpen] = useState(expanded);

  function downloadTicket() {
    const text = `EVENTFLOW — DEMO TICKET (NOT VALID FOR ADMISSION)\n\n${event.title}\n${formatDate(event.date)} at ${formatTime(event.time)} (Africa/Cairo)\n${event.venue}, ${event.city}\n\nAttendee: ${booking.name}\nEmail: ${booking.email}\nSeats: ${booking.seats.map((seat) => `${seat.id} (${seat.tier})`).join(', ')}\nTotal: ${formatPrice(booking.total)}\nReference: ${booking.id}\n\nFrontend demonstration only. No reservation or payment was made.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${booking.id}-demo-ticket.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article
      id={booking.id}
      className="border-line scroll-mt-6 overflow-hidden rounded-xl border bg-white p-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-40 overflow-hidden rounded-lg sm:h-28 sm:w-40 sm:shrink-0">
          <Image src={event.image} alt="" fill sizes="400px" className="object-cover" />
        </div>
        <div className="flex-1">
          <span className="text-brand text-xs font-medium">Demo booking · {booking.id}</span>
          <h2 className="mt-1 mb-3 text-xl">{event.title}</h2>
          <p className="text-muted mb-2 flex items-center gap-2 text-xs">
            <CalendarDays className="size-3.5" />
            {formatDate(event.date, true)} · {formatTime(event.time)}
          </p>
          <p className="text-muted flex items-center gap-2 text-xs">
            <MapPin className="size-3.5" />
            {event.venue}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <span className="text-sm font-semibold">{formatPrice(booking.total)}</span>
          <Button variant="secondary" onClick={() => setOpen(!open)} aria-expanded={open}>
            <Ticket className="size-4" />
            {open ? 'Hide ticket' : 'View ticket'}
            <ChevronDown className={`size-4 transition ${open ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-line mt-6 border-t border-dashed pt-6">
          <div className="border-brand/15 bg-mint/30 grid gap-5 rounded-lg border p-5 sm:grid-cols-2">
            <div>
              <p className="text-brand mb-2 text-xs font-semibold tracking-widest">
                DEMO ADMISSION PASS
              </p>
              <h3 className="text-lg">{event.title}</h3>
              <p className="text-muted mt-3 text-sm">{booking.name}</p>
              <p className="text-muted mt-1 text-xs">{booking.email}</p>
            </div>
            <div>
              <p className="text-muted mb-3 text-xs">Your seats</p>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat) => (
                  <span
                    key={seat.id}
                    className="border-brand/15 text-brand rounded-full border bg-white px-3 py-1 text-xs font-semibold"
                  >
                    {seat.tier} · {seat.id}
                  </span>
                ))}
              </div>
              <p className="text-muted mt-4 text-xs">
                Booking reference <strong className="text-ink ml-2">{booking.id}</strong>
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted text-xs">Sample ticket. Not valid for admission.</p>
            <Button variant="secondary" onClick={downloadTicket}>
              <Download className="size-4" />
              Download demo ticket
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
