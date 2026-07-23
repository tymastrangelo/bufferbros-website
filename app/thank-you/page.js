import Link from 'next/link';

export const metadata = {
  title: 'Thank You',
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <section className="section section-tint flex items-center justify-center min-h-[70svh]">
      <div className="card text-center p-10 max-w-md mx-4">
        <div className="h-16 w-16 mx-auto rounded-full bg-green-100 text-green-600 grid place-items-center text-3xl mb-4"><i className="fas fa-check" aria-hidden /></div>
        <h1 className="text-3xl font-bold mb-3">Thank you</h1>
        <p className="mb-6" style={{ color: 'var(--slate)' }}>We have received your request and will be in touch shortly.</p>
        <Link href="/" className="btn btn-primary">Return Home</Link>
      </div>
    </section>
  );
}
