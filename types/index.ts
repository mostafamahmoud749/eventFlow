export type Category = 'Music' | 'Sports' | 'Arts' | 'Theatre' | 'Workshops';

export type Event = {
  id: string;
  title: string;
  description: string;
  category: Category;
  date: string;
  doors: string;
  time: string;
  endTime: string;
  venue: string;
  area: string;
  city: string;
  image: string;
  organizer: string;
  price: number;
  vipPrice: number;
  rows: number;
  columns: number;
  status: 'Published' | 'Draft';
  accessible: boolean;
};

export type Seat = {
  id: string;
  row: string;
  number: number;
  tier: 'VIP' | 'Standard';
  price: number;
  status: 'available' | 'sold' | 'held';
};

export type User = { name: string; email: string; city: string; notifications: boolean };
export type Booking = {
  id: string;
  eventId: string;
  seats: Seat[];
  total: number;
  name: string;
  email: string;
};
export type SeatHold = { eventId: string; seats: Seat[]; expiresAt: number };
