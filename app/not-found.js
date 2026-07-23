import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section flex items-center justify-center min-h-[70svh]" style={{ background: 'var(--surface-2)' }}>
      <div className="card text-center p-10 max-w-md mx-4">
        <p className="eyebrow justify-center">404</p>
        <h1 className="text-3xl font-bold mt-3 mb-3">That page took a wrong turn</h1>
        <p className="mb-6" style={{ color: 'var(--slate)' }}>
          The page you are looking for does not exist. Your car can still get detailed, though.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/" className="btn btn-outline">Back to home</Link>
          <Link href="/booking" className="btn btn-primary">Book a detail</Link>
        </div>
      </div>
    </section>
  );
}
