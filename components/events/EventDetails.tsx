'use client';

import { useContext, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarDays,
  MapPin,
  Clock3,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Accessibility,
  Music2,
  Building2,
} from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import CategoryBadge from '@/components/events/CategoryBadge';
import FavoriteButton from '@/components/events/FavoriteButton';
import EmptyState from '@/components/common/EmptyState';
import { getAllEvents, getEventHref } from '@/lib/events';
import { formatDate, formatPrice, formatTime } from '@/lib/format';

type EventDetailsProps = { id: string };

export default function EventDetails({ id }: EventDetailsProps) {
  const { data, ready } = useContext(DemoContext);
  const params = useSearchParams();
  const [tier, setTier] = useState('Standard');
  const event = getAllEvents(data.localEvents).find(
    (item) => item.id === (id === 'local' ? params.get('event') : id),
  );
  if (!event || event.status !== 'Published')
    return (
      <div className="page-container py-16">
        <EmptyState
          title={ready ? 'Event not found' : 'Loading your event…'}
          description="Explore what’s coming up in Cairo."
          href="/events"
          label="Explore events"
        />
      </div>
    );
  return (
    <div className="page-container pt-7 pb-32 lg:pb-16">
      <nav
        aria-label="Breadcrumb"
        className="text-muted mb-6 flex flex-wrap items-center gap-2 text-xs"
      >
        <Link href="/events" className="hover:text-brand">
          Explore events
        </Link>
        <ChevronRight className="size-3" />
        <Link href={`/events?category=${event.category}`}>{event.category}</Link>
        <ChevronRight className="size-3" />
        <span className="text-ink font-medium">{event.title}</span>
      </nav>
      <div className="relative h-64 overflow-hidden rounded-xl sm:h-80 lg:h-[410px]">
        <Image
          src={event.image}
          alt={`${event.title} event atmosphere`}
          fill
          priority
          sizes="1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-5 right-5">
          <FavoriteButton id={event.id} title={event.title} />
        </div>
      </div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_340px] lg:gap-14">
        <div>
          <CategoryBadge category={event.category} />
          <h1 className="mt-4 mb-5 text-4xl lg:text-5xl">{event.title}</h1>
          <div className="text-muted grid gap-3 text-sm sm:grid-cols-2">
            <p className="flex items-center gap-2.5">
              <CalendarDays className="text-brand size-4" />
              {formatDate(event.date)}
            </p>
            <p className="flex items-center gap-2.5">
              <Clock3 className="text-brand size-4" />
              {formatTime(event.time)} · Africa/Cairo
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin className="text-brand size-4" />
              {event.venue}
            </p>
            <p className="flex items-center gap-2.5">
              <Building2 className="text-brand size-4" />
              Organized by {event.organizer}
            </p>
          </div>
          <section className="border-line mt-8 border-t pt-7">
            <h2 className="mb-4 text-2xl">About this event</h2>
            <p className="text-muted leading-7">{event.description}</p>
            <p className="text-muted mt-4 leading-7">
              Come for the experience. Stay for the memories. Choose your seats in advance and enjoy
              an evening made just for you.
            </p>
          </section>
          <section className="border-line mt-8 border-t pt-7">
            <h2 className="mb-5 text-2xl">The evening, at a glance</h2>
            <div className="space-y-0">
              {[
                {
                  time: event.doors,
                  label: 'Doors open',
                  description: 'Arrive, settle in, and find your seats.',
                },
                {
                  time: event.time,
                  label: 'The experience begins',
                  description: 'Let the good times start.',
                },
                {
                  time: event.endTime,
                  label: 'Until next time',
                  description: 'Head home with a story to tell.',
                },
              ].map((item, index) => (
                <div key={item.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1 size-3 rounded-full ${index === 1 ? 'bg-coral' : 'bg-brand/20'}`}
                    />
                    {index < 2 && <div className="bg-line my-1 w-px flex-1" />}
                  </div>
                  <div className="grid flex-1 grid-cols-[90px_1fr] gap-3 pb-6 text-sm">
                    <p className="font-semibold">{formatTime(item.time)}</p>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-muted mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="border-line mt-3 border-t pt-7">
            <h2 className="mb-4 text-2xl">The venue</h2>
            <div className="border-line flex gap-3 rounded-xl border bg-white p-5">
              <div className="bg-mint text-brand flex size-12 shrink-0 items-center justify-center rounded-lg">
                <MapPin />
              </div>
              <div>
                <h3 className="font-semibold">{event.venue}</h3>
                <p className="text-muted mt-1 text-sm">
                  {event.area}, {event.city}, Egypt
                </p>
                {event.accessible && (
                  <p className="text-brand mt-3 flex items-center gap-1.5 text-xs">
                    <Accessibility className="size-4" />
                    Wheelchair-accessible venue
                  </p>
                )}
              </div>
            </div>
          </section>
          <section className="border-line mt-8 border-t pt-7">
            <h2 className="mb-5 text-2xl">Meet your organizer</h2>
            <div className="flex items-center gap-4">
              <div className="bg-ink flex size-14 items-center justify-center rounded-xl text-white">
                <Music2 className="size-7" />
              </div>
              <div>
                <h3 className="text-lg">{event.organizer}</h3>
                <p className="text-muted mt-1 text-sm">Creating moments. Connecting people.</p>
              </div>
              <Link
                href={`/events?search=${encodeURIComponent(event.organizer)}`}
                className="text-brand ml-auto text-sm font-semibold"
              >
                More events <ArrowRight className="ml-1 inline size-4" />
              </Link>
            </div>
          </section>
        </div>
        <aside className="border-line shadow-card rounded-xl border bg-white p-6 lg:sticky lg:top-6">
          <span className="bg-mint text-brand inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
            <CheckCircle2 className="size-3.5" />
            Tickets available
          </span>
          <h2 className="mt-5 mb-1 text-xl">Your night starts here</h2>
          <p className="text-muted mb-6 text-sm">
            A great experience. A seat with your name on it.
          </p>
          <fieldset>
            <legend className="sr-only">Ticket category</legend>
            {['Standard', 'VIP'].map((item) => (
              <label
                key={item}
                className={`mb-3 flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm ${tier === item ? 'border-brand bg-mint/40' : 'border-line'}`}
              >
                <input
                  type="radio"
                  name="tier"
                  value={item}
                  checked={tier === item}
                  onChange={() => setTier(item)}
                />
                <span className="font-medium">{item}</span>
                <strong className="ml-auto">
                  {formatPrice(item === 'VIP' ? event.vipPrice : event.price)}
                </strong>
              </label>
            ))}
          </fieldset>
          <Link
            href={`${getEventHref(event, '/seats')}${event.id.startsWith('local-') ? '&' : '?'}tier=${tier}`}
            className="primary-link mt-3 w-full"
          >
            Select seats <ArrowRight className="size-4" />
          </Link>
          <p className="text-muted mt-4 text-center text-xs">
            Choose your favorite spot before checkout.
          </p>
          <div className="border-line text-muted mt-6 border-t pt-4 text-xs leading-5">
            Prices are per seat. A 5% service fee is shown in your booking summary.
          </div>
        </aside>
      </div>
      <div className="border-line shadow-card fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t bg-white px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] lg:hidden">
        <div>
          <p className="text-muted text-xs">From</p>
          <p className="font-bold">{formatPrice(event.price)}</p>
        </div>
        <Link
          href={`${getEventHref(event, '/seats')}${event.id.startsWith('local-') ? '&' : '?'}tier=${tier}`}
          className="primary-link"
        >
          Select seats <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
