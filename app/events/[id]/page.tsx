import { Suspense } from 'react';
import { events } from '@/data/events';
import EventDetails from '@/components/events/EventDetails';

export function generateStaticParams() {
  return [...events.map((event) => ({ id: event.id })), { id: 'local' }];
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="page-container py-16">Loading event…</div>}>
      <EventDetails id={id} />
    </Suspense>
  );
}
