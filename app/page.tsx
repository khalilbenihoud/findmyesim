"use client";

import { useState, useRef, useEffect } from "react";
import { searchCountries, type Country } from "@/lib/countries";
import PlanModal from "@/components/PlanModal";

interface ESIMPlan {
  id: string;
  provider: string;
  providerImage: string;
  data: string;
  dataType: "4G" | "5G" | "4G/5G";
  duration: string;
  price: number;
  networkRating: number;
  reviewCount: number;
  features: string[];
  partnerOperators: string[];
  networkPerformance: {
    speed: string;
    latency: string;
    reliability: string;
  };
  specifications: {
    activation: string;
    hotspot: string;
    tethering: string;
    voice: string;
    sms: string;
  };
}

export default function Home() {
  const [country, setCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySuggestions, setCountrySuggestions] = useState<Country[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ESIMPlan[]>([]);
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
    
    // Automatically trigger search when country is selected
    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call - replace with actual API call later
    setTimeout(async () => {
      // Mock data for demonstration
      const mockResults: ESIMPlan[] = [
        {
          id: "1",
          provider: "Airalo",
          providerImage: "📱",
          data: "10 GB",
          dataType: "4G/5G",
          duration: "30 days",
          price: 24.99,
          networkRating: 4.5,
          reviewCount: 1250,
          features: [
            "Instant activation",
            "Hotspot included",
            "No contract",
            "24/7 support",
          ],
          partnerOperators: ["Verizon", "AT&T", "T-Mobile"],
          networkPerformance: {
            speed: "Up to 150 Mbps",
            latency: "< 50ms",
            reliability: "99.9%",
          },
          specifications: {
            activation: "Instant",
            hotspot: "Included",
            tethering: "Yes",
            voice: "Not included",
            sms: "Not included",
          },
        },
        {
          id: "2",
          provider: "Holafly",
          providerImage: "🌐",
          data: "Unlimited",
          dataType: "4G/5G",
          duration: "30 days",
          price: 39.99,
          networkRating: 4.7,
          reviewCount: 890,
          features: [
            "Unlimited data",
            "Hotspot included",
            "No speed limits",
            "Multi-country",
          ],
          partnerOperators: ["Verizon", "AT&T", "T-Mobile", "Sprint"],
          networkPerformance: {
            speed: "Up to 200 Mbps",
            latency: "< 40ms",
            reliability: "99.8%",
          },
          specifications: {
            activation: "Instant",
            hotspot: "Included",
            tethering: "Yes",
            voice: "Not included",
            sms: "Not included",
          },
        },
        {
          id: "3",
          provider: "Orange",
          providerImage: "🍊",
          data: "20 GB",
          dataType: "5G",
          duration: "14 days",
          price: 29.99,
          networkRating: 4.3,
          reviewCount: 650,
          features: [
            "5G network",
            "Fast speeds",
            "EU coverage",
            "Easy setup",
          ],
          partnerOperators: ["Orange", "T-Mobile", "Verizon"],
          networkPerformance: {
            speed: "Up to 300 Mbps",
            latency: "< 30ms",
            reliability: "99.7%",
          },
          specifications: {
            activation: "Instant",
            hotspot: "Included",
            tethering: "Yes",
            voice: "Not included",
            sms: "Not included",
          },
        },
        {
          id: "4",
          provider: "Nomad",
          providerImage: "🗺️",
          data: "15 GB",
          dataType: "4G/5G",
          duration: "30 days",
          price: 27.99,
          networkRating: 4.4,
          reviewCount: 420,
          features: [
            "Global coverage",
            "Flexible plans",
            "No hidden fees",
            "Easy top-up",
          ],
          partnerOperators: ["AT&T", "T-Mobile", "Verizon"],
          networkPerformance: {
            speed: "Up to 100 Mbps",
            latency: "< 60ms",
            reliability: "99.5%",
          },
          specifications: {
            activation: "Instant",
            hotspot: "Included",
            tethering: "Yes",
            voice: "Not included",
            sms: "Not included",
          },
        },
      ];

      // Sort by price (cheapest first)
      const sortedResults = mockResults.sort((a, b) => a.price - b.price);
      setResults(sortedResults);
      setIsLoading(false);
    }, 1000);
  };

  const handleClearInput = () => {
    setCountry("");
    setSelectedCountry(null);
    setResults([]);
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
                  <span className="text-gray-900 dark:text-slate-100">for Your Journey</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-slate-300 sm:text-xl">
                  Compare prices, coverage, and features from top providers worldwide. 
                  <span className="block mt-2 text-base text-gray-500 dark:text-slate-400">
                    Get instant access to the best deals—no contracts, no hidden fees.
                  </span>
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
                {results.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:backdrop-blur-sm"
                  >
                    {/* Best Price Badge */}
                    {index === 0 && (
                      <div className="absolute -top-3 left-6 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                        Best Price
                      </div>
                    )}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      {/* Provider Image */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-3xl dark:bg-gray-800">
                        {plan.providerImage}
                      </div>
                      {/* Plan Details */}
                      <div className="flex-1">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                              {plan.provider}
                            </h3>
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
                ))}
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

