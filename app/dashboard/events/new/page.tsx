import { Suspense } from 'react';
import EventEditor from '@/components/dashboard/EventEditor';
export default function CreateEventPage() {
  return (
    <Suspense fallback={<p>Loading event form…</p>}>
      <EventEditor />
    </Suspense>
  );
}
