'use client';

import { useContext, useState } from 'react';
import { DemoContext } from '@/components/common/DemoProvider';
import TicketCard from '@/components/profile/TicketCard';
import EmptyState from '@/components/common/EmptyState';
import { getAllEvents } from '@/lib/events';

export default function MyTickets() {
  const { data } = useContext(DemoContext);
  const [tab, setTab] = useState('upcoming');
  const allEvents = getAllEvents(data.localEvents);
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date());
  const bookings = data.bookings.filter((booking) => {
    const event = allEvents.find((item) => item.id === booking.eventId);
    return event && (tab === 'upcoming' ? event.date >= today : event.date < today);
  });
  return (
    <div className="page-container max-w-[1050px] py-10 lg:py-14">
      <p className="text-brand mb-3 text-xs font-semibold tracking-[2px]">YOUR NEXT GREAT MEMORY</p>
      <h1 className="text-4xl">My tickets</h1>
      <p className="text-muted mt-3">Good plans deserve a place of their own.</p>
      <div className="bg-line/50 mt-8 mb-7 inline-flex gap-1 rounded-lg p-1">
        {['upcoming', 'past'].map((item) => (
          <button
            key={item}
            aria-pressed={tab === item}
            onClick={() => setTab(item)}
            className={`min-h-11 rounded-md px-7 text-sm font-semibold capitalize ${tab === item ? 'text-brand bg-white shadow-sm' : 'text-muted'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="space-y-5">
        {bookings.map((booking) => {
          const event = allEvents.find((item) => item.id === booking.eventId);
          return event ? <TicketCard key={booking.id} booking={booking} event={event} /> : null;
        })}
      </div>
      {!bookings.length && (
        <EmptyState
          title={
            tab === 'past'
              ? 'The best stories are still ahead'
              : 'Your calendar has room for something good'
          }
          description={
            tab === 'past'
              ? 'Your past experiences will appear here after their event date.'
              : 'Find an experience you love and choose your seats to create a demo ticket.'
          }
          href="/events"
          label="Explore events"
        />
      )}
      <p className="text-muted mt-6 text-xs">
        These are sample tickets stored in this browser. No real bookings have been made.
      </p>
    </div>
  );
}
