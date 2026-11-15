import { Suspense } from 'react';
import BookingConfirmation from '@/components/seats/BookingConfirmation';
export const metadata = { title: 'Booking confirmed' };
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<p className="page-container py-16">Loading confirmation…</p>}>
      <BookingConfirmation />
    </Suspense>
  );
}
