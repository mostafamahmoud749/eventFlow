'use client';

import { useContext, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { categories } from '@/data/events';
import { categoryIcons } from '@/components/events/CategoryBadge';
import { DemoContext } from '@/components/common/DemoProvider';
import EventGrid from '@/components/events/EventGrid';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import { getAllEvents } from '@/lib/events';

export default function ExploreEvents() {
  const params = useSearchParams();
  const router = useRouter();
  const { data } = useContext(DemoContext);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const search = params.get('search') || '';
  const category = params.get('category') || 'All';
  const date = params.get('date') || 'all';
  const area = params.get('area') || 'all';
  const sort = params.get('sort') || 'recommended';
  const maxPrice = Number(params.get('price') || 1000);
  const accessible = params.get('accessible') === 'true';
  const savedOnly = params.get('saved') === 'true';

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/events?${next.toString()}`, { scroll: false });
  }

  // Compare calendar dates in Cairo, without shifting them through the browser's timezone.
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date());
  const start = new Date(`${today}T12:00:00Z`);
  const weekendStart = new Date(start);
  const weekday = start.getUTCDay();
  weekendStart.setUTCDate(start.getUTCDate() + (weekday === 6 ? -1 : (5 - weekday + 7) % 7));
  const weekendEnd = new Date(weekendStart);
  weekendEnd.setUTCDate(weekendStart.getUTCDate() + 1);
  const nextWeek = new Date(start);
  nextWeek.setUTCDate(start.getUTCDate() + 7);

  const filteredEvents = getAllEvents(data.localEvents).filter((event) => {
    const eventDate = new Date(`${event.date}T12:00:00Z`);
    const matchesDate =
      date === 'all' ||
      (date === 'weekend' && eventDate >= weekendStart && eventDate <= weekendEnd) ||
      (date === 'week' && eventDate >= start && eventDate <= nextWeek) ||
      (date === 'month' && event.date.slice(0, 7) === today.slice(0, 7) && eventDate >= start);
    const text = `${event.title} ${event.organizer} ${event.venue} ${event.category}`.toLowerCase();
    return (
      event.status === 'Published' &&
      text.includes(search.toLowerCase()) &&
      (category === 'All' || event.category === category) &&
      matchesDate &&
      event.price <= maxPrice &&
      (area === 'all' || event.area === area) &&
      (!accessible || event.accessible) &&
      (!savedOnly || data.favorites.includes(event.id))
    );
  });
  if (sort === 'price-low') filteredEvents.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') filteredEvents.sort((a, b) => b.price - a.price);
  if (sort === 'date') filteredEvents.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="page-container py-10 lg:py-14">
      <p className="text-brand mb-3 text-xs font-semibold tracking-[2px]">GO OUT. GET INSPIRED.</p>
      <h1 className="text-4xl leading-tight lg:text-5xl">Find your next experience.</h1>
      <p className="text-muted mt-4">The best of Cairo, all in one place. What will you do next?</p>
      <div className="border-line mt-8 grid gap-3 rounded-xl border bg-white p-3 sm:grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1fr)_176px_auto]">
        <label className="flex min-h-12 min-w-0 items-center gap-3 px-3 sm:col-span-2 lg:col-span-1">
          <Search className="text-muted size-5 shrink-0" />
          <input
            value={search}
            onChange={(e) => updateFilter('search', e.target.value)}
            aria-label="Search events"
            placeholder="Search events, artists, or organizers"
            className="min-w-0 w-full bg-transparent py-3 text-sm outline-none"
          />
        </label>
        <select aria-label="Event city" className="field">
          <option>Cairo, Egypt</option>
        </select>
        <Button
          onClick={() =>
            document
              .getElementById('event-results')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        >
          <Search className="size-4" />
          Explore events
        </Button>
      </div>
      <div className="mt-6 mb-8 flex flex-wrap gap-2">
        {['All', ...categories].map((item) => {
          const Icon = item === 'All' ? null : categoryIcons[item as keyof typeof categoryIcons];
          return (
            <button
              key={item}
              aria-pressed={category === item}
              onClick={() => updateFilter('category', item)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition ${category === item ? 'border-brand bg-brand text-white' : 'border-line hover:border-brand bg-white'}`}
            >
              {Icon && <Icon className="size-4" />}
              {item}
            </button>
          );
        })}
      </div>
      <div className="border-line border-t pt-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
          className="secondary-link mb-5 w-full lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
          {filtersOpen ? 'Hide filters' : 'Show filters'}
        </button>
        <aside
          aria-label="Event filters"
          className={`${filtersOpen ? 'block' : 'hidden'} border-line mb-6 self-start rounded-xl border bg-white p-5 lg:sticky lg:top-6 lg:block`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base">Filters</h2>
            <button
              onClick={() => router.replace('/events', { scroll: false })}
              className="text-brand text-xs font-medium underline underline-offset-4"
            >
              Clear all
            </button>
          </div>
          <div className="border-line border-t py-5">
          <fieldset className="min-w-0">
            <legend className="mb-3 text-sm font-semibold">When</legend>
            <div className="space-y-1">
            {[
              { value: 'all', label: 'Any date' },
              { value: 'weekend', label: 'This weekend' },
              { value: 'week', label: 'Next 7 days' },
              { value: 'month', label: 'This month' },
            ].map((option) => (
              <label
                key={option.value}
                className="text-muted flex min-h-9 items-center gap-2.5 text-sm"
              >
                <input
                  type="radio"
                  name="date"
                  value={option.value}
                  checked={date === option.value}
                  onChange={(e) => updateFilter('date', e.target.value)}
                  className="size-4 shrink-0"
                />
                {option.label}
              </label>
            ))}
            </div>
          </fieldset>
          </div>
          <div className="border-line border-t py-5">
            <label htmlFor="max-price" className="mb-4 block text-sm font-semibold">
              Price up to EGP {maxPrice}
            </label>
            <input
              id="max-price"
              type="range"
              min="0"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => updateFilter('price', e.target.value)}
              className="w-full"
            />
            <div className="text-muted mt-2 flex justify-between text-xs">
              <span>EGP 0</span>
              <span>EGP 1,000</span>
            </div>
          </div>
          <div className="border-line border-t py-5">
            <label htmlFor="area" className="mb-3 block text-sm font-semibold">
              Neighborhood
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => updateFilter('area', e.target.value)}
              className="field"
            >
              <option value="all">All Cairo</option>
              {['Downtown', 'Zamalek', 'Maadi', 'Nasr City', 'New Cairo'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="border-line space-y-4 border-t pt-5">
            <label className="text-muted flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={accessible}
                onChange={(e) => updateFilter('accessible', String(e.target.checked))}
                className="size-4"
              />
              Wheelchair accessible
            </label>
            <label className="text-muted flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={savedOnly}
                onChange={(e) => updateFilter('saved', String(e.target.checked))}
                className="size-4"
              />
              My saved events
            </label>
          </div>
        </aside>
        <section id="event-results" className="min-w-0 scroll-mt-5">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm font-semibold">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} in Cairo
            </p>
            <label className="text-muted flex items-center gap-2 text-xs">
              Sort by
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="field w-auto"
              >
                <option value="recommended">Recommended</option>
                <option value="date">Soonest first</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>
          {filteredEvents.length ? (
            <EventGrid events={filteredEvents} />
          ) : (
            <>
              <EmptyState
                title="Your next plan is still out there"
                description="Try a different search, date, or category to find something you’ll love."
              />
              <Button
                variant="secondary"
                onClick={() => router.replace('/events')}
                className="mx-auto mt-5 flex"
              >
                <X className="size-4" />
                Clear filters
              </Button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
