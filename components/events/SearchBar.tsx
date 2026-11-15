import { CalendarDays, MapPin, Search } from 'lucide-react';
import Button from '@/components/common/Button';

export default function SearchBar() {
  return (
    <form action="/events" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] lg:grid-cols-[minmax(0,1fr)_160px_170px_auto]">
      <label className="border-line flex min-h-12 min-w-0 items-center gap-3 rounded-lg border bg-white px-4 sm:col-span-3 lg:col-span-1">
        <Search className="text-muted size-5 shrink-0" />
        <input
          name="search"
          aria-label="Search events, artists, or organizers"
          placeholder="Events, artists, or organizers"
          className="w-full min-w-0 bg-transparent py-3 text-sm outline-none"
        />
      </label>
      <label className="border-line flex items-center gap-2 rounded-lg border bg-white px-3">
        <MapPin className="text-muted size-4 shrink-0" />
        <select name="city" aria-label="City" className="min-h-12 w-full bg-transparent text-sm">
          <option>Cairo</option>
        </select>
      </label>
      <label className="border-line flex items-center gap-2 rounded-lg border bg-white px-3">
        <CalendarDays className="text-muted size-4 shrink-0" />
        <select
          name="date"
          aria-label="Event date"
          className="min-h-12 w-full bg-transparent text-sm"
        >
          <option value="all">Any date</option>
          <option value="weekend">This weekend</option>
          <option value="week">Next 7 days</option>
          <option value="month">This month</option>
        </select>
      </label>
      <Button type="submit" className="min-h-12">
        <Search className="size-4" />
        Find events
      </Button>
    </form>
  );
}
