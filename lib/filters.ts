import { ESIMPlan } from "./types";

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minDataGB?: number;
  maxDataGB?: number;
  dataType?: "4G" | "5G" | "4G/5G" | "all";
  minDuration?: number;
  maxDuration?: number;
  minRating?: number;
  maxPricePerGB?: number;
  unlimitedOnly?: boolean;
  sortBy?: "price" | "pricePerGB" | "rating" | "data" | "duration" | "valueScore";
  sortOrder?: "asc" | "desc";
}

/**
 * Filter plans based on filter options
 */
export function filterPlans(plans: ESIMPlan[], filters: FilterOptions): ESIMPlan[] {
  let filtered = [...plans];

  // Price filter
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }

  // Data filter
  if (filters.minDataGB !== undefined) {
    filtered = filtered.filter(p => {
      const dataGB = extractDataGB(p.data);
      return dataGB >= filters.minDataGB! || dataGB === Infinity;
    });
  }
  if (filters.maxDataGB !== undefined) {
    filtered = filtered.filter(p => {
      const dataGB = extractDataGB(p.data);
      return dataGB <= filters.maxDataGB! || dataGB === Infinity;
    });
  }

  // Data type filter
  if (filters.dataType && filters.dataType !== "all") {
    filtered = filtered.filter(p => p.dataType === filters.dataType);
  }

  // Duration filter
  if (filters.minDuration !== undefined) {
    filtered = filtered.filter(p => {
      const duration = extractDurationDays(p.duration);
      return duration >= filters.minDuration!;
    });
  }
  if (filters.maxDuration !== undefined) {
    filtered = filtered.filter(p => {
      const duration = extractDurationDays(p.duration);
      return duration <= filters.maxDuration!;
    });
  }

  // Rating filter
  if (filters.minRating !== undefined) {
    filtered = filtered.filter(p => p.networkRating >= filters.minRating!);
  }

  // Price per GB filter
  if (filters.maxPricePerGB !== undefined) {
    filtered = filtered.filter(p => {
      const pricePerGB = calculatePricePerGB(p);
      return pricePerGB <= filters.maxPricePerGB! || pricePerGB === 0;
    });
  }

  // Unlimited only filter
  if (filters.unlimitedOnly) {
    filtered = filtered.filter(p => p.data.toLowerCase().includes("unlimited"));
  }

  return filtered;
}

/**
 * Sort plans based on sort options
 */
export function sortPlans(
  plans: ESIMPlan[],
  sortBy: FilterOptions["sortBy"] = "price",
  sortOrder: FilterOptions["sortOrder"] = "asc"
): ESIMPlan[] {
  const sorted = [...plans];

  sorted.sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (sortBy) {
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "pricePerGB":
        aValue = calculatePricePerGB(a);
        bValue = calculatePricePerGB(b);
        break;
      case "rating":
        aValue = a.networkRating;
        bValue = b.networkRating;
        break;
      case "data":
        aValue = extractDataGB(a.data);
        bValue = extractDataGB(b.data);
        break;
      case "duration":
        aValue = extractDurationDays(a.duration);
        bValue = extractDurationDays(b.duration);
        break;
      case "valueScore":
        aValue = calculateValueScore(a, plans);
        bValue = calculateValueScore(b, plans);
        break;
      default:
        return 0;
    }

    // Handle Infinity values (unlimited data)
    if (aValue === Infinity && bValue === Infinity) return 0;
    if (aValue === Infinity) return 1;
    if (bValue === Infinity) return -1;

    const comparison = aValue - bValue;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
}

// Helper functions
function extractDataGB(data: string): number {
  const match = data.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : (data.toLowerCase().includes("unlimited") ? Infinity : 0);
}

function extractDurationDays(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseFloat(match[1]) : 0;
}

function calculatePricePerGB(plan: ESIMPlan): number {
  const dataMatch = plan.data.match(/(\d+(?:\.\d+)?)/);
  if (!dataMatch) {
    return plan.data.toLowerCase().includes("unlimited") ? 0 : 999;
  }
  const dataGB = parseFloat(dataMatch[1]);
  return dataGB > 0 ? plan.price / dataGB : 0;
}

function calculateValueScore(plan: ESIMPlan, allPlans: ESIMPlan[]): number {
  if (allPlans.length === 0) return 50;

  const pricePerGB = calculatePricePerGB(plan);
  const minPricePerGB = Math.min(...allPlans.map(calculatePricePerGB).filter(p => p > 0));
  const maxPricePerGB = Math.max(...allPlans.map(calculatePricePerGB).filter(p => p < 999));
  
  const priceScore = maxPricePerGB > minPricePerGB
    ? 1 - ((pricePerGB - minPricePerGB) / (maxPricePerGB - minPricePerGB))
    : 1;
  
  const ratingScore = plan.networkRating / 5;
  
  const dataMatch = plan.data.match(/(\d+(?:\.\d+)?)/);
  const dataGB = dataMatch ? parseFloat(dataMatch[1]) : 0;
  const maxData = Math.max(...allPlans.map(p => {
    const match = p.data.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }));
  const dataScore = maxData > 0 ? Math.min(dataGB / maxData, 1) : (plan.data.toLowerCase().includes("unlimited") ? 1 : 0);
  
  const durationMatch = plan.duration.match(/(\d+)/);
  const durationDays = durationMatch ? parseFloat(durationMatch[1]) : 0;
  const maxDuration = Math.max(...allPlans.map(p => {
    const match = p.duration.match(/(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }));
  const durationScore = maxDuration > 0 ? Math.min(durationDays / maxDuration, 1) : 0.5;
  
  const totalScore = (
    priceScore * 0.4 +
    ratingScore * 0.3 +
    dataScore * 0.2 +
    durationScore * 0.1
  ) * 100;
  
  return Math.round(totalScore);
}

