"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { searchCountries, type Country } from "@/lib/countries";
import { fetchESIMPlans } from "@/lib/api";
import { type ESIMPlan } from "@/lib/types";
import { FilterOptions, filterPlans, sortPlans } from "@/lib/filters";
import { calculatePricePerGB, calculateValueScore } from "@/lib/utils";
import PlanModal from "@/components/PlanModal";
import ProviderLogo from "@/components/ProviderLogo";
import AdvancedFilters from "@/components/AdvancedFilters";
import ComparisonView from "@/components/ComparisonView";
import PriceAlert from "@/components/PriceAlert";
import ResultSkeleton from "@/components/ResultSkeleton";

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
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: "price",
    sortOrder: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [comparisonPlans, setComparisonPlans] = useState<ESIMPlan[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [priceAlertPlan, setPriceAlertPlan] = useState<ESIMPlan | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = filterPlans(results, filters);
    if (filters.sortBy) {
      filtered = sortPlans(filtered, filters.sortBy, filters.sortOrder);
    }
    return filtered;
  }, [results, filters]);

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

  const toggleComparison = (plan: ESIMPlan) => {
    setComparisonPlans((prev) => {
      const exists = prev.find((p) => p.id === plan.id);
      if (exists) {
        return prev.filter((p) => p.id !== plan.id);
      } else if (prev.length < 3) {
        return [...prev, plan];
      }
      return prev;
    });
  };

  const isInComparison = (planId: string) => {
    return comparisonPlans.some((p) => p.id === planId);
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
              <div className="space-y-4">
                <div className="mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
                      <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700" />
                    </div>
                  </div>
                </div>
                {Array.from({ length: 3 }).map((_, index) => (
                  <ResultSkeleton key={index} />
                ))}
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
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        eSIM Plans for {selectedCountry?.flag} {country}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {filteredAndSortedResults.length} of {results.length} plan{results.length !== 1 ? "s" : ""} shown
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {comparisonPlans.length > 0 && (
                        <button
                          onClick={() => setShowComparison(true)}
                          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                          </svg>
                          Compare ({comparisonPlans.length})
                        </button>
                      )}
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <AdvancedFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClose={() => setShowFilters(false)}
                    isOpen={showFilters}
                  />
                )}

                {filteredAndSortedResults.map((plan, index) => {
                  const isBestPrice = index === 0 && filters.sortBy === "price" && filters.sortOrder === "asc";
                  const valueScore = calculateValueScore(plan, results);
                  const pricePerGB = calculatePricePerGB(plan);
                  const inComparison = isInComparison(plan.id);
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
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Data</p>
                            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                              {plan.data}
                            </p>
                            {pricePerGB > 0 && pricePerGB < 999 && (
                              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                ${pricePerGB.toFixed(2)}/GB
                              </p>
                            )}
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                              {plan.networkRating.toFixed(1)}/5
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Value Score</p>
                            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                              {valueScore}/100
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-wrap items-center gap-2 sm:ml-4 sm:mt-0 sm:flex-col sm:items-end">
                        <button
                          onClick={() => openPlanModal(plan)}
                          className="w-full rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 sm:w-auto"
                        >
                          View Details
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleComparison(plan)}
                            disabled={!inComparison && comparisonPlans.length >= 3}
                            className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                              inComparison
                                ? "border-green-500 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/30 dark:text-green-400"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                            }`}
                            title={!inComparison && comparisonPlans.length >= 3 ? "Maximum 3 plans can be compared" : inComparison ? "Remove from comparison" : "Add to comparison"}
                          >
                            {inComparison ? (
                              <>
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Added
                              </>
                            ) : (
                              <>
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Compare
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setPriceAlertPlan(plan)}
                            className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                            title="Set price alert"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Alert
                          </button>
                        </div>
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

      {/* Comparison View */}
      {showComparison && (
        <ComparisonView
          plans={comparisonPlans}
          onRemove={(planId) => {
            setComparisonPlans((prev) => prev.filter((p) => p.id !== planId));
            if (comparisonPlans.length === 1) {
              setShowComparison(false);
            }
          }}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Price Alert Modal */}
      {priceAlertPlan && (
        <PriceAlert
          plan={priceAlertPlan}
          currentPrice={priceAlertPlan.price}
          onClose={() => setPriceAlertPlan(null)}
        />
      )}
    </main>
  );
}

