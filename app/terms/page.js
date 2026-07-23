import { BB } from '@/lib/site';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Buffer Bros Mobile Detailing terms and conditions of service.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <section className="section bg-white">
      <div className="container max-w-3xl">
        <span className="eyebrow">Legal</span>
        <h1 className="text-4xl font-extrabold mt-3 mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--slate-soft)' }}>Last updated: May 31, 2026</p>

        <div className="prose-legal">
          <p>These Terms and Conditions (&ldquo;Terms&rdquo;) apply to all detailing services provided by Buffer Bros Mobile Detailing (&ldquo;Buffer Bros,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By booking an appointment, paying for, or receiving our services, you (&ldquo;the Customer&rdquo;) agree to these Terms. Please read them carefully.</p>

          <h2>1. Services and pricing</h2>
          <ul>
            <li>Prices listed on our website and booking page are estimates based on a vehicle in average condition for its size class.</li>
            <li>Final pricing is determined at the time of service. Buffer Bros reserves the right to adjust the price if a vehicle requires more time, labor, or product than its listed package and size class normally call for. This includes, without limitation, vehicles that are excessively dirty or soiled, have heavy pet hair, mold, biological matter, excessive sand or mud, smoke odor, or stains and conditions beyond normal use.</li>
            <li>If an adjustment is needed, we will tell you the revised price before we begin or continue the work, and you may approve the new price or decline the service.</li>
            <li>Vehicles larger than, or in worse condition than, a listed size class may be quoted at a higher rate at our sole discretion.</li>
            <li>Maintenance plan per-visit rates are set individually with each customer at their first visit and confirmed in writing. Plan rates assume the agreed visit cadence is kept; a lapsed schedule may require a fresh Standard Detail at the regular rate to restart.</li>
          </ul>

          <h2>2. Pre and post service inspection</h2>
          <ul>
            <li>We perform a walkaround inspection of your vehicle before we begin and again after we finish. We may photograph or video the vehicle as part of this inspection.</li>
            <li>These inspections document the condition of the vehicle and protect both you and us. By booking, you consent to this documentation.</li>
            <li>Any pre-existing damage, wear, defects, or conditions noted during the pre-service inspection are not the responsibility of Buffer Bros.</li>
          </ul>

          <h2>3. Limitation of liability</h2>
          <ul>
            <li>Buffer Bros takes great care with every vehicle. However, to the fullest extent permitted by law, Buffer Bros is not liable for any damage to a vehicle that results from pre-existing conditions, defects, wear, prior repairs, aftermarket modifications, loose or failing parts, fragile or deteriorated trim, clear coat failure, oxidation, rust, water intrusion through existing leaks, or any condition not caused by our negligence.</li>
            <li>We are not responsible for personal items left in or on the vehicle. Please remove valuables before your appointment.</li>
            <li>Detailing can reveal cosmetic imperfections (such as swirl marks, scratches, or paint defects) that were previously hidden by dirt or films. Revealing a pre-existing condition is not damage caused by us.</li>
            <li>To the maximum extent permitted by law, our total liability for any claim relating to a service is limited to the amount you paid for that specific service.</li>
            <li>Nothing in these Terms limits liability that cannot be limited under applicable law.</li>
          </ul>

          <h2>4. Vehicle access, location, and water/power</h2>
          <ul>
            <li>As a mobile service, we need safe, legal, and reasonable access to your vehicle and enough space to work around it.</li>
            <li>We carry our own water and power. If you ask us to use your water or electricity, you do so at your own risk.</li>
            <li>You are responsible for ensuring the work location complies with any HOA, building, or municipal rules.</li>
          </ul>

          <h2>5. Scheduling, cancellations, and arrival windows</h2>
          <ul>
            <li>Appointment times may be given as a window. Weather, traffic, and the condition of vehicles earlier in the day can affect timing, and we appreciate your flexibility.</li>
            <li>We reserve the right to reschedule due to severe weather or conditions that make safe, quality work impossible.</li>
            <li>Please give us as much notice as possible if you need to cancel or reschedule so we can offer the slot to someone else.</li>
          </ul>

          <h2>6. Results and satisfaction</h2>
          <ul>
            <li>Detailing is restorative, not a guarantee of a flawless result. Some stains, odors, scratches, water spots, and oxidation may be permanent and cannot be fully removed.</li>
            <li>If you are not satisfied with our work, please tell us within 24 hours of the appointment so we have a fair chance to address it.</li>
          </ul>

          <h2>7. Payment</h2>
          <ul>
            <li>Payment is due upon completion of the service unless arranged otherwise in advance.</li>
            <li>Returned payments or chargebacks may be subject to additional fees.</li>
          </ul>

          <h2>8. Photos and marketing</h2>
          <ul>
            <li>We may use before and after photos or video of your vehicle for marketing and social media. We will not publish identifying details such as license plates or your personal information. Let us know in writing if you prefer we do not feature your vehicle.</li>
          </ul>

          <h2>9. Changes to these Terms</h2>
          <ul>
            <li>We may update these Terms from time to time. The version in effect at the time of your appointment applies to that appointment.</li>
          </ul>

          <h2>10. Contact</h2>
          <p>Questions about these Terms? Call or text us at <a href={BB.phoneHref} className="text-brand font-semibold">{BB.phone}</a>.</p>

          <p className="mt-10 text-sm" style={{ color: 'var(--slate-soft)' }}><em>This page is provided for general informational purposes and is not legal advice. We recommend having these Terms reviewed by a licensed attorney in Florida before relying on them.</em></p>
        </div>
      </div>
    </section>
  );
}
