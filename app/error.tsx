'use client';

import Button from '@/components/common/Button';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page-container py-24 text-center">
      <h1 className="text-3xl">Something interrupted the good plans.</h1>
      <p className="text-muted mt-4">
        Try loading this page again. Your saved demo data stays in your browser.
      </p>
      <Button onClick={reset} className="mt-7">
        Try again
      </Button>
    </div>
  );
}
