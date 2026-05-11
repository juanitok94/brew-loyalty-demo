import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — Odds Perk Pass",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium mb-8"
        style={{ color: "var(--brown)" }}
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-[#8B1E1E] mb-1">
        Terms &amp; Conditions
      </h1>
      <p className="text-lg font-semibold text-[#8B1E1E] mb-6">Odds Perk Pass</p>

      <div
        className="rounded-2xl p-6 mb-8 space-y-1 text-sm"
        style={{ background: "var(--cream)", color: "var(--brown-light)" }}
      >
        <p><span className="font-semibold">Effective Date:</span> May 2026</p>
        <p><span className="font-semibold">Operator:</span> Peachy Kean DevOps LLC</p>
        <p><span className="font-semibold">Program:</span> Odds Perk Pass, powered by Brew Loyalty</p>
        <p><span className="font-semibold">Venue:</span> Odds Cafe, West Asheville, NC</p>
      </div>

      <div className="space-y-8" style={{ color: "var(--foreground)" }}>

        <section>
          <h2 className="text-xl font-bold text-[#8B1E1E] mb-3">1. What We Collect</h2>
          <p className="mb-3">When you sign up for the Odds Perk Pass, we collect:</p>
          <ul className="list-disc list-inside space-y-1 mb-3 pl-1">
            <li>Your 10-digit US phone number</li>
            <li>A name or nickname of at least 3 characters</li>
          </ul>
          <p>
            We use the last 4 digits of your phone number combined with your nickname to identify
            your loyalty account. This pairing is how we distinguish your card from other
            customers — no account login or app download required.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#8B1E1E] mb-3">2. How We Use Your Information</h2>
          <p className="mb-3">Your phone number and nickname are used only to:</p>
          <ul className="list-disc list-inside space-y-1 mb-3 pl-1">
            <li>Create and track your Odds Perk Pass stamp card</li>
            <li>Identify your account when you visit Odds Cafe</li>
            <li>Issue your free drink reward when you reach the stamp goal</li>
          </ul>
          <p>
            We do not use your information for advertising, marketing, or any purpose beyond
            operating your loyalty card.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#8B1E1E] mb-3">3. Who Sees Your Information</h2>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--stamp-empty)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--cream)", color: "var(--brown-light)" }}>
                  <th className="text-left px-4 py-3 font-semibold">Party</th>
                  <th className="text-left px-4 py-3 font-semibold">Access</th>
                  <th className="text-left px-4 py-3 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: "var(--stamp-empty)" }}>
                  <td className="px-4 py-3 font-medium">Odds Cafe staff</td>
                  <td className="px-4 py-3">Last 4 digits + nickname</td>
                  <td className="px-4 py-3">Look up your card, add stamps, redeem rewards</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--stamp-empty)", background: "var(--cream)" }}>
                  <td className="px-4 py-3 font-medium">Peachy Kean DevOps LLC</td>
                  <td className="px-4 py-3">Full record</td>
                  <td className="px-4 py-3">Operate and maintain the Brew Loyalty platform</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--stamp-empty)" }}>
                  <td className="px-4 py-3 font-medium">Third parties</td>
                  <td className="px-4 py-3">None</td>
                  <td className="px-4 py-3">We do not sell, rent, or share your data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#8B1E1E] mb-3">4. Data Storage</h2>
          <p>
            Your information is stored securely in our database. We do not store payment
            information. We do not link your loyalty account to any other accounts or services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#8B1E1E] mb-3">5. SMS &amp; Communications</h2>
          <p>
            By signing up, you are not opting into SMS marketing. We will not send you promotional
            text messages. If this changes, we will ask for your explicit consent separately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#8B1E1E] mb-3">6. How to Remove Your Account</h2>
          <p className="mb-3">To have your account and data deleted, contact us at:</p>
          <div
            className="rounded-xl p-4 text-sm space-y-1"
            style={{ background: "var(--cream)", color: "var(--brown-light)" }}
          >
            <p><span className="font-semibold">Email:</span> john@peachykeandev.com</p>
            <p><span className="font-semibold">Subject:</span> Delete My Perk Pass Account</p>
          </div>
          <p className="mt-3">We will remove your record within 5 business days.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#8B1E1E] mb-3">7. Children&apos;s Privacy</h2>
          <p>
            The Odds Perk Pass is intended for customers 13 years of age and older. We do not
            knowingly collect information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#8B1E1E] mb-3">8. Changes to These Terms</h2>
          <p>
            We may update these terms as the program evolves. The current version will always be
            available at this page. Continued use of your Perk Pass after an update constitutes
            acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#8B1E1E] mb-3">9. Contact</h2>
          <div
            className="rounded-xl p-4 text-sm space-y-1"
            style={{ background: "var(--cream)", color: "var(--brown-light)" }}
          >
            <p className="font-semibold">Peachy Kean DevOps LLC</p>
            <p>Asheville, NC</p>
            <p>john@peachykeandev.com</p>
          </div>
        </section>

        <p
          className="text-xs pt-4 border-t"
          style={{ borderColor: "var(--stamp-empty)", color: "var(--brown-light)" }}
        >
          Odds Perk Pass is operated by Peachy Kean DevOps LLC on behalf of Odds Cafe. Buy 9
          coffee/tea drinks, get the 10th free. Not valid on smoothies or frappes. One stamp per
          drink.
        </p>
      </div>
    </main>
  );
}
