import { getCatalog } from '@/lib/catalog';
import PackagesClient from '@/components/PackagesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'The Detail & Pricing | Mobile Car Detailing',
  description: 'One complete detail, priced up front by vehicle size, for cars, trucks and SUVs in Marco Island and Naples, FL. Add-ons and maintenance plans that keep it clean.',
  alternates: { canonical: '/packages' },
  openGraph: {
    title: 'The Detail & Pricing | Buffer Bros Mobile Detailing',
    description: 'One detail, done right every time. Showroom finish inside and out, priced up front.',
    url: '/packages',
  },
};

export default async function PackagesPage() {
  const catalog = await getCatalog();
  return <PackagesClient catalog={catalog} />;
}
