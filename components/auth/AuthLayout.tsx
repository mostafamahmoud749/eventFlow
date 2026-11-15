import Image from 'next/image';
import { Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';

type AuthLayoutProps = { register?: boolean };

export default function AuthLayout({ register = false }: AuthLayoutProps) {
  return (
    <div className="page-container py-8 lg:py-12">
      <div className="border-line grid overflow-hidden rounded-2xl border bg-white lg:min-h-[680px] lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <Image
            src="/images/jazz.jpg"
            alt="The warm glow of a live jazz performance"
            fill
            priority
            sizes="600px"
            className="object-cover"
          />
          <div className="from-ink via-ink/25 to-ink/30 absolute inset-0 bg-gradient-to-t" />
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest">
              <Sparkles className="text-coral size-4" />
              GOOD PLANS START HERE
            </span>
            <div>
              <span className="bg-coral mb-6 block h-1.5 w-14 rounded-full" />
              <h2 className="max-w-sm text-5xl leading-[1.13]">
                Be there for the moments that matter.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
                The music you feel. The people you meet. The stories you’ll tell.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center px-6 py-10 sm:px-12 lg:px-14">
          <Suspense fallback={<p>Loading form…</p>}>
            <AuthForm register={register} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
