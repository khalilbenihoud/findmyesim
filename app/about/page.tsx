import Link from "next/link";

export default function AboutPage() {
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
            About Find My eSIM
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Find My eSIM is a free comparison tool designed to help travelers find the best eSIM data plans for their destinations. We aggregate and compare eSIM offers from leading providers worldwide, making it easy to find the perfect plan based on price, data allowance, validity period, and coverage.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our goal is to simplify the process of choosing an eSIM plan, saving you time and money while ensuring you stay connected during your travels.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We continuously monitor and update eSIM plans from top providers including Airalo, Holafly, Nomad, Kolet, and Saily. Our platform allows you to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Search for eSIM plans by country</li>
              <li>Compare prices, data limits, and validity periods</li>
              <li>Filter plans based on your specific needs</li>
              <li>Access direct links to purchase from providers</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All data is updated regularly to ensure accuracy, though we recommend verifying final prices and terms directly with the provider before purchasing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Important Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              <strong>Pricing Accuracy:</strong> While we strive to provide accurate and up-to-date pricing information, prices may vary based on currency fluctuations, promotional offers, and provider updates. Always verify the final price on the provider's website before making a purchase.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              <strong>Provider Relationships:</strong> Find My eSIM is an independent comparison service. We are not affiliated with any eSIM provider, and we do not receive commissions from purchases made through our platform.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Service Availability:</strong> eSIM availability and coverage may vary by country and device compatibility. Please check with your provider to ensure your device supports eSIM technology and that coverage is available in your destination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Supported Providers
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We currently compare plans from the following eSIM providers:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Airalo</li>
              <li>Holafly</li>
              <li>Nomad</li>
              <li>Kolet</li>
              <li>Saily</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact & Support
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have questions, feedback, or encounter any issues with our service, please refer to our Terms of Service page or contact us through the appropriate channels.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

