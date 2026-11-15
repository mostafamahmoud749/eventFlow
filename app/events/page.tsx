import { Suspense } from 'react';
import ExploreEvents from '@/components/events/ExploreEvents';

export const metadata = { title: 'Explore events' };

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="page-container py-16">Loading events…</div>}>
      <ExploreEvents />
    </Suspense>
  );
}
