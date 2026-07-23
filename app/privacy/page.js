import { BB } from '@/lib/site';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Buffer Bros Mobile Detailing collects and uses your information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <section className="section section-light">
      <div className="container max-w-3xl prose-legal">
        <span className="eyebrow">Legal</span>
        <h1 className="text-4xl font-extrabold mt-3 mb-6">Privacy Policy</h1>

        <p>At Buffer Bros Mobile Detailing, we value your privacy. When you book an appointment or submit your contact information through our forms or ads, we collect details such as your name, phone number, email, service address, and information about your vehicle and requested services.</p>

        <h2>How we use your information</h2>
        <ul>
          <li>To contact you about your appointment or request</li>
          <li>To schedule, confirm, and carry out your services</li>
          <li>To send follow-up messages such as appointment reminders or review requests</li>
        </ul>

        <p>We will never sell, share, or distribute your information to third parties for marketing purposes. Your data stays secure and is only used for business communication between you and Buffer Bros.</p>

        <h2>Deleting your information</h2>
        <p>If you would like your information removed from our records at any time, just contact us at <a href={BB.phoneHref} className="text-brand font-semibold">{BB.phone}</a>.</p>
      </div>
    </section>
  );
}
