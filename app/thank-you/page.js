import Link from 'next/link';
import { IconCheckCircle } from '@/components/Icons';

export const metadata = { title: 'Thank You', robots: { index: false } };

export default function ThankYouPage() {
  return (
    <section className="section section-sand min-h-[70svh] grid place-items-center">
      <div className="card text-center p-10 max-w-md mx-4 rise">
        <IconCheckCircle size={56} weight="fill" className="mx-auto text-[color:var(--color-ok)]" />
        <h1 className="text-3xl mt-4">Thank you</h1>
        <p className="mt-3">We have your request and will be in touch shortly.</p>
        <Link href="/" className="btn btn-dark mt-7">Back to home</Link>
      </div>
    </section>
  );
}
