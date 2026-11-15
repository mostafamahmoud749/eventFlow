'use client';

import { useContext, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Ticket, CalendarPlus, Check } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { DemoContext } from '@/components/common/DemoProvider';

type AuthFormProps = { register?: boolean };

export default function AuthForm({ register = false }: AuthFormProps) {
  const { setData } = useContext(DemoContext);
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('customer');
  const [agreed, setAgreed] = useState(false);
  const next = params.get('next') || '';
  const safeNext =
    next.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/profile';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors: Record<string, string> = {};
    if (register && form.name.trim().length < 2) fieldErrors.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      fieldErrors.email = 'Please enter a valid email address.';
    if (form.password.length < 8) fieldErrors.password = 'Use at least 8 characters.';
    if (register && form.confirm !== form.password)
      fieldErrors.confirm = 'The passwords don’t match.';
    if (register && !agreed) fieldErrors.agreed = 'Please acknowledge the demo account notice.';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;
    // Passwords are validated for the UI only. They are never stored or sent anywhere.
    setData((prev) => ({
      ...prev,
      signedIn: true,
      user: {
        ...prev.user,
        name: register ? form.name.trim() : prev.user.name,
        email: form.email.trim(),
      },
    }));
    router.push(register && role === 'organizer' && !next ? '/dashboard' : safeNext);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <span className="text-brand text-xs font-semibold tracking-[2px]">
        {register ? 'MORE GOOD PLANS AHEAD' : 'GOOD TO SEE YOU AGAIN'}
      </span>
      <h1 className="mt-3 text-3xl leading-tight lg:text-4xl">
        {register ? 'Make room for great experiences.' : 'Welcome back.'}
      </h1>
      <p className="text-muted mt-4 mb-7 text-sm leading-6">
        {register
          ? 'Discover your next favorite thing. Create your EventFlow account.'
          : 'Your tickets, saved events, and next great night are waiting.'}
      </p>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {register && (
          <fieldset className="grid grid-cols-2 gap-3">
            <legend className="sr-only">Account interest</legend>
            {[
              { value: 'customer', label: 'Book events', icon: Ticket },
              { value: 'organizer', label: 'Organize events', icon: CalendarPlus },
            ].map(({ value, label, icon: Icon }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-xs font-semibold ${role === value ? 'border-brand bg-mint text-brand' : 'border-line'}`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === value}
                  onChange={() => setRole(value)}
                  className="sr-only"
                />
                <Icon className="size-5" />
                {label}
                {role === value && <Check className="ml-auto size-4" />}
              </label>
            ))}
          </fieldset>
        )}
        {register && (
          <Input
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        )}
        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete={register ? 'new-password' : 'current-password'}
            placeholder="At least 8 characters"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted absolute top-8 right-2 flex size-10 items-center justify-center"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {register && (
          <Input
            label="Confirm password"
            name="confirm"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Enter your password again"
            value={form.confirm}
            error={errors.confirm}
            onChange={(e) => setForm((prev) => ({ ...prev, confirm: e.target.value }))}
          />
        )}
        {register && (
          <div>
            <label className="text-muted flex items-start gap-3 text-xs leading-5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 size-4 shrink-0"
              />
              I understand this is a demo account stored in this browser.
            </label>
            {errors.agreed && (
              <p role="alert" className="text-danger mt-2 text-xs">
                {errors.agreed}
              </p>
            )}
          </div>
        )}
        <Button type="submit" className="w-full">
          {register ? 'Create demo account' : 'Log in to demo'}
          <ArrowRight className="size-4" />
        </Button>
      </form>
      <p className="text-muted mt-6 text-center text-sm">
        {register ? 'Already part of the good times?' : 'New to EventFlow?'}{' '}
        <Link
          href={`${register ? '/login' : '/register'}${next ? `?next=${encodeURIComponent(safeNext)}` : ''}`}
          className="text-brand font-semibold underline-offset-4 hover:underline"
        >
          {register ? 'Log in' : 'Create an account'}
        </Link>
      </p>
      <p className="bg-mint/60 text-muted mt-7 rounded-lg px-4 py-3 text-xs leading-5">
        Frontend demo · Any valid email and a password of 8+ characters work. Passwords are never
        saved. No real authentication takes place.
      </p>
    </div>
  );
}
