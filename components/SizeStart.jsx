import Link from 'next/link';
import { IconCar } from '@/components/Icons';

/* "What do you drive?" quick start: one tap into booking with the size chosen.
   Used in the hero and again after "How it works". */
const SHORT = { sedan: 'Car or sedan', midsize: 'Midsize SUV', large: 'Large SUV or truck' };

export default function SizeStart({ catalog: S, label = 'What do you drive?', className = '' }) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold text-ink">{label}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        {S.sizes.map((s) => (
          <Link key={s.id} href={`/booking?size=${s.id}&freq=onetime`}
                className="group rounded-2xl border border-[color:var(--line)] bg-white px-3 py-3.5 sm:px-4 sm:py-4 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--shadow-md)] active:scale-[0.98]">
            <IconCar size={22} className="text-ink-2 transition-[color,transform] duration-300 ease-out group-hover:text-brand group-hover:translate-x-1" />
            <span className="mt-2 block text-[0.82rem] sm:text-sm font-semibold leading-tight text-ink">{SHORT[s.id] ?? s.label}</span>
            <span className="mt-0.5 block text-sm text-ink-2 num">from {S.currency}{(S.detail.pricing[s.id] || {}).price}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
