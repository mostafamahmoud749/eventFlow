'use client';

import { useContext, useState } from 'react';
import { Search } from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import { getAllEvents } from '@/lib/events';
import TicketCard from '@/components/profile/TicketCard';
import EmptyState from '@/components/common/EmptyState';

type ReservationsProps = { eventId?: string };

export default function Reservations({ eventId }: ReservationsProps) {
  const { data } = useContext(DemoContext);
  const [search, setSearch] = useState('');
  const allEvents = getAllEvents(data.localEvents);
  const bookings = data.bookings.filter(
    (booking) =>
      (!eventId || booking.eventId === eventId) &&
      `${booking.id} ${booking.name} ${booking.email}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div>
      {!eventId && (
        <>
          <h1 className="text-3xl">Reservations</h1>
          <p className="text-muted mt-3 mb-7 text-sm">
            A little closer to the people making your event special.
          </p>
        </>
      )}
      <label className="border-line mb-6 flex max-w-md items-center gap-2 rounded-lg border bg-white px-3">
        <Search className="text-muted size-4" />
        <input
          aria-label="Search reservations"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, or booking reference"
          className="min-h-11 w-full bg-transparent text-sm outline-none"
        />
      </label>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const event = allEvents.find((item) => item.id === booking.eventId);
          return event ? <TicketCard key={booking.id} event={event} booking={booking} /> : null;
        })}
      </div>
      {!bookings.length && (
        <EmptyState
          title="No reservations to show"
          description="Try another search, or create a demo booking from an event’s seat map."
        />
      )}
      <p className="text-muted mt-5 text-xs">Sample reservations from this browser only.</p>
    </div>
  );
}
