import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import type { Event } from '@/types';
import CategoryBadge from '@/components/events/CategoryBadge';
import FavoriteButton from '@/components/events/FavoriteButton';
import { formatDate, formatPrice } from '@/lib/format';
import { getEventHref } from '@/lib/events';

type EventCardProps = { event: Event };

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="group border-line hover:shadow-card overflow-hidden rounded-xl border bg-white transition duration-200 hover:-translate-y-1">
      <div className="relative aspect-[1.65] overflow-hidden">
        <Link href={getEventHref(event)} tabIndex={-1} aria-hidden="true">
          <Image
            src={event.image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 400px"
          />
        </Link>
        <div className="absolute top-3 right-3">
          <FavoriteButton id={event.id} title={event.title} />
        </div>
      </div>
      <div className="p-5">
        <CategoryBadge category={event.category} />
        <h3 className="mt-3 mb-3 text-xl">
          <Link href={getEventHref(event)} className="hover:text-brand">
            {event.title}
          </Link>
        </h3>
        <p className="text-muted mb-2 flex items-center gap-2 text-sm">
          <CalendarDays className="size-4 shrink-0" />
          {formatDate(event.date, true)}
        </p>
        <p className="text-muted flex items-center gap-2 text-sm">
          <MapPin className="size-4 shrink-0" />
          {event.venue}
        </p>
        <div className="border-line mt-5 flex items-center justify-between border-t pt-4">
          <p className="text-muted text-sm">
            From <span className="text-ink font-semibold">{formatPrice(event.price)}</span>
          </p>
          <Link
            href={getEventHref(event)}
            aria-label={`View ${event.title}`}
            className="bg-mint text-brand group-hover:bg-brand flex size-9 items-center justify-center rounded-full transition group-hover:text-white"
          >
            <ArrowUpRight className="size-5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
