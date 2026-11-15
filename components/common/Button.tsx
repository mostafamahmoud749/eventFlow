import type { ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const styles = {
    primary: 'bg-brand text-white hover:bg-brand-hover',
    secondary: 'border border-line bg-white hover:border-brand hover:text-brand',
    ghost: 'text-muted hover:bg-mint hover:text-brand',
  };
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
