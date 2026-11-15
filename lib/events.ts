import { events } from '@/data/events';
import type { Event } from '@/types';

export function getAllEvents(localEvents: Event[]) {
  return [
    ...events.map((event) => localEvents.find((item) => item.id === event.id) || event),
    ...localEvents.filter((event) => !events.some((item) => item.id === event.id)),
  ];
}

export function getEventHref(event: Event, step = '') {
  const isExample = events.some((item) => item.id === event.id);
  return `/events/${isExample ? event.id : 'local'}${step}${isExample ? '' : `?event=${encodeURIComponent(event.id)}`}`;
}
