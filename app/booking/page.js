import { Suspense } from 'react';
import { getCatalog } from '@/lib/catalog';
import BookingClient from '@/components/BookingClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Book an Appointment — Mobile Detailing in Marco Island & Naples',
  description: 'Book your mobile detailing appointment with Buffer Bros online. Pick your vehicle size, choose a real open time, and we come to your driveway in Marco Island or Naples, FL.',
  alternates: { canonical: '/booking' },
  openGraph: {
    title: 'Book an Appointment | Buffer Bros Mobile Detailing',
    description: 'Pick your vehicle, choose a time, and we come to you.',
    url: '/booking',
  },
};

export default async function BookingPage() {
  const catalog = await getCatalog();
  return (
    <Suspense>
      <BookingClient catalog={catalog} />
    </Suspense>
  );
}
