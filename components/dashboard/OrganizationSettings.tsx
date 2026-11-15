'use client';

import { useContext, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { AudioLines, CheckCircle2 } from 'lucide-react';
import { DemoContext } from '@/components/common/DemoProvider';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function OrganizationSettings() {
  const { data, setData, ready } = useContext(DemoContext);
  const [form, setForm] = useState(data.organization);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (ready) setForm(data.organization);
  }, [ready, data.organization]);

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) fieldErrors.name = 'Enter your organization’s name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      fieldErrors.email = 'Enter a valid contact email.';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;
    setData((prev) => ({
      ...prev,
      organization: { ...form, name: form.name.trim(), email: form.email.trim() },
    }));
    setSaved(true);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl">Organization settings</h1>
      <p className="text-muted mt-3 mb-8 text-sm">The people behind the good times.</p>
      <form
        noValidate
        onSubmit={handleSave}
        onChange={() => setSaved(false)}
        className="border-line rounded-xl border bg-white p-6 sm:p-8"
      >
        <div className="mb-8 flex items-center gap-4">
          <span className="bg-ink flex size-16 items-center justify-center rounded-xl text-white">
            <AudioLines className="size-8" />
          </span>
          <div>
            <h2 className="text-xl">{form.name || 'Your organization'}</h2>
            <p className="text-muted mt-1 text-sm">EventFlow organizer</p>
          </div>
        </div>
        <div className="space-y-6">
          <Input
            label="Organization name"
            name="name"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            label="Contact email"
            name="email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              About your organization
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="field resize-y"
            />
          </div>
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-end gap-4">
          {saved && (
            <p role="status" className="text-brand flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4" />
              Saved locally
            </p>
          )}
          <Button type="submit">Save changes</Button>
        </div>
      </form>
      <p className="text-muted mt-5 text-xs">
        These preferences apply to your local demo workspace and future events.
      </p>
    </div>
  );
}
