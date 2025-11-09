"use client";

import { ESIMPlan } from "@/lib/types";
import ProviderLogo from "./ProviderLogo";
import { calculatePricePerGB, calculateValueScore } from "@/lib/utils";

interface ComparisonViewProps {
  plans: ESIMPlan[];
  onRemove: (planId: string) => void;
  onClose: () => void;
}

export default function ComparisonView({ plans, onRemove, onClose }: ComparisonViewProps) {
  if (plans.length === 0) return null;

  const allPlans = plans; // For value score calculation

  const comparisonFields = [
    { label: "Provider", key: "provider" as const },
    { label: "Price", key: "price" as const },
    { label: "Price per GB", key: "pricePerGB" as const },
    { label: "Data", key: "data" as const },
    { label: "Network Type", key: "dataType" as const },
    { label: "Duration", key: "duration" as const },
    { label: "Rating", key: "networkRating" as const },
    { label: "Value Score", key: "valueScore" as const },
    { label: "Speed", key: "speed" as const },
    { label: "Hotspot", key: "hotspot" as const },
    { label: "Tethering", key: "tethering" as const },
  ];

  const getFieldValue = (plan: ESIMPlan, key: string): string | number => {
    switch (key) {
      case "price":
        return `$${plan.price.toFixed(2)}`;
      case "pricePerGB":
        const ppgb = calculatePricePerGB(plan);
        return ppgb === 0 ? "Unlimited" : `$${ppgb.toFixed(2)}`;
      case "valueScore":
        return `${calculateValueScore(plan, allPlans)}/100`;
      case "speed":
        return plan.networkPerformance.speed;
      case "hotspot":
        return plan.specifications.hotspot;
      case "tethering":
        return plan.specifications.tethering;
      case "networkRating":
        return `${plan.networkRating.toFixed(1)}/5`;
      default:
        return (plan as any)[key] || "N/A";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900/95 dark:backdrop-blur-md">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900/95">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Compare Plans ({plans.length})
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="relative px-4 py-3 text-center">
                    <button
                      onClick={() => onRemove(plan.id)}
                      className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                      title="Remove from comparison"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex flex-col items-center gap-2">
                      <ProviderLogo
                        providerName={plan.provider}
                        logoUrl={plan.providerImage}
                        size={48}
                        className="h-12 w-12"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {plan.provider}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFields.map((field, idx) => (
                <tr
                  key={field.key}
                  className={`border-b border-gray-100 dark:border-slate-800 ${
                    idx % 2 === 0 ? "bg-gray-50/50 dark:bg-slate-900/50" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                      {getFieldValue(plan, field.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

