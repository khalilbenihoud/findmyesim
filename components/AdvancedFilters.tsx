"use client";

import { FilterOptions } from "@/lib/filters";

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  onClose,
  isOpen,
}: AdvancedFiltersProps) {
  if (!isOpen) return null;

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: "price",
      sortOrder: "asc",
    });
  };

  const hasActiveFilters = 
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minDataGB !== undefined ||
    filters.maxDataGB !== undefined ||
    (filters.dataType && filters.dataType !== "all") ||
    filters.minDuration !== undefined ||
    filters.maxDuration !== undefined ||
    filters.minRating !== undefined ||
    filters.maxPricePerGB !== undefined ||
    filters.unlimitedOnly ||
    filters.sortBy !== "price";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/95 dark:backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Advanced Filters
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price Range ($)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) => updateFilter("minPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) => updateFilter("maxPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Data Range */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data Amount (GB)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min GB"
              value={filters.minDataGB || ""}
              onChange={(e) => updateFilter("minDataGB", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
            />
            <input
              type="number"
              placeholder="Max GB"
              value={filters.maxDataGB || ""}
              onChange={(e) => updateFilter("maxDataGB", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
            />
          </div>
          <label className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.unlimitedOnly || false}
              onChange={(e) => updateFilter("unlimitedOnly", e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Unlimited only</span>
          </label>
        </div>

        {/* Data Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Network Type
          </label>
          <select
            value={filters.dataType || "all"}
            onChange={(e) => updateFilter("dataType", e.target.value as any)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
          >
            <option value="all">All Types</option>
            <option value="4G">4G Only</option>
            <option value="5G">5G Only</option>
            <option value="4G/5G">4G/5G</option>
          </select>
        </div>

        {/* Duration Range */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Duration (days)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min days"
              value={filters.minDuration || ""}
              onChange={(e) => updateFilter("minDuration", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
            />
            <input
              type="number"
              placeholder="Max days"
              value={filters.maxDuration || ""}
              onChange={(e) => updateFilter("maxDuration", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Minimum Rating
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="0.0"
            value={filters.minRating || ""}
            onChange={(e) => updateFilter("minRating", e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
          />
        </div>

        {/* Price per GB */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Max Price per GB ($)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 5.00"
            value={filters.maxPricePerGB || ""}
            onChange={(e) => updateFilter("maxPricePerGB", e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
          </label>
          <div className="space-y-2">
            <select
              value={filters.sortBy || "price"}
              onChange={(e) => updateFilter("sortBy", e.target.value as any)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
            >
              <option value="price">Price</option>
              <option value="pricePerGB">Price per GB</option>
              <option value="valueScore">Best Value</option>
              <option value="rating">Rating</option>
              <option value="data">Data Amount</option>
              <option value="duration">Duration</option>
            </select>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sortOrder"
                  checked={filters.sortOrder === "asc"}
                  onChange={() => updateFilter("sortOrder", "asc")}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Low to High</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sortOrder"
                  checked={filters.sortOrder === "desc"}
                  onChange={() => updateFilter("sortOrder", "desc")}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">High to Low</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

