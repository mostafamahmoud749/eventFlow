'use client';

import { useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Pencil,
  Ticket,
  Users,
  Armchair,
  Info,
} from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import EmptyState from '@/components/common/EmptyState';
import Reservations from '@/components/dashboard/Reservations';
import SeatGrid from '@/components/seats/SeatGrid';
import { getAllEvents, getEventHref } from '@/lib/events';
import { formatDate, formatPrice } from '@/lib/format';
import { createSeats } from '@/lib/seats';

export default function ManageEvent() {
  const { data, ready } = useContext(DemoContext);
  const params = useSearchParams();
  const router = useRouter();
  const event = getAllEvents(data.localEvents).find((item) => item.id === params.get('id'));
  const tab = params.get('tab') || 'Overview';
  if (!event)
    return (
      <EmptyState
        title={ready ? 'Event not found' : 'Loading event…'}
        description="Pick an event from your organizer workspace to manage its details."
        href="/dashboard/events"
        label="My events"
      />
    );
  const bookings = data.bookings.filter((booking) => booking.eventId === event.id);
  const purchased = bookings
    .filter((booking) => booking.id !== 'EF-1042')
    .flatMap((booking) => booking.seats.map((seat) => seat.id));
  const seats = createSeats(event).map((seat) =>
    purchased.includes(seat.id) ? { ...seat, status: 'sold' as const } : seat,
  );
  const sold = seats.filter((seat) => seat.status === 'sold').length;
  const held = seats.filter((seat) => seat.status === 'held').length;

  function changeTab(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set('tab', value);
    router.replace(`/dashboard/events/manage?${next.toString()}`, { scroll: false });
  }

  return (
    <>
      <Link
        href="/dashboard/events"
        className="text-muted mb-6 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="size-4" />
        My events
      </Link>
      {params.get('created') === 'true' && (
        <p
          role="status"
          className="bg-mint text-brand mb-6 flex items-center gap-2 rounded-lg p-4 text-sm"
        >
          <CheckCircle2 className="size-5" />
          Your event is published in this browser’s demo. You can find it in Explore events.
        </p>
      )}
      <div className="border-line flex flex-col gap-5 rounded-xl border bg-white p-5 md:flex-row md:items-center">
        <div className="relative h-44 overflow-hidden rounded-lg md:h-32 md:w-44 md:shrink-0">
          <Image src={event.image} alt="" fill sizes="400px" className="object-cover" />
        </div>
        <div className="flex-1">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${event.status === 'Published' ? 'bg-mint text-brand' : 'text-amber bg-amber-50'}`}
          >
            {event.status} · demo
          </span>
          <h1 className="mt-3 mb-3 text-2xl lg:text-3xl">{event.title}</h1>
          <p className="text-muted mb-2 flex items-center gap-2 text-xs">
            <CalendarDays className="size-4" />
            {event.date ? formatDate(event.date) : 'Date to be added'}
          </p>
          <p className="text-muted flex items-center gap-2 text-xs">
            <MapPin className="size-4" />
            {event.venue || 'Venue to be added'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:flex-col">
          {event.status === 'Published' && (
            <Link href={getEventHref(event)} className="secondary-link">
              View event <ArrowUpRight className="size-4" />
            </Link>
          )}
          <Link href={`/dashboard/events/new?edit=${event.id}`} className="primary-link">
            <Pencil className="size-4" />
            Edit event
          </Link>
        </div>
      </div>
      <nav
        aria-label="Event management sections"
        className="border-line mt-7 mb-7 flex gap-1 overflow-auto border-b"
      >
        {['Overview', 'Reservations', 'Seating', 'Settings'].map((item) => (
          <button
            key={item}
            aria-current={tab === item ? 'page' : undefined}
            onClick={() => changeTab(item)}
            className={`min-h-12 shrink-0 border-b-2 px-5 text-sm font-semibold ${tab === item ? 'border-brand text-brand' : 'text-muted hover:text-brand border-transparent'}`}
          >
            {item}
          </button>
        ))}
      </nav>
      {tab === 'Overview' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Capacity', value: seats.length, icon: Users },
              { label: 'Sold seats', value: sold, icon: Ticket },
              { label: 'Sample holds', value: held, icon: Clock3 },
              { label: 'Available', value: seats.length - sold - held, icon: Armchair },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="border-line rounded-xl border bg-white p-5">
                <Icon className="text-brand mb-3 size-5" />
                <p className="text-muted text-xs">{label}</p>
                <p className="mt-2 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
          <div className="border-line mt-6 rounded-xl border bg-white p-6">
            <h2 className="mb-5 text-xl">Ticket tiers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-line text-muted border-b text-xs">
                  <tr>
                    <th className="pb-3 font-medium">Tier</th>
                    <th className="pb-3 font-medium">Capacity</th>
                    <th className="pb-3 text-right font-medium">Price per seat</th>
                  </tr>
                </thead>
                <tbody>
                  {['VIP', 'Standard'].map((tier) => (
                    <tr key={tier} className="border-line border-b last:border-0">
                      <td className="py-4 font-medium">{tier}</td>
                      <td>{seats.filter((seat) => seat.tier === tier).length} seats</td>
                      <td className="text-right">
                        {formatPrice(tier === 'VIP' ? event.vipPrice : event.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted mt-4 text-xs">
              {event.rows} rows × {event.columns} seats. Prices exclude the 5% demo service fee.
            </p>
          </div>
          <p className="bg-mint text-brand mt-5 flex items-start gap-2 rounded-lg p-4 text-xs leading-5">
            <Info className="size-4 shrink-0" />
            Seat counts come from the same map shown to customers. The reference ticket EF-1042 is
            an illustrative example and does not occupy live demo seats.
          </p>
        </>
      )}
      {tab === 'Reservations' && <Reservations eventId={event.id} />}
      {tab === 'Seating' && (
        <>
          <p className="text-muted mb-5 text-sm">
            Read-only availability preview. Use the event’s public page to select seats.
          </p>
          <SeatGrid
            seats={seats}
            selected={[]}
            columns={event.columns}
            readOnly
            onSelect={() => {}}
          />
        </>
      )}
      {tab === 'Settings' && (
        <div className="border-line max-w-2xl rounded-xl border bg-white p-6">
          <h2 className="text-xl">Event settings</h2>
          <p className="text-muted mt-3 mb-6 text-sm leading-6">
            Edit the event’s description, cover image, date, and venue. Once a demo booking exists,
            its seat layout and ticket prices stay fixed.
          </p>
          <dl className="mb-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Visibility</dt>
              <dd>
                {event.status === 'Published'
                  ? 'Visible in local Explore'
                  : 'Draft in this browser'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Timezone</dt>
              <dd>Africa/Cairo</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Accessibility</dt>
              <dd>{event.accessible ? 'Wheelchair accessible' : 'Not specified'}</dd>
            </div>
          </dl>
          <Link href={`/dashboard/events/new?edit=${event.id}`} className="primary-link">
            <Pencil className="size-4" />
            Edit event details
          </Link>
        </div>
      )}
    </>
  );
}
