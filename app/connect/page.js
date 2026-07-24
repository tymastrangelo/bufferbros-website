import Link from 'next/link';
import { BB } from '@/lib/site';

export const metadata = {
  title: 'Connect with Buffer Bros',
  description: 'Book, call, text, or follow Buffer Bros Mobile Detailing in Marco Island and Naples, FL.',
  alternates: { canonical: '/connect' },
  robots: { index: false },
};

export default function ConnectPage() {
  return (
    <section className="section-dark flex flex-col items-center justify-center min-h-[100svh] px-6 text-center text-white">
      <Link href="/"><img src="/images/transparent-logo.png" alt="Buffer Bros logo" className="w-56 mb-5" /></Link>
      <h1 className="text-3xl font-bold text-white mb-2">Buffer Bros Detailing</h1>
      <p className="text-gray-400 mb-8">Mobile detailing in Marco Island and Naples</p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link href="/booking" className="btn btn-primary btn-block"><i className="fas fa-calendar-check" aria-hidden /> Book an Appointment</Link>
        <a href={BB.phoneHref} className="btn btn-block" style={{ background: '#16a34a', color: '#fff' }}><i className="fas fa-phone-alt" aria-hidden /> Call Us</a>
        <a href={BB.smsHref} className="btn btn-block" style={{ background: '#0ea5e9', color: '#fff' }}><i className="fas fa-message" aria-hidden /> Text Us</a>
        <a href={BB.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-block"
           style={{ background: 'linear-gradient(135deg,#feda75,#d62976 45%,#962fbf 75%,#4f5bd5)', color: '#fff' }}>
          <i className="fab fa-instagram" aria-hidden /> Instagram
        </a>
        <a href={BB.reviewLink} target="_blank" rel="noopener noreferrer" className="btn btn-block" style={{ background: '#eab308', color: '#0a0e14' }}>
          <i className="fas fa-star" aria-hidden /> Leave a Google Review
        </a>
        <Link href="/packages" className="btn btn-block" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>View the Detail &amp; Pricing</Link>
      </div>

      <p className="text-gray-500 text-xs mt-10">&copy; 2026 Buffer Bros Detailing</p>
    </section>
  );
}
