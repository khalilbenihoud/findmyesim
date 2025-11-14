"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { countries, type Country } from "@/lib/countries";
import { fetchESIMPlans } from "@/lib/api";
import { type ESIMPlan } from "@/lib/types";
import { FilterOptions, filterPlans, sortPlans } from "@/lib/filters";
import { calculatePricePerGB, calculateValueScore, convertFromUSD, formatCurrency, type FiatCurrency } from "@/lib/utils";
import PlanModal from "@/components/PlanModal";
import ProviderLogo from "@/components/ProviderLogo";
import AdvancedFilters from "@/components/AdvancedFilters";
import ComparisonView from "@/components/ComparisonView";
import PriceAlert from "@/components/PriceAlert";
import ResultSkeleton from "@/components/ResultSkeleton";
import Link from "next/link";

export default function CountryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  // Find country by code or name
  const country = useMemo(() => {
    if (!slug) return null;
    const lowerSlug = slug.toLowerCase();
    return (
      countries.find(
        (c) =>
          c.code.toLowerCase() === lowerSlug ||
          c.name.toLowerCase() === lowerSlug ||
          c.name.toLowerCase().replace(/\s+/g, "-") === lowerSlug
      ) || null
    );
  }, [slug]);

  const [isLoading, setIsLoading] = useState(true);
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
  const [selectedCurrency, setSelectedCurrency] = useState<FiatCurrency>("USD");

  // Fetch plans when country is found
  useEffect(() => {
    if (country) {
      setIsLoading(true);
      setError(null);
      // Read server-side filter hints
      const daysParam = searchParams?.get("days");
      const budgetParam = searchParams?.get("budget");
      const currencyParam = (searchParams?.get("currency") as FiatCurrency) || "USD";
      setSelectedCurrency(currencyParam);
      const minDurationDays = daysParam && !Number.isNaN(Number(daysParam)) ? Math.max(1, Number(daysParam)) : undefined;
      const maxPrice = budgetParam && !Number.isNaN(Number(budgetParam)) ? Math.max(0, Number(budgetParam)) : undefined;
      fetchESIMPlans(country.code, country.name, {
        minDurationDays,
        maxPrice,
      })
        .then((response) => {
          if (response.success && response.data) {
            const sortedResults = response.data.sort((a, b) => a.price - b.price);
            setResults(sortedResults);
          } else {
            setError(response.error || "Failed to fetch eSIM plans.");
            setResults([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching eSIM plans:", err);
          setError("An unexpected error occurred. Please try again.");
          setResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (slug) {
      setError("Country not found");
      setIsLoading(false);
    }
  }, [country, slug]);

  // Apply initial filters from query params (days -> minDuration, budget -> maxPrice)
  useEffect(() => {
    if (!searchParams) return;
    const daysParam = searchParams.get("days");
    const budgetParam = searchParams.get("budget");
    const nextFilters: FilterOptions = { ...filters };
    let changed = false;
    if (daysParam && !Number.isNaN(Number(daysParam))) {
      nextFilters.minDuration = Math.max(1, Number(daysParam));
      changed = true;
    }
    if (budgetParam && !Number.isNaN(Number(budgetParam))) {
      nextFilters.maxPrice = Math.max(1, Number(budgetParam));
      changed = true;
    }
    if (changed) {
      setFilters(nextFilters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = filterPlans(results, filters);
    if (filters.sortBy) {
      filtered = sortPlans(filtered, filters.sortBy, filters.sortOrder);
    }
    return filtered;
  }, [results, filters]);

  // Statistics
  const stats = useMemo(() => {
    if (results.length === 0) return null;
    const prices = results.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const providers = new Set(results.map((p) => p.provider)).size;
    return { minPrice, maxPrice, avgPrice, providers, totalPlans: results.length };
  }, [results]);

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

  if (!country && !isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Country Not Found</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              The country "{slug}" could not be found.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-md bg-gray-900 px-6 py-3 text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          {country && (
            <div className="flex items-center gap-4">
              <div className="text-5xl">{country.flag}</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Find the Best eSIM for {country.name}
                </h1>
                {stats && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {stats.providers} providers & {stats.totalPlans} data plans
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Statistics Bar */}
        {stats && !isLoading && (
          <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Lowest Price</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(convertFromUSD(stats.minPrice, selectedCurrency), selectedCurrency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Average Price</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(convertFromUSD(stats.avgPrice, selectedCurrency), selectedCurrency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Highest Price</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(convertFromUSD(stats.maxPrice, selectedCurrency), selectedCurrency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Providers</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {stats.providers}
              </p>
            </div>
          </div>
        )}

        {/* Filters and Sort */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sort by:
            </span>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                setFilters({ ...filters, sortBy: sortBy as any, sortOrder: sortOrder as any });
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-slate-600"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="pricePerGB-asc">Price per GB: Low to High</option>
              <option value="pricePerGB-desc">Price per GB: High to Low</option>
              <option value="data-desc">Most Data</option>
              <option value="duration-desc">Longest Duration</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="valueScore-desc">Best Value</option>
            </select>
          </div>
          <div className="flex gap-2">
            {/* Currency Selector */}
            <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300">
              <span>Currency</span>
              <select
                value={selectedCurrency}
                onChange={(e) => {
                  const c = e.target.value as FiatCurrency;
                  setSelectedCurrency(c);
                  const sp = new URLSearchParams(searchParams?.toString() || "");
                  sp.set("currency", c);
                  router.replace(`?${sp.toString()}`, { scroll: false });
                }}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-700"
              >
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="CAD">CAD C$</option>
                <option value="AUD">AUD A$</option>
              </select>
            </div>
            {/* Active Smart Filters */}
            {(filters.minDuration || filters.maxPrice) && (
              <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300">
                {filters.minDuration && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-slate-700">
                    Days ≥ {filters.minDuration}
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-slate-700">
                    Budget ≤ ${filters.maxPrice}
                  </span>
                )}
                <button
                  onClick={() => {
                    setFilters({
                      sortBy: filters.sortBy || "price",
                      sortOrder: filters.sortOrder || "asc",
                    });
                    const sp = new URLSearchParams(searchParams?.toString() || "");
                    sp.delete("days");
                    sp.delete("budget");
                    router.replace(`?${sp.toString()}`, { scroll: false });
                  }}
                  className="ml-2 rounded border border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700"
                  title="Clear smart filters"
                >
                  Clear
                </button>
              </div>
            )}
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

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
              isOpen={showFilters}
            />
          </div>
        )}

        {/* Results Count */}
        {!isLoading && results.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedResults.length} of {results.length} plan{results.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="space-y-4">
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
            <Link
              href="/"
              className="inline-block rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Back to Home
            </Link>
          </div>
        ) : filteredAndSortedResults.length > 0 ? (
          <div className="space-y-4">
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
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
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
                            {formatCurrency(convertFromUSD(plan.price, selectedCurrency), selectedCurrency)}
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
                              {formatCurrency(convertFromUSD(pricePerGB, selectedCurrency), selectedCurrency)}/GB
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
              No eSIM plans found for {country?.name}. Try adjusting your filters.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium text-gray-900 underline hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
            >
              Back to Home
            </Link>
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

