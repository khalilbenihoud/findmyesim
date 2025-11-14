import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Terms of Service
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last updated: November 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing and using Find My eSIM ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Find My eSIM is a free comparison tool that aggregates and displays eSIM plan information from various providers. The Service allows users to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Search and compare eSIM plans by country</li>
              <li>View pricing, data limits, and validity information</li>
              <li>Access links to purchase eSIM plans from providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              3. Accuracy of Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              While we strive to provide accurate and up-to-date information, we cannot guarantee the completeness, accuracy, or timeliness of all data displayed on the Service. Prices, plans, and availability are subject to change without notice.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Users are responsible for verifying all information, including pricing, terms, and conditions, directly with the eSIM provider before making any purchase decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              4. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              The Service provides links to third-party eSIM providers. We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>The content, policies, or practices of third-party providers</li>
              <li>The quality, availability, or performance of eSIM services purchased from providers</li>
              <li>Any transactions between users and third-party providers</li>
              <li>Disputes, refunds, or customer service issues with providers</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All purchases are made directly with the eSIM provider, and users are subject to the provider's terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              5. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Find My eSIM is provided "as is" without warranties of any kind, either express or implied. We do not warrant that:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>The Service will be uninterrupted or error-free</li>
              <li>All information displayed is accurate or current</li>
              <li>The Service will meet your specific requirements</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To the fullest extent permitted by law, Find My eSIM shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              6. User Responsibilities
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Users agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Use the Service only for lawful purposes</li>
              <li>Verify all information before making purchase decisions</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not attempt to interfere with or disrupt the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              7. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes are posted constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              8. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through the appropriate channels or refer to our About page for more information.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

