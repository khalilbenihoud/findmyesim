"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
    
    // Navigate to dedicated country page instead of showing results here
    router.push(`/country/${selected.code.toLowerCase()}`);
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
        {true ? (
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
        ) : null}
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

