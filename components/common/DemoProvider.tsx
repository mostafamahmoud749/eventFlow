'use client';

import { createContext, useEffect, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Booking, Event, SeatHold, User } from '@/types';
import { events } from '@/data/events';
import { createSeats, getTotals } from '@/lib/seats';

type DemoData = {
  user: User;
  signedIn: boolean;
  favorites: string[];
  bookings: Booking[];
  localEvents: Event[];
  hold: SeatHold | null;
  organization: { name: string; email: string; description: string };
};

type DemoContextValue = {
  data: DemoData;
  setData: Dispatch<SetStateAction<DemoData>>;
  ready: boolean;
  storageError: boolean;
};

const sampleSeats = createSeats(events[0]).filter((seat) => ['C7', 'C8'].includes(seat.id));
const initialData: DemoData = {
  user: {
    name: 'Mostafa Mahmoud',
    email: 'mostafa@example.com',
    city: 'Damietta',
    notifications: true,
  },
  signedIn: false,
  favorites: [],
  bookings: [
    {
      id: 'EF-1042',
      eventId: events[0].id,
      seats: sampleSeats,
      total: getTotals(sampleSeats).total,
      name: 'Mostafa Mahmoud',
      email: 'mostafa@example.com',
    },
  ],
  localEvents: [],
  hold: null,
  organization: {
    name: 'Nile Live',
    email: 'hello@nilelive.example',
    description: 'Bringing people together through unforgettable live music in Cairo.',
  },
};

export const DemoContext = createContext<DemoContextValue>({
  data: initialData,
  setData: () => {},
  ready: false,
  storageError: false,
});

export default function DemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eventflow-demo-v1');
      if (saved) {
        const parsed: DemoData = JSON.parse(saved);
        if (
          parsed.user &&
          Array.isArray(parsed.bookings) &&
          Array.isArray(parsed.localEvents) &&
          Array.isArray(parsed.favorites)
        ) {
          setData({ ...initialData, ...parsed });
        }
      }
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem('eventflow-demo-v1', JSON.stringify(data));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [data, ready]);

  return (
    <DemoContext.Provider value={{ data, setData, ready, storageError }}>
      {children}
      {storageError && (
        <div
          role="status"
          className="border-amber/30 text-amber shadow-card fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border bg-amber-50 p-4 text-sm"
        >
          Browser storage is unavailable or full. Your changes are available for this visit only.
        </div>
      )}
    </DemoContext.Provider>
  );
}
