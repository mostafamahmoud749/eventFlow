'use client';

import { useContext, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  MapPin,
  Save,
} from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import Button from '@/components/common/Button';
import CategoryBadge from '@/components/events/CategoryBadge';
import EventFormFields from '@/components/dashboard/EventFormFields';
import { formatDate, formatPrice } from '@/lib/format';
import type { Event } from '@/types';

const steps = ['Details', 'Date & venue', 'Seating', 'Review'];

type CreateEventFormProps = { initialEvent?: Event };

export default function CreateEventForm({ initialEvent }: CreateEventFormProps) {
  const { data, setData } = useContext(DemoContext);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Event>(
    initialEvent || {
      id: '',
      title: '',
      description: '',
      category: 'Music',
      date: '',
      doors: '19:00',
      time: '19:30',
      endTime: '22:00',
      venue: '',
      area: 'Zamalek',
      city: 'Cairo',
      image: '/images/jazz.jpg',
      organizer: data.organization.name,
      price: 450,
      vipPrice: 750,
      rows: 8,
      columns: 12,
      status: 'Draft',
      accessible: true,
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const seatingLocked = data.bookings.some((booking) => booking.eventId === initialEvent?.id);

  function validateStep(currentStep: number) {
    const fieldErrors: Record<string, string> = {};
    if (currentStep === 0) {
      if (form.title.trim().length < 3)
        fieldErrors.title = 'Use a name with at least 3 characters.';
      if (form.description.trim().length < 20)
        fieldErrors.description = 'Tell us a little more — at least 20 characters.';
    }
    if (currentStep === 1) {
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(
        new Date(),
      );
      if (!form.date || form.date < today) fieldErrors.date = 'Choose today or a future date.';
      if (!form.doors || form.doors > form.time)
        fieldErrors.doors = 'Doors must open before the event starts.';
      if (!form.time) fieldErrors.time = 'Choose a start time.';
      if (!form.endTime || form.endTime <= form.time)
        fieldErrors.endTime = 'End time must be after the start.';
      if (!form.venue.trim()) fieldErrors.venue = 'Add a venue name.';
    }
    if (currentStep === 2) {
      if (!Number.isInteger(form.rows) || form.rows < 3 || form.rows > 26)
        fieldErrors.rows = 'Choose 3–26 rows.';
      if (!Number.isInteger(form.columns) || form.columns < 2 || form.columns > 20)
        fieldErrors.columns = 'Choose 2–20 seats per row.';
      if (!Number.isFinite(form.price) || form.price < 1 || form.price > 10000)
        fieldErrors.price = 'Enter a price between EGP 1 and 10,000.';
      if (!Number.isFinite(form.vipPrice) || form.vipPrice < form.price || form.vipPrice > 10000)
        fieldErrors.vipPrice = 'VIP must be at least the Standard price and at most EGP 10,000.';
    }
    return fieldErrors;
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setErrors((prev) => ({
        ...prev,
        image: 'Choose a JPG, PNG, or WebP image smaller than 2 MB.',
      }));
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string')
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      setErrors((prev) => ({ ...prev, image: '' }));
      setUploading(false);
    };
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, image: 'This image could not be read. Try another file.' }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function saveEvent(status: Event['status']) {
    if (status === 'Published') {
      for (let index = 0; index < 3; index++) {
        const fieldErrors = validateStep(index);
        if (Object.keys(fieldErrors).length) {
          setErrors(fieldErrors);
          setStep(index);
          return null;
        }
      }
    }
    const savedEvent = {
      ...form,
      id: form.id || `local-${Date.now()}`,
      title: form.title.trim() || 'Untitled event',
      status,
    };
    setData((prev) => ({
      ...prev,
      localEvents: [...prev.localEvents.filter((event) => event.id !== savedEvent.id), savedEvent],
    }));
    setForm(savedEvent);
    setSaved(true);
    return savedEvent.id;
  }

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) {
      const fieldErrors = validateStep(step);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length) return;
      setStep(step + 1);
      setReviewed(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    for (let index = 0; index < 3; index++) {
      const fieldErrors = validateStep(index);
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
        setStep(index);
        return;
      }
    }
    if (!reviewed) {
      setErrors({ reviewed: 'Please review and confirm the event details.' });
      return;
    }
    const id = saveEvent('Published');
    if (id) router.push(`/dashboard/events/manage?id=${id}&created=true`);
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">{initialEvent ? 'Edit your event' : 'Create an event'}</h1>
          <p className="text-muted mt-3 text-sm">A few details. A whole lot of possibility.</p>
        </div>
        <Button
          variant="secondary"
          disabled={uploading}
          onClick={() => {
            const id = saveEvent(form.status);
            if (id) router.push('/dashboard/events');
          }}
        >
          <Save className="size-4" />
          Save and exit
        </Button>
      </div>
      <ol className="border-line mb-8 flex justify-between gap-2 rounded-xl border bg-white p-4 sm:p-5">
        {steps.map((label, index) => (
          <li
            key={label}
            className={`flex items-center gap-2 text-xs font-medium sm:gap-3 sm:text-sm ${index <= step ? 'text-brand' : 'text-muted'}`}
            aria-current={index === step ? 'step' : undefined}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${index <= step ? 'bg-brand text-white' : 'border-line bg-canvas border'}`}
            >
              {index < step ? <Check className="size-4" /> : index + 1}
            </span>
            <span className="hidden sm:block">{label}</span>
          </li>
        ))}
      </ol>
      <form noValidate onSubmit={handleContinue} onChange={() => setSaved(false)}>
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="border-line min-w-0 rounded-xl border bg-white p-6 sm:p-8">
            <EventFormFields
              step={step}
              form={form}
              setForm={setForm}
              errors={errors}
              seatingLocked={seatingLocked}
              onImageChange={handleImageChange}
            />
            {step === 3 && (
              <div className="border-line mt-7 border-t pt-5">
                <label className="flex items-start gap-3 text-sm leading-6">
                  <input
                    type="checkbox"
                    checked={reviewed}
                    onChange={(e) => setReviewed(e.target.checked)}
                    className="mt-1 size-4 shrink-0"
                  />
                  I’ve reviewed the details and ticket prices. This event will be published only in
                  my browser.
                </label>
                {errors.reviewed && (
                  <p role="alert" className="text-danger mt-2 text-sm">
                    {errors.reviewed}
                  </p>
                )}
              </div>
            )}
          </div>
          <aside className="border-line min-w-0 rounded-xl border bg-white p-5 xl:sticky xl:top-6">
            <p className="mb-4 text-sm font-semibold">Your event, at a glance</p>
            <div className="relative mb-4 h-40 overflow-hidden rounded-lg">
              <Image
                src={form.image}
                alt="Cover image preview"
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
            <CategoryBadge category={form.category} />
            <h2 className="mt-3 mb-4 text-xl">{form.title || 'Your next great event'}</h2>
            <p className="text-muted mb-3 flex items-center gap-2 text-xs">
              <CalendarDays className="size-4" />
              {form.date ? formatDate(form.date, true) : 'Pick the perfect day'}
            </p>
            <p className="text-muted flex items-center gap-2 text-xs">
              <MapPin className="size-4" />
              {form.venue || 'Find the right place'}
            </p>
            <div className="border-line mt-5 flex flex-wrap gap-2 border-t pt-4">
              <span className="bg-mint text-brand rounded px-2 py-1 text-xs font-medium">
                Standard {formatPrice(form.price)}
              </span>
              <span className="bg-coral/15 rounded px-2 py-1 text-xs font-medium text-[#8f3926]">
                VIP {formatPrice(form.vipPrice)}
              </span>
            </div>
            <p className="text-muted mt-5 text-xs leading-5">
              This preview updates as you go. Your event and cover image are saved locally.
            </p>
          </aside>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="secondary"
            disabled={step === 0}
            onClick={() => {
              setStep(step - 1);
              setErrors({});
            }}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            {saved && (
              <span role="status" className="text-brand flex items-center gap-1 text-xs">
                <CheckCircle2 className="size-4" />
                Saved locally
              </span>
            )}
            <Button variant="secondary" disabled={uploading} onClick={() => saveEvent(form.status)}>
              <Save className="size-4" />
              {form.status === 'Published' ? 'Save changes' : 'Save draft'}
            </Button>
            <Button type="submit" disabled={uploading}>
              {step === 3 ? 'Publish demo event' : 'Continue'}
              {step === 3 ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
