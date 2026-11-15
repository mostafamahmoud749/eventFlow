'use client';

import { useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { DemoContext } from '@/components/common/DemoProvider';
import CreateEventForm from '@/components/dashboard/CreateEventForm';
import EmptyState from '@/components/common/EmptyState';
import { getAllEvents } from '@/lib/events';

export default function EventEditor() {
  const { data, ready } = useContext(DemoContext);
  const params = useSearchParams();
  const id = params.get('edit');
  if (!ready) return <p className="text-muted text-sm">Loading your workspace…</p>;
  const event = getAllEvents(data.localEvents).find((item) => item.id === id);
  if (id && !event)
    return (
      <EmptyState
        title="We couldn’t find that draft"
        description="Your drafts are saved in the browser where you created them."
        href="/dashboard/events"
        label="Back to my events"
      />
    );
  return <CreateEventForm key={id || 'new'} initialEvent={event} />;
}
