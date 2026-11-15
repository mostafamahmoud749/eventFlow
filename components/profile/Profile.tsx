'use client';

import { useContext, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { UserRound, Bell, Heart, ArrowRight, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import TicketCard from '@/components/profile/TicketCard';
import { getAllEvents } from '@/lib/events';

export default function Profile() {
  const { data, setData, ready } = useContext(DemoContext);
  const [form, setForm] = useState(data.user);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (ready) setForm(data.user);
  }, [ready, data.user]);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) fieldErrors.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      fieldErrors.email = 'Enter a valid email address.';
    if (!form.city.trim()) fieldErrors.city = 'Enter your city.';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;
    setData((prev) => ({
      ...prev,
      user: { ...form, name: form.name.trim(), email: form.email.trim(), city: form.city.trim() },
    }));
    setSaved(true);
  }

  const latest = data.bookings[data.bookings.length - 1];
  const event = getAllEvents(data.localEvents).find((item) => item.id === latest?.eventId);
  return (
    <div className="page-container py-10 lg:py-14">
      <div className="mb-8">
        <p className="text-brand mb-3 text-xs font-semibold tracking-[2px]">A LITTLE ABOUT YOU</p>
        <h1 className="text-4xl">My profile</h1>
        <p className="text-muted mt-3">Your details, your preferences, your next good plan.</p>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-wrap gap-2 lg:flex-col">
          <a
            href="#personal"
            className="bg-mint text-brand flex items-center gap-3 rounded-lg p-3 text-sm font-semibold"
          >
            <UserRound className="size-4" />
            Personal information
          </a>
          <a
            href="#preferences"
            className="text-muted hover:bg-mint flex items-center gap-3 rounded-lg p-3 text-sm"
          >
            <Bell className="size-4" />
            Preferences
          </a>
          <Link
            href="/events?saved=true"
            className="text-muted hover:bg-mint flex items-center gap-3 rounded-lg p-3 text-sm"
          >
            <Heart className="size-4" />
            Saved events ({data.favorites.length})
          </Link>
          <Link
            href="/dashboard"
            className="text-muted hover:bg-mint flex items-center gap-3 rounded-lg p-3 text-sm"
          >
            <LayoutDashboard className="size-4" />
            Organizer workspace
          </Link>
        </aside>
        <div className="space-y-6">
          <section id="personal" className="border-line rounded-xl border bg-white p-6 sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl">
              <UserRound className="text-brand size-5" />
              Personal information
            </h2>
            <form
              noValidate
              onSubmit={saveProfile}
              onChange={() => setSaved(false)}
              className="grid items-start gap-6 sm:grid-cols-[120px_1fr]"
            >
              <div className="text-center">
                <div className="bg-mint font-heading text-brand mx-auto flex size-24 items-center justify-center rounded-full text-3xl font-bold">
                  {form.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <p className="text-muted mt-3 text-xs">Your EventFlow profile</p>
              </div>
              <div className="space-y-5">
                <Input
                  label="Full name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  error={errors.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  error={errors.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  value={form.city}
                  error={errors.city}
                  onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                />
                <div className="flex flex-wrap items-center justify-end gap-4">
                  {saved && (
                    <p role="status" className="text-brand flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="size-4" />
                      Profile saved locally
                    </p>
                  )}
                  <Button type="submit">Save changes</Button>
                </div>
              </div>
            </form>
          </section>
          <section id="preferences" className="border-line rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-start gap-3">
                <Bell className="text-brand mt-1 size-5 shrink-0" />
                <div>
                  <h2 className="text-base">Event updates</h2>
                  <p className="text-muted mt-1 text-sm leading-6">
                    Keep your notification preference on file.
                    <br />
                    Demo preference only; no emails are sent.
                  </p>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={data.user.notifications}
                aria-label="Event update notifications"
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    user: { ...prev.user, notifications: !prev.user.notifications },
                  }))
                }
                className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${data.user.notifications ? 'bg-brand' : 'bg-line'}`}
              >
                <span
                  className={`size-5 rounded-full bg-white shadow-sm transition-transform ${data.user.notifications ? 'translate-x-5' : ''}`}
                />
              </button>
            </div>
          </section>
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl">Your latest good plan</h2>
              <Link
                href="/tickets"
                className="text-brand flex items-center gap-2 text-sm font-semibold"
              >
                All tickets <ArrowRight className="size-4" />
              </Link>
            </div>
            {event && latest && <TicketCard event={event} booking={latest} />}
          </section>
          <p className="text-muted text-xs">
            Demo profile · Changes are saved in this browser only.
          </p>
        </div>
      </div>
    </div>
  );
}
