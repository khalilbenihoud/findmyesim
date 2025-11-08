"use client";

import { useState, useRef, useEffect } from "react";
import { searchCountries, type Country } from "@/lib/countries";
import { fetchESIMPlans } from "@/lib/api";
import { type ESIMPlan } from "@/lib/types";
import PlanModal from "@/components/PlanModal";
import ProviderLogo from "@/components/ProviderLogo";

export default function Home() {
  const [country, setCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySuggestions, setCountrySuggestions] = useState<Country[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ESIMPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ESIMPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountryInputChange = (value: string) => {
    setCountry(value);
    if (value.trim()) {
      const suggestions = searchCountries(value);
      setCountrySuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setCountrySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleCountrySelect = async (selected: Country) => {
    setCountry(selected.name);
    setSelectedCountry(selected);
    setShowSuggestions(false);
    setCountrySuggestions([]);
    setError(null);
    
    // Automatically trigger search when country is selected
    setIsLoading(true);
    setHasSearched(true);

    try {
      // Fetch real eSIM data from API
      const response = await fetchESIMPlans(selected.code, selected.name);

      if (response.success && response.data) {
        // Sort by price (cheapest first)
        const sortedResults = response.data.sort((a, b) => a.price - b.price);
        setResults(sortedResults);
        setError(null);
      } else {
        setError(response.error || "Failed to fetch eSIM plans. Please try again.");
        setResults([]);
      }
    } catch (err) {
      console.error("Error fetching eSIM plans:", err);
      setError("An unexpected error occurred. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearInput = () => {
    setCountry("");
    setSelectedCountry(null);
    setResults([]);
    setError(null);
    setShowSuggestions(false);
    setCountrySuggestions([]);
    setHasSearched(false);
    // Focus back on input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleNewSearch = () => {
    setHasSearched(false);
    setCountry("");
    setSelectedCountry(null);
    setResults([]);
    setShowSuggestions(false);
    setCountrySuggestions([]);
  };

  const openPlanModal = (plan: ESIMPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
      >
        ★
      </span>
    ));
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {!hasSearched ? (
          // Initial landing state - just the big input
          <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
            <div className="w-full max-w-3xl">
              {/* Main Headline */}
              <div className="mb-12 text-center">
                <h1 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 sm:text-6xl lg:text-7xl">
                  Find the Best eSIM
                  <br />
                  <span className="text-gray-900 dark:text-slate-100">for your journey</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-slate-300 sm:text-xl">
                  Compare prices, coverage, and features from top providers worldwide. 

                </p>
              </div>

              {/* Search Input */}
              <div className="w-full">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={country}
                    onChange={(e) => handleCountryInputChange(e.target.value)}
                    onFocus={() => {
                      if (countrySuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    placeholder="Where are you traveling? Type a country..."
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-6 py-5 pr-12 text-lg text-gray-900 placeholder-gray-400 shadow-lg transition-all focus:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/80 dark:backdrop-blur-sm dark:text-slate-100 dark:placeholder-slate-400 dark:shadow-slate-900/50 dark:focus:border-slate-600 dark:focus:ring-slate-700"
                    autoFocus
                  />
                  {country && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      aria-label="Clear input"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                  {/* Autocomplete Dropdown */}
                  {showSuggestions && countrySuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900/95 dark:backdrop-blur-md"
                    >
                      {countrySuggestions.map((suggestion) => (
                        <button
                          key={suggestion.code}
                          type="button"
                          onClick={() => handleCountrySelect(suggestion)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <span className="text-2xl">{suggestion.flag}</span>
                          <span className="text-gray-900 dark:text-gray-100">
                            {suggestion.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Features/Trust Indicators */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Instant Activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Best Prices Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No Hidden Fees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Results state
          <div className="space-y-6">
            {/* Search bar at top */}
            <div className="sticky top-4 z-10">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={country}
                  onChange={(e) => handleCountryInputChange(e.target.value)}
                  onFocus={() => {
                    if (countrySuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="Search for another country..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-6 py-4 pr-12 text-lg text-gray-900 placeholder-gray-500 shadow-sm transition-all focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/80 dark:backdrop-blur-sm dark:text-slate-100 dark:placeholder-slate-400 dark:shadow-slate-900/50 dark:focus:border-slate-600 dark:focus:ring-slate-700"
                />
                {country && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    aria-label="Clear input"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                {/* Autocomplete Dropdown */}
                {showSuggestions && countrySuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900/95 dark:backdrop-blur-md"
                  >
                    {countrySuggestions.map((suggestion) => (
                      <button
                        key={suggestion.code}
                        type="button"
                        onClick={() => handleCountrySelect(suggestion)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <span className="text-2xl">{suggestion.flag}</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {suggestion.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-gray-900 dark:border-gray-700 dark:border-r-gray-100"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Searching for eSIM plans...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center dark:border-red-900 dark:bg-red-900/20">
                <div className="mb-4 flex justify-center">
                  <svg
                    className="h-12 w-12 text-red-500 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="mb-2 text-lg font-semibold text-red-800 dark:text-red-300">
                  Unable to Load Plans
                </p>
                <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={handleClearInput}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  Try Again
                </button>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    eSIM Plans for {selectedCountry?.flag} {country}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {results.length} plan{results.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                {results.map((plan, index) => {
                  const isBestPrice = index === 0;
                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-lg border p-6 shadow-sm transition-all hover:shadow-md ${
                        isBestPrice
                          ? "border-green-500 bg-green-50/50 dark:border-green-500 dark:bg-green-950/20"
                          : "border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:backdrop-blur-sm"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        {/* Provider Image */}
                        <ProviderLogo
                          providerName={plan.provider}
                          logoUrl={plan.providerImage}
                          size={64}
                          className="h-16 w-16"
                        />
                        {/* Plan Details */}
                        <div className="flex-1">
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                  {plan.provider}
                                </h3>
                                {isBestPrice && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                                    <svg
                                      className="h-3 w-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Best Price
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <div className="flex text-sm">
                                  {renderStars(plan.networkRating)}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {plan.networkRating.toFixed(1)} ({plan.reviewCount} reviews)
                                </span>
                              </div>
                            </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                              ${plan.price}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Data</p>
                            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                              {plan.data}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                              {plan.dataType}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Validity</p>
                            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                              {plan.duration}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Coverage</p>
                            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                              {plan.networkRating.toFixed(1)}/5
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Action Button */}
                      <div className="flex items-center sm:ml-4">
                        <button
                          onClick={() => openPlanModal(plan)}
                          className="w-full rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 sm:w-auto"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/60 dark:backdrop-blur-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  No eSIM plans found for "{country}". Try another country.
                </p>
                <button
                  onClick={handleNewSearch}
                  className="mt-4 text-sm font-medium text-gray-900 underline hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
                >
                  Start new search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Plan Detail Modal */}
      <PlanModal
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

