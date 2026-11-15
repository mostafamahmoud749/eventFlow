'use client';

import { useContext, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock3, Info, CheckCircle2 } from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import EmptyState from '@/components/common/EmptyState';
import BookingSummary from '@/components/seats/BookingSummary';
import { getAllEvents, getEventHref } from '@/lib/events';
import { getTotals } from '@/lib/seats';
import { formatPrice } from '@/lib/format';

type CheckoutProps = { id: string };

export default function Checkout({ id }: CheckoutProps) {
  const { data, setData, ready } = useContext(DemoContext);
  const params = useSearchParams();
  const router = useRouter();
  const [now, setNow] = useState(0);
  const [contact, setContact] = useState({ name: data.user.name, email: data.user.email });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const event = getAllEvents(data.localEvents).find(
    (item) => item.id === (id === 'local' ? params.get('event') : id),
  );
  const hold = data.hold?.eventId === event?.id ? data.hold : null;
  const seconds = hold && now ? Math.max(0, Math.ceil((hold.expiresAt - now) / 1000)) : 0;

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (ready) setContact({ name: data.user.name, email: data.user.email });
  }, [ready, data.user.name, data.user.email]);

  function confirmBooking(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || !event || !hold) return;
    if (Date.now() >= hold.expiresAt) {
      setNow(Date.now());
      return;
    }
    if (!contact.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setError('Enter your full name and a valid email address.');
      return;
    }
    if (!agreed) {
      setError('Confirm that you understand this is a demo booking.');
      return;
    }
    setSubmitting(true);
    const bookingId = `EF-${Math.max(1042, ...data.bookings.map((booking) => Number(booking.id.replace('EF-', '')) || 1042)) + 1}`;
    setData((prev) => ({
      ...prev,
      hold: null,
      bookings: [
        ...prev.bookings,
        {
          id: bookingId,
          eventId: event.id,
          seats: hold.seats,
          total: getTotals(hold.seats).total,
          name: contact.name.trim(),
          email: contact.email.trim(),
        },
      ],
    }));
    router.replace(`/booking/confirmed?booking=${bookingId}`);
  }

  if (!ready || !now) return <div className="page-container py-16">Loading checkout…</div>;
  if (!event || !hold)
    return (
      <div className="page-container py-16">
        <EmptyState
          title="Let’s find your seats first"
          description="Your checkout will be ready once you choose your seats."
          href={event ? getEventHref(event, '/seats') : '/events'}
          label="Choose seats"
        />
      </div>
    );
  if (!seconds)
    return (
      <div className="page-container py-16">
        <EmptyState
          title="Your demo hold has expired"
          description="Your selection is no longer held. Choose your seats again to start a fresh checkout."
          href={getEventHref(event, '/seats')}
          label="Return to available seats"
        />
      </div>
    );
  return (
    <div className="page-container max-w-[1050px] pt-8 pb-32 sm:pt-12 lg:pb-12">
      <Link
        href={getEventHref(event, '/seats')}
        className="text-muted mb-7 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="size-4" />
        Back to seats
      </Link>
      <div className="text-muted mb-7 flex items-center gap-3 text-xs">
        <CheckCircle2 className="text-brand size-5" />
        Seats
        <span className="bg-line h-px w-8" />
        <span className="text-brand font-semibold">2 · Checkout</span>
        <span className="bg-line h-px w-8" />
        <span>3 · Ticket</span>
      </div>
      <h1 className="text-4xl">You’re almost there.</h1>
      <p className="text-muted mt-3 mb-8">One last look, then let the good plans begin.</p>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_330px]">
        <form
          id="checkout-form"
          noValidate
          onSubmit={confirmBooking}
          className="border-line rounded-xl border bg-white p-6 sm:p-8"
        >
          <div className="text-amber mb-7 flex items-center justify-between gap-3 rounded-lg bg-amber-50 p-4 text-sm">
            <span className="flex items-center gap-2">
              <Clock3 className="size-5" />
              Demo seats held for
            </span>
            <span role="timer" aria-label="Time remaining" className="font-mono font-bold">
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </span>
          </div>
          <h2 className="mb-5 text-xl">Who’s coming?</h2>
          <div className="space-y-5">
            <Input
              label="Full name"
              name="name"
              autoComplete="name"
              value={contact.name}
              onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              value={contact.email}
              onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="border-line my-7 border-t pt-6">
            <h2 className="mb-4 text-xl">A preview of the good times</h2>
            <div className="bg-mint text-brand flex gap-3 rounded-lg p-4 text-sm leading-6">
              <Info className="mt-1 size-5 shrink-0" />
              <p>
                This is a sample checkout. No payment details are needed, no charge is made, and
                your ticket will be saved only in this browser.
              </p>
            </div>
          </div>
          <label className="flex items-start gap-3 text-sm leading-6">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 size-4 shrink-0"
            />
            I understand this creates a demo ticket, not a real booking.
          </label>
          {error && (
            <p role="alert" className="text-danger mt-4 text-sm">
              {error}
            </p>
          )}
        </form>
        <aside className="border-line rounded-xl border bg-white p-6 lg:sticky lg:top-6">
          <BookingSummary event={event} seats={hold.seats} />
          <Button form="checkout-form" type="submit" disabled={submitting} className="mt-6 w-full">
            {submitting ? 'Creating ticket…' : 'Confirm demo booking'}
            <ArrowRight className="size-4" />
          </Button>
          <p className="text-muted mt-3 text-center text-xs">No payment. Just a little preview.</p>
        </aside>
      </div>
      <div className="border-line shadow-card fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t bg-white px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] lg:hidden">
        <div>
          <p className="text-muted text-xs">Demo total</p>
          <p className="font-bold">{formatPrice(getTotals(hold.seats).total)}</p>
        </div>
        <Button type="submit" form="checkout-form" disabled={submitting}>
          Confirm demo <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
