'use client';

import { useContext } from 'react';
import { Heart } from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';

type FavoriteButtonProps = { id: string; title: string };

export default function FavoriteButton({ id, title }: FavoriteButtonProps) {
  const { data, setData } = useContext(DemoContext);
  const selected = data.favorites.includes(id);
  function toggleFavorite() {
    setData((prev) => ({
      ...prev,
      favorites: selected ? prev.favorites.filter((item) => item !== id) : [...prev.favorites, id],
    }));
  }
  return (
    <button
      aria-label={`${selected ? 'Unsave' : 'Save'} ${title}`}
      aria-pressed={selected}
      onClick={toggleFavorite}
      className="text-ink hover:text-coral flex size-11 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
    >
      <Heart className={`size-5 ${selected ? 'fill-coral text-coral' : ''}`} />
    </button>
  );
}
