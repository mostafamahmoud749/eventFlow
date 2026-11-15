import { Suspense } from 'react';
import ManageEvent from '@/components/dashboard/ManageEvent';
export default function ManageEventPage() {
  return (
    <Suspense fallback={<p>Loading event…</p>}>
      <ManageEvent />
    </Suspense>
  );
}
