import Image from 'next/image';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { CheckCircle2, ImagePlus, Info, Users } from 'lucide-react';
import Input from '@/components/common/Input';
import { categories } from '@/data/events';
import { formatDate, formatPrice } from '@/lib/format';
import type { Category, Event } from '@/types';

type EventFormFieldsProps = {
  step: number;
  form: Event;
  setForm: Dispatch<SetStateAction<Event>>;
  errors: Record<string, string>;
  seatingLocked: boolean;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function EventFormFields({
  step,
  form,
  setForm,
  errors,
  seatingLocked,
  onImageChange,
}: EventFormFieldsProps) {
  function updateField(field: keyof Event, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (step === 0)
    return (
      <div className="space-y-5">
        <h2 className="mb-6 text-2xl">Start with the good stuff.</h2>
        <Input
          label="Event name"
          name="title"
          placeholder="Give your event a memorable name"
          value={form.title}
          error={errors.title}
          onChange={(e) => updateField('title', e.target.value)}
          required
        />
        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            className="field"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value as Category)}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Tell people what to expect
          </label>
          <textarea
            id="description"
            rows={5}
            placeholder="The atmosphere, the experience, the reason they’ll want to be there…"
            className="field resize-y"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <p id="description-error" className="text-danger mt-1 text-sm">
              {errors.description}
            </p>
          )}
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Cover image</p>
          <label
            htmlFor="cover"
            className="border-brand/30 bg-mint/30 hover:bg-mint flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center"
          >
            <ImagePlus className="text-brand size-7" />
            <span className="text-brand text-sm font-semibold">Choose an image</span>
            <span className="text-muted text-xs">
              JPG, PNG, or WebP · Up to 2 MB
              <br />
              The sample cover is used until you choose one.
            </span>
            <input
              id="cover"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onImageChange}
              className="file:text-brand w-full min-w-0 max-w-full text-xs file:mr-3 file:rounded file:border-0 file:bg-white file:p-2"
            />
          </label>
          {errors.image && (
            <p role="alert" className="text-danger mt-2 text-sm">
              {errors.image}
            </p>
          )}
        </div>
      </div>
    );

  if (step === 1)
    return (
      <div className="space-y-5">
        <h2 className="mb-6 text-2xl">A time and a place.</h2>
        <Input
          label="Event date"
          name="date"
          type="date"
          value={form.date}
          error={errors.date}
          onChange={(e) => updateField('date', e.target.value)}
          required
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Doors open"
            name="doors"
            type="time"
            value={form.doors}
            error={errors.doors}
            onChange={(e) => updateField('doors', e.target.value)}
          />
          <Input
            label="Starts at"
            name="time"
            type="time"
            value={form.time}
            error={errors.time}
            onChange={(e) => updateField('time', e.target.value)}
          />
          <Input
            label="Ends at"
            name="endTime"
            type="time"
            value={form.endTime}
            error={errors.endTime}
            onChange={(e) => updateField('endTime', e.target.value)}
          />
        </div>
        <p className="text-muted flex items-center gap-2 text-xs">
          <Info className="size-4" />
          All times use Africa/Cairo. This simple form supports same-day events.
        </p>
        <Input
          label="Venue name"
          name="venue"
          placeholder="Where is it happening?"
          value={form.venue}
          error={errors.venue}
          onChange={(e) => updateField('venue', e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium">
              City
            </label>
            <select
              id="city"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="field"
            >
              <option>Cairo</option>
            </select>
          </div>
          <div>
            <label htmlFor="area" className="mb-2 block text-sm font-medium">
              Neighborhood
            </label>
            <select
              id="area"
              value={form.area}
              onChange={(e) => updateField('area', e.target.value)}
              className="field"
            >
              {['Zamalek', 'Downtown', 'Maadi', 'Nasr City', 'New Cairo'].map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-3 pt-2 text-sm">
          <input
            type="checkbox"
            checked={form.accessible}
            onChange={(e) => updateField('accessible', e.target.checked)}
            className="size-4"
          />
          This venue is wheelchair accessible
        </label>
      </div>
    );

  if (step === 2)
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl">A seat for everyone.</h2>
          <p className="text-muted mt-3 text-sm leading-6">
            A simple theatre layout with a center aisle. The first two rows are VIP; the remaining
            rows are Standard.
          </p>
        </div>
        {seatingLocked && (
          <p className="text-amber rounded-lg bg-amber-50 p-3 text-xs leading-5">
            This event has demo bookings, so its seating layout and ticket prices are fixed.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Number of rows"
            name="rows"
            type="number"
            min="3"
            max="26"
            step="1"
            value={form.rows || ''}
            error={errors.rows}
            disabled={seatingLocked}
            onChange={(e) => updateField('rows', Number(e.target.value))}
          />
          <Input
            label="Seats per row"
            name="columns"
            type="number"
            min="2"
            max="20"
            step="1"
            value={form.columns || ''}
            error={errors.columns}
            disabled={seatingLocked}
            onChange={(e) => updateField('columns', Number(e.target.value))}
          />
          <Input
            label="Standard ticket (EGP)"
            name="price"
            type="number"
            min="1"
            max="10000"
            step="1"
            value={form.price || ''}
            error={errors.price}
            disabled={seatingLocked}
            onChange={(e) => updateField('price', Number(e.target.value))}
          />
          <Input
            label="VIP ticket (EGP)"
            name="vipPrice"
            type="number"
            min="1"
            max="10000"
            step="1"
            value={form.vipPrice || ''}
            error={errors.vipPrice}
            disabled={seatingLocked}
            onChange={(e) => updateField('vipPrice', Number(e.target.value))}
          />
        </div>
        <div className="bg-canvas overflow-x-auto rounded-xl p-5">
          <div className="mx-auto w-max">
            <div className="bg-brand/15 text-brand mb-5 rounded-t-[50%] py-2 text-center text-[10px] font-semibold tracking-widest">
              STAGE
            </div>
            {Array.from({ length: Math.min(26, Math.max(0, form.rows)) }, (_, row) => (
              <div key={row} className="mb-1.5 flex items-center gap-1">
                <span className="text-muted mr-1 w-4 text-[10px]">
                  {String.fromCharCode(65 + row)}
                </span>
                {Array.from({ length: Math.min(20, Math.max(0, form.columns)) }, (_, column) => (
                  <span
                    key={column}
                    className={`flex size-5 items-center justify-center rounded text-[9px] ${row < 2 ? 'bg-coral/25 text-[#8f3926]' : 'bg-brand/15 text-brand'} ${column === Math.ceil(form.columns / 2) ? 'ml-3' : ''}`}
                  >
                    {column + 1}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-mint text-brand flex items-center justify-between rounded-lg p-4 text-sm">
          <span className="flex items-center gap-2">
            <Users className="size-4" />
            Total capacity
          </span>
          <strong>{form.rows * form.columns} seats</strong>
        </div>
        <p className="text-muted text-xs">
          VIP: {2 * form.columns} seats · Standard: {Math.max(0, form.rows - 2) * form.columns}{' '}
          seats
        </p>
      </div>
    );

  return (
    <div>
      <h2 className="mb-3 text-2xl">Ready for your big moment?</h2>
      <p className="text-muted mb-6 text-sm leading-6">
        Take one last look. Publishing here adds the event to your local demo only.
      </p>
      <div className="relative mb-5 h-52 overflow-hidden rounded-xl">
        <Image
          src={form.image}
          alt="Your event cover preview"
          fill
          sizes="600px"
          className="object-cover"
        />
      </div>
      <h3 className="text-2xl">{form.title}</h3>
      <p className="text-muted mt-3 mb-5 text-sm leading-6 whitespace-pre-line">
        {form.description}
      </p>
      <div className="border-line space-y-4 border-t pt-5">
        {[
          {
            label: 'Date & venue',
            value: `${form.date ? formatDate(form.date, true) : 'No date'} · ${form.venue}`,
          },
          {
            label: 'Standard seats',
            value: `${Math.max(0, form.rows - 2) * form.columns} × ${formatPrice(form.price)}`,
          },
          { label: 'VIP seats', value: `${2 * form.columns} × ${formatPrice(form.vipPrice)}` },
          { label: 'Organizer', value: form.organizer },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <CheckCircle2 className="text-brand mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-muted mt-1 text-xs leading-5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
