import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section section-sand min-h-[70svh] grid place-items-center">
      <div className="card text-center p-10 max-w-md mx-4">
        <p className="kicker">404</p>
        <h1 className="text-3xl mt-2">That page took a wrong turn</h1>
        <p className="mt-3">The page you were looking for is not here. Your car can still get detailed, though.</p>
        <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/" className="btn btn-outline">Back to home</Link>
          <Link href="/booking" className="btn btn-primary">Book a detail</Link>
        </div>
      </div>
    </section>
  );
}
