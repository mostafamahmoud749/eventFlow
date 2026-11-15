import type { ComponentPropsWithoutRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string;
  inputClassName?: string;
};

export default function Input({ label, error, id, name, className = '', inputClassName = '', ...props }: InputProps) {
  const fieldId = id || name;
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={fieldId} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input
        id={fieldId}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`field ${error ? 'border-danger' : ''} ${inputClassName}`}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} className="text-danger mt-1.5 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
