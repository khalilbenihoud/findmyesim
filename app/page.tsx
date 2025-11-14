"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchCountries, type Country } from "@/lib/countries";
import PlanModal from "@/components/PlanModal";
import ComparisonView from "@/components/ComparisonView";
import PriceAlert from "@/components/PriceAlert";
import { type ESIMPlan } from "@/lib/types";

export default function Home() {
  const [country, setCountry] = useState("");
  const [countrySuggestions, setCountrySuggestions] = useState<Country[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ESIMPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comparisonPlans, setComparisonPlans] = useState<ESIMPlan[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [priceAlertPlan, setPriceAlertPlan] = useState<ESIMPlan | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
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
    router.push(`/country/${selected.code.toLowerCase()}`);
  };

  const openPlanModal = (plan: ESIMPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-2 sm:px-4">
          <div className="w-full max-w-2xl">
            {/* Main Headline */}
            <div className="mb-8 sm:mb-12 text-center">
              <h1 className="mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 sm:text-5xl lg:text-6xl xl:text-7xl">
                Find the Best eSIM
                <br />
                <span className="text-gray-900 dark:text-slate-100">for your journey</span>
              </h1>
              <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-slate-300 sm:text-lg lg:text-xl px-2">
                Compare prices, coverage, and features from top providers worldwide.
              </p>
            </div>

            {/* Simple Country Search Input */}
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                value={country}
                onChange={(e) => handleCountryInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && countrySuggestions.length > 0) {
                    handleCountrySelect(countrySuggestions[0]);
                  }
                }}
                placeholder="Search for a country..."
                className="w-full rounded-full border border-gray-300 bg-white px-4 py-3.5 text-base shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400 touch-manipulation sm:px-6 sm:py-4 sm:text-lg"
                style={{ fontSize: '16px' }}
              />
              
              {/* Country Suggestions Dropdown */}
              {showSuggestions && countrySuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-10 mt-2 w-full max-h-[50vh] sm:max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  {countrySuggestions.slice(0, 10).map((suggestion) => (
                    <button
                      key={suggestion.code}
                      onClick={() => handleCountrySelect(suggestion)}
                      className="w-full px-4 py-3.5 sm:py-3 text-left transition-colors active:bg-gray-100 hover:bg-gray-50 dark:active:bg-slate-800 dark:hover:bg-slate-800 border-b border-gray-100 dark:border-slate-800 last:border-0 touch-manipulation min-h-[44px] flex items-center"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl">{suggestion.flag}</span>
                        <span className="text-base sm:text-lg text-gray-900 dark:text-gray-100">{suggestion.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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

