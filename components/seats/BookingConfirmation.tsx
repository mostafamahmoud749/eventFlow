'use client';

import { useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import EmptyState from '@/components/common/EmptyState';
import TicketCard from '@/components/profile/TicketCard';
import { getAllEvents } from '@/lib/events';

export default function BookingConfirmation() {
  const { data, ready } = useContext(DemoContext);
  const params = useSearchParams();
  const booking = data.bookings.find((item) => item.id === params.get('booking'));
  const event = getAllEvents(data.localEvents).find((item) => item.id === booking?.eventId);
  if (!booking || !event)
    return (
      <div className="page-container py-16">
        <EmptyState
          title={ready ? 'Find your next great night' : 'Loading your ticket…'}
          description="Your demo tickets are always available in My tickets."
          href="/tickets"
          label="My tickets"
        />
      </div>
    );
  return (
    <div className="page-container max-w-[900px] py-12">
      <div className="mb-9 text-center">
        <span className="bg-mint text-brand mx-auto mb-6 flex size-20 items-center justify-center rounded-full">
          <Check className="size-10" />
        </span>
        <p className="text-brand mb-3 text-xs font-semibold tracking-[2px]">
          GOOD PLANS, CONFIRMED
        </p>
        <h1 className="text-3xl leading-tight sm:text-4xl">You’re going to {event.title}!</h1>
        <p className="text-muted mt-4">
          Demo booking <strong className="text-brand">{booking.id}</strong> · Saved in this browser
        </p>
        <p className="text-muted mt-2 text-sm">No payment was made and no email was sent.</p>
      </div>
      <TicketCard event={event} booking={booking} expanded />
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href={`/tickets#${booking.id}`} className="primary-link">
          View my tickets <ArrowRight className="size-4" />
        </Link>
        <Link href="/events" className="secondary-link">
          Explore more events
        </Link>
      </div>
    </div>
  );
}
