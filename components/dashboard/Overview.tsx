'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Coins, Plus, Ticket, Users } from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import EventList from '@/components/dashboard/EventList';
import { getAllEvents } from '@/lib/events';
import { formatPrice } from '@/lib/format';

export default function Overview() {
  const { data } = useContext(DemoContext);
  const organizerEvents = getAllEvents(data.localEvents).filter(
    (event) =>
      event.organizer === 'Nile Live' || data.localEvents.some((item) => item.id === event.id),
  );
  const bookings = data.bookings.filter((booking) =>
    organizerEvents.some((event) => event.id === booking.eventId),
  );
  const totalSeats = bookings.reduce((sum, booking) => sum + booking.seats.length, 0);
  const revenue = bookings.reduce(
    (sum, booking) => sum + booking.seats.reduce((total, seat) => total + seat.price, 0),
    0,
  );
  const stats = [
    { label: 'Ticket revenue', value: formatPrice(revenue), icon: Coins },
    { label: 'Demo bookings', value: bookings.length, icon: Ticket },
    { label: 'Tickets booked', value: totalSeats, icon: Users },
    { label: 'Your events', value: organizerEvents.length, icon: CalendarDays },
  ];
  return (
    <>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-brand mb-2 text-xs font-semibold tracking-[2px]">
            GOOD THINGS START WITH YOU
          </p>
          <h1 className="text-3xl lg:text-4xl">Welcome back, {data.user.name.split(' ')[0]}.</h1>
          <p className="text-muted mt-3 text-sm">
            Here’s what’s happening in your corner of EventFlow.
          </p>
        </div>
        <Link href="/dashboard/events/new" className="primary-link">
          <Plus className="size-4" />
          Create event
        </Link>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="border-line rounded-xl border bg-white p-6">
            <span className="bg-mint text-brand mb-4 flex size-10 items-center justify-center rounded-lg">
              <Icon className="size-5" />
            </span>
            <p className="text-muted text-xs">{label}</p>
            <p className="font-heading mt-2 text-2xl font-bold">{value}</p>
            <p className="text-muted mt-3 text-[11px]">From your local demo data</p>
          </div>
        ))}
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl">Your next big moments</h2>
        <Link
          href="/dashboard/events"
          className="text-brand flex items-center gap-2 text-sm font-semibold"
        >
          All events <ArrowRight className="size-4" />
        </Link>
      </div>
      <EventList events={organizerEvents.slice(0, 4)} />
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="border-line rounded-xl border bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl">Recent reservations</h2>
            <Link href="/dashboard/reservations" className="text-brand text-xs font-semibold">
              View all
            </Link>
          </div>
          {bookings
            .slice(-3)
            .reverse()
            .map((booking) => (
              <Link
                key={booking.id}
                href={`/dashboard/events/manage?id=${booking.eventId}&tab=Reservations`}
                className="border-line flex items-center justify-between gap-3 border-t py-4"
              >
                <div>
                  <p className="text-sm font-medium">{booking.name}</p>
                  <p className="text-muted mt-1 text-xs">
                    {booking.id} · {booking.seats.length} seats
                  </p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(booking.total)}</span>
              </Link>
            ))}
        </div>
        <div className="bg-mint relative overflow-hidden rounded-xl p-7">
          <span className="border-brand/5 absolute -top-10 -right-10 size-40 rounded-full border-[24px]" />
          <p className="text-brand text-xs font-semibold tracking-wider">
            MAKE YOUR NEXT IDEA HAPPEN
          </p>
          <h2 className="mt-4 mb-3 max-w-sm text-2xl">
            Small gatherings.
            <br />
            Big memories.
          </h2>
          <p className="text-muted max-w-sm text-sm leading-6">
            From the first detail to the very last seat, your next event starts right here.
          </p>
          <Link
            href="/dashboard/events/new"
            className="text-brand mt-5 inline-flex items-center gap-2 text-sm font-semibold"
          >
            Create something great <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <p className="text-muted mt-6 text-xs">
        Demo figures are calculated from local sample bookings. Ticket revenue excludes service
        fees.
      </p>
    </>
  );
}
