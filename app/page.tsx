import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin, Sparkles, Clock3 } from 'lucide-react';
import { categories, events } from '@/data/events';
import SearchBar from '@/components/events/SearchBar';
import EventGrid from '@/components/events/EventGrid';
import CategoryBadge, { categoryIcons } from '@/components/events/CategoryBadge';

export default function HomePage() {
  return (
    <>
      <section className="page-container pt-8 lg:pt-12">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="py-5 lg:py-12">
            <span className="border-brand/15 bg-mint text-brand mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide">
              <span className="bg-brand size-1.5 rounded-full" />A CITY FULL OF POSSIBILITIES
            </span>
            <h1 className="max-w-xl text-[42px] leading-[1.12] font-extrabold tracking-[-2px] sm:text-[56px] lg:text-[64px]">
              Your next great
              <br className="hidden sm:block" /> night starts{' '}
              <span className="text-brand">here.</span>
            </h1>
            <p className="text-muted mt-6 max-w-md text-base leading-7 lg:text-lg">
              Live music. New discoveries. Your kind of people.
              <br className="hidden lg:block" /> Find the experiences that make Cairo yours.
            </p>
            <Link
              href="/events"
              className="text-brand mt-7 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Find your next experience <ArrowUpRight className="size-5" />
            </Link>
          </div>
          <div className="relative h-72 overflow-hidden rounded-2xl sm:h-96 lg:h-[425px]">
            <Image
              src="/images/jazz.jpg"
              alt="Live jazz musicians performing under warm stage lights"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 600px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold">
              <Sparkles className="text-coral size-3.5" />A night to remember
            </span>
            <div className="absolute right-6 bottom-6 left-6 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="mb-2 text-xs font-medium tracking-[2px] text-white/75">
                  IN THE SPOTLIGHT
                </p>
                <h2 className="text-3xl">Cairo Jazz Nights</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
                  <MapPin className="size-4" />
                  Cairo Opera House · 11 Dec
                </p>
              </div>
              <Link
                href="/events/cairo-jazz-nights"
                aria-label="Discover Cairo Jazz Nights"
                className="text-ink flex size-12 shrink-0 items-center justify-center rounded-full bg-white"
              >
                <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-line shadow-card relative mt-7 rounded-xl border bg-white p-5 lg:mt-8 lg:p-6">
          <h2 className="mb-4 text-lg">What are you into?</h2>
          <SearchBar />
        </div>
      </section>
      <section className="page-container py-12 lg:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-[28px]">Follow your curiosity</h2>
          <span className="text-muted hidden text-sm sm:block">
            There’s something for everyone.
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            return (
              <Link
                key={category}
                href={`/events?category=${category}`}
                className="group border-line hover:border-brand/40 hover:bg-mint flex items-center gap-4 rounded-xl border bg-white px-5 py-6 transition"
              >
                <Icon className="text-brand size-6 transition group-hover:-rotate-6" />
                <span className="text-sm font-semibold">{category}</span>
                <ArrowUpRight className="text-muted ml-auto hidden size-4 lg:block" />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="page-container pb-14">
        <div className="border-line overflow-hidden rounded-xl border bg-white p-4 md:p-5">
          <div className="grid items-center gap-6 md:grid-cols-[280px_1fr_auto]">
            <div className="relative h-52 overflow-hidden rounded-lg">
              <Image
                src="/images/jazz.jpg"
                alt="A live jazz performance"
                fill
                sizes="400px"
                className="object-cover"
              />
              <span className="text-coral absolute top-3 left-3 rounded-md bg-white px-3 py-1 text-xs font-semibold">
                This month’s pick
              </span>
            </div>
            <div>
              <CategoryBadge category="Music" />
              <h2 className="mt-3 mb-4 text-3xl">A little jazz. A great night.</h2>
              <p className="text-muted mb-3 max-w-md text-sm leading-6">
                World-class sounds in an iconic setting. Make a date with Cairo Jazz Nights.
              </p>
              <div className="text-muted flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  11 December
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 className="size-4" />
                  7:30 PM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5 md:flex-col md:items-end">
              <p className="text-muted text-sm">
                From <strong className="text-ink block text-2xl">EGP 450</strong>
              </p>
              <Link href="/events/cairo-jazz-nights/seats" className="primary-link">
                Find your seats <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="page-container pb-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-brand mb-2 text-xs font-semibold tracking-[2px]">
              MAKE SOME MEMORIES
            </p>
            <h2 className="text-3xl">Coming up in Cairo</h2>
          </div>
          <Link
            href="/events"
            className="text-brand inline-flex items-center gap-2 text-sm font-semibold"
          >
            View all events <ArrowRight className="size-4" />
          </Link>
        </div>
        <EventGrid events={events.slice(0, 6)} />
      </section>
      <section className="page-container pb-16">
        <div className="bg-brand relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-xl px-7 py-10 text-white md:flex-row md:items-center md:px-12">
          <div className="pointer-events-none absolute -top-28 -right-14 size-80 rounded-full border-[50px] border-white/5" />
          <div className="relative">
            <p className="mb-3 text-xs font-medium tracking-[2px] text-white/65">
              FOR THE PEOPLE WHO MAKE IT HAPPEN
            </p>
            <h2 className="text-3xl sm:text-4xl">Bring people together.</h2>
            <p className="mt-3 text-sm text-white/75">
              Your idea. Your community. One unforgettable experience.
            </p>
          </div>
          <Link
            href="/dashboard/events/new"
            className="text-brand relative inline-flex min-h-12 shrink-0 items-center gap-3 rounded-lg bg-white px-6 py-3 text-sm font-semibold"
          >
            Create your first event <ArrowUpRight className="text-coral size-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
