'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import EventList from '@/components/dashboard/EventList';
import EmptyState from '@/components/common/EmptyState';
import { getAllEvents } from '@/lib/events';

export default function MyEvents() {
  const { data } = useContext(DemoContext);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const allEvents = getAllEvents(data.localEvents).filter(
    (event) =>
      event.organizer === 'Nile Live' || data.localEvents.some((item) => item.id === event.id),
  );
  const filtered = allEvents.filter(
    (event) =>
      (tab === 'All' || event.status === tab) &&
      event.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">My events</h1>
          <p className="text-muted mt-3 text-sm">Every great experience starts with a good idea.</p>
        </div>
        <Link href="/dashboard/events/new" className="primary-link">
          <Plus className="size-4" />
          Create event
        </Link>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {['All', 'Published', 'Draft'].map((item) => (
          <button
            key={item}
            aria-pressed={tab === item}
            onClick={() => setTab(item)}
            className={`min-h-11 rounded-lg border px-5 text-sm font-medium ${tab === item ? 'border-brand bg-mint text-brand' : 'border-line text-muted bg-white'}`}
          >
            {item} ({allEvents.filter((event) => item === 'All' || event.status === item).length})
          </button>
        ))}
      </div>
      <label className="border-line mb-6 flex max-w-md items-center gap-2 rounded-lg border bg-white px-3">
        <Search className="text-muted size-4" />
        <input
          aria-label="Search your events"
          placeholder="Search your events…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-11 w-full bg-transparent text-sm outline-none"
        />
      </label>
      {filtered.length ? (
        <EventList events={filtered} />
      ) : (
        <EmptyState
          title="A fresh page for your next idea"
          description="No events match this view. Try a different filter or start creating."
          href="/dashboard/events/new"
          label="Create event"
        />
      )}
    </>
  );
}
