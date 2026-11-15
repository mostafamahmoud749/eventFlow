import { Suspense } from 'react';
import { events } from '@/data/events';
import Checkout from '@/components/seats/Checkout';

export function generateStaticParams() {
  return [...events.map((event) => ({ id: event.id })), { id: 'local' }];
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="page-container py-16">Loading checkout…</div>}>
      <Checkout id={id} />
    </Suspense>
  );
}
