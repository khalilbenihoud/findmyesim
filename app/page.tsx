export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            eSIM Comparator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Compare international eSIM offers based on country, price, duration, and data volume
          </p>
        </div>

        {/* Search/Filter Section */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#171717]">
          <div className="space-y-4">
            <div>
              <label htmlFor="country" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Country
              </label>
              <input
                type="text"
                id="country"
                placeholder="Search for a country..."
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="data" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data (GB)
                </label>
                <input
                  type="number"
                  id="data"
                  placeholder="e.g. 5"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                />
              </div>
              <div>
                <label htmlFor="duration" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration (days)
                </label>
                <input
                  type="number"
                  id="duration"
                  placeholder="e.g. 30"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                />
              </div>
              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="e.g. 50"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-[#0a0a0a] dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                />
              </div>
            </div>
            <button className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-400">
              Search eSIM Plans
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#171717]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Example eSIM Plan
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>Country: <span className="font-medium text-gray-900 dark:text-gray-200">United States</span></p>
                  <p>Data: <span className="font-medium text-gray-900 dark:text-gray-200">10 GB</span></p>
                  <p>Duration: <span className="font-medium text-gray-900 dark:text-gray-200">30 days</span></p>
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$29.99</p>
                <button className="mt-2 rounded-md bg-gray-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#171717]">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Start by selecting a country and filters to see eSIM plans
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

