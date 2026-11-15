'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Event } from '@/types';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/format';

type EventListProps = { events: Event[] };

export default function EventList({ events }: EventListProps) {
  return (
    <div className="border-line overflow-hidden rounded-xl border bg-white">
      <div className="border-line bg-canvas text-muted hidden grid-cols-[2fr_1fr_1fr_1fr_90px] gap-4 border-b px-5 py-4 text-xs font-medium xl:grid">
        <span>Event</span>
        <span>Date</span>
        <span>Status</span>
        <span>Starting price</span>
        <span className="text-right">Action</span>
      </div>
      {events.map((event) => (
        <article
          key={event.id}
          className="border-line grid items-center gap-4 border-b p-5 last:border-b-0 md:grid-cols-[1fr_auto] xl:grid-cols-[2fr_1fr_1fr_1fr_90px]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={event.image}
              alt=""
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h3 className="text-sm leading-5">{event.title}</h3>
              <p className="text-muted mt-2 flex items-center gap-1 text-xs">
                <MapPin className="size-3 shrink-0" />
                {event.venue || 'Venue to be added'}
              </p>
            </div>
          </div>
          <p className="text-muted flex items-center gap-1.5 text-xs">
            <CalendarDays className="size-3 xl:hidden" />
            {event.date ? formatDate(event.date, true) : 'Date to be added'}
          </p>
          <div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${event.status === 'Published' ? 'bg-mint text-brand' : 'text-amber bg-amber-50'}`}
            >
              {event.status === 'Published' ? 'Published · demo' : 'Draft'}
            </span>
          </div>
          <p className="text-sm font-medium">{formatPrice(event.price)}</p>
          <Link
            href={`/dashboard/events/manage?id=${encodeURIComponent(event.id)}`}
            className="border-line hover:border-brand hover:text-brand inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border px-3 text-xs font-semibold"
          >
            Manage <ArrowUpRight className="size-3.5" />
          </Link>
        </article>
      ))}
    </div>
  );
}
