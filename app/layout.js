import { Archivo } from 'next/font/google';
import Script from 'next/script';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Attribution from '@/components/Attribution';
import ActionBar from '@/components/ActionBar';
import OfferPopup from '@/components/OfferPopup';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });

/* LocalBusiness structured data — feeds Google's local results and knowledge panel. */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoWash',
  '@id': 'https://bufferbros.org/#business',
  name: 'Buffer Bros Mobile Detailing',
  url: 'https://bufferbros.org',
  logo: 'https://bufferbros.org/images/black-logo.png',
  image: 'https://bufferbros.org/images/aston-db11.jpg',
  description: 'Mobile car, truck and boat detailing serving Marco Island and Naples, FL. One complete detail with a showroom finish, priced up front. We come to your driveway, garage or dock.',
  telephone: '+1-239-293-8511',
  priceRange: '$$',
  areaServed: [
    { '@type': 'City', name: 'Marco Island', sameAs: 'https://en.wikipedia.org/wiki/Marco_Island,_Florida' },
    { '@type': 'City', name: 'Naples', sameAs: 'https://en.wikipedia.org/wiki/Naples,_Florida' },
  ],
  address: { '@type': 'PostalAddress', addressRegion: 'FL', addressCountry: 'US' },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '18:00',
  }],
  sameAs: [
    'https://www.instagram.com/bufferbros.fl',
    'https://www.facebook.com/profile.php?id=61560055724078',
    'https://maps.app.goo.gl/y6Ws2vG7vtHUXxGX7',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Detailing services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'The Standard Detail', description: 'Complete interior and exterior mobile detail with a showroom finish.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Maintenance detailing plans', description: 'Weekly, bi-weekly or monthly recurring details at a lower per-visit rate.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ceramic coating', description: 'Ceramic paint protection applied at your home.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Boat detailing', description: 'Mobile boat detailing at your dock, lift or trailer, quoted individually.' } },
    ],
  },
  potentialAction: {
    '@type': 'ReserveAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://bufferbros.org/booking', actionPlatform: 'https://schema.org/DesktopWebPlatform' },
    result: { '@type': 'Reservation', name: 'Mobile detailing appointment' },
  },
};

export const metadata = {
  metadataBase: new URL('https://bufferbros.org'),
  title: {
    default: 'Buffer Bros | Mobile Car Detailing in Marco Island & Naples',
    template: '%s | Buffer Bros Mobile Detailing',
  },
  description: 'Buffer Bros brings car detailing to your driveway in Marco Island and Naples, FL. One complete detail, priced up front. Book online in about a minute.',
  icons: { icon: '/images/favicon.png', apple: '/images/apple-touch-icon.png' },
  openGraph: {
    siteName: 'Buffer Bros Mobile Detailing',
    images: ['/images/aston-db11.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={archivo.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <ActionBar />
        <Attribution />
        <OfferPopup />
        {/* Load the tag off the Ads ID — the GA4 id G-WG9M9W3RL8 404s (dead property), which broke the whole tag. */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17448688864" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17448688864');
        `}</Script>
      </body>
    </html>
  );
}
