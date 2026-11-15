import EventCard from '@/components/events/EventCard';
import type { Event } from '@/types';

type EventGridProps = { events: Event[] };

export default function EventGrid({ events }: EventGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
