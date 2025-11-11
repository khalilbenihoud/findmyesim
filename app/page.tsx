"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { countries, type Country as CountryType } from "@/lib/countries";
import { searchCountries, type Country } from "@/lib/countries";
import { fetchESIMPlans } from "@/lib/api";
import { type ESIMPlan } from "@/lib/types";
import { FilterOptions, filterPlans, sortPlans } from "@/lib/filters";
import { calculatePricePerGB, calculateValueScore, type FiatCurrency } from "@/lib/utils";
import { parseNaturalLanguageQuery } from "@/lib/nlpParser";
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ChatGPT-like input state
  const [query, setQuery] = useState("");
  const [parsedQuery, setParsedQuery] = useState<ReturnType<typeof parseNaturalLanguageQuery>>({
    country: null,
    days: null,
    budget: null,
    currency: "USD",
  });

  // Parse query in real-time
  useEffect(() => {
    if (query.trim()) {
      const parsed = parseNaturalLanguageQuery(query);
      setParsedQuery(parsed);
      // Auto-select country if found
      if (parsed.country && !selectedCountry) {
        setSelectedCountry(parsed.country);
        setCountry(parsed.country.name);
      }
    } else {
      setParsedQuery({
        country: null,
        days: null,
        budget: null,
        currency: "USD",
      });
      setSelectedCountry(null);
      setCountry("");
    }
  }, [query]);

  const submitSmartSearch = () => {
    if (!parsedQuery.country) return;
    const params = new URLSearchParams();
    if (parsedQuery.days) params.set("days", String(parsedQuery.days));
    if (parsedQuery.budget) params.set("budget", String(parsedQuery.budget));
    if (parsedQuery.currency) params.set("currency", parsedQuery.currency);
    const queryString = params.toString();
    router.push(`/country/${parsedQuery.country.code.toLowerCase()}${queryString ? `?${queryString}` : ""}`);
  };

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

  const handleCountrySelect = (selected: Country) => {
    setCountry(selected.name);
    setSelectedCountry(selected);
    setShowSuggestions(false);
    setCountrySuggestions([]);
    setError(null);
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

              {/* ChatGPT-like Natural Language Input */}
              <div className="w-full">
                <div className="rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="p-6">
                    <textarea
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (parsedQuery.country) {
                            submitSmartSearch();
                          }
                        }
                      }}
                      placeholder="I am looking for an eSIM for Turkey, staying 10 days with a budget of $20..."
                      className="w-full resize-none border-0 bg-transparent text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-gray-100 dark:placeholder-gray-500"
                      rows={3}
                    />
                    
                    {/* Parsed Information Preview */}
                    {query.trim() && (
                      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                        {parsedQuery.country ? (
                          <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            <span>{parsedQuery.country.flag}</span>
                            <span>{parsedQuery.country.name}</span>
                          </div>
                        ) : (
                          <div className="rounded-full bg-gray-200 px-3 py-1.5 text-sm text-gray-500 dark:bg-slate-700 dark:text-gray-400">
                            Country not detected
                          </div>
                        )}
                        
                        {parsedQuery.days ? (
                          <div className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            {parsedQuery.days} days
                          </div>
                        ) : (
                          <div className="rounded-full bg-gray-200 px-3 py-1.5 text-sm text-gray-500 dark:bg-slate-700 dark:text-gray-400">
                            Duration not specified
                          </div>
                        )}
                        
                        {parsedQuery.budget ? (
                          <div className="rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            {parsedQuery.currency === "USD" ? "$" : parsedQuery.currency === "EUR" ? "€" : parsedQuery.currency === "GBP" ? "£" : parsedQuery.currency}{parsedQuery.budget}
                          </div>
                        ) : (
                          <div className="rounded-full bg-gray-200 px-3 py-1.5 text-sm text-gray-500 dark:bg-slate-700 dark:text-gray-400">
                            Budget not specified
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-slate-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {parsedQuery.country
                        ? "Press Enter or click Find plans to search"
                        : "Type your travel plans in natural language"}
                    </p>
                    <button
                      disabled={!parsedQuery.country}
                      onClick={submitSmartSearch}
                      className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
                    >
                      Find plans
                    </button>
                  </div>
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

