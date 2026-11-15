import { Suspense } from 'react';
import { events } from '@/data/events';
import SeatSelection from '@/components/seats/SeatSelection';

export function generateStaticParams() {
  return [...events.map((event) => ({ id: event.id })), { id: 'local' }];
}

export default async function SeatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="page-container py-16">Loading seats…</div>}>
      <SeatSelection id={id} />
    </Suspense>
  );
}
