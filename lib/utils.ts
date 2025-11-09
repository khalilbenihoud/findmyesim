import { ESIMPlan } from "./types";

/**
 * Calculate price per GB for a plan
 */
export function calculatePricePerGB(plan: ESIMPlan): number {
  const dataMatch = plan.data.match(/(\d+(?:\.\d+)?)/);
  if (!dataMatch) {
    // If unlimited or can't parse, return 0 or a high number
    return plan.data.toLowerCase().includes("unlimited") ? 0 : 999;
  }
  const dataGB = parseFloat(dataMatch[1]);
  return dataGB > 0 ? plan.price / dataGB : 0;
}

/**
 * Calculate value score (0-100) based on multiple factors
 * Higher score = better value
 */
export function calculateValueScore(plan: ESIMPlan, allPlans: ESIMPlan[]): number {
  if (allPlans.length === 0) return 50;

  // Normalize factors (0-1 scale)
  const pricePerGB = calculatePricePerGB(plan);
  const minPricePerGB = Math.min(...allPlans.map(calculatePricePerGB).filter(p => p > 0));
  const maxPricePerGB = Math.max(...allPlans.map(calculatePricePerGB).filter(p => p < 999));
  
  // Price score (lower is better) - 40% weight
  const priceScore = maxPricePerGB > minPricePerGB
    ? 1 - ((pricePerGB - minPricePerGB) / (maxPricePerGB - minPricePerGB))
    : 1;
  
  // Network rating score - 30% weight
  const ratingScore = plan.networkRating / 5;
  
  // Data amount score (more data is better) - 20% weight
  const dataMatch = plan.data.match(/(\d+(?:\.\d+)?)/);
  const dataGB = dataMatch ? parseFloat(dataMatch[1]) : 0;
  const maxData = Math.max(...allPlans.map(p => {
    const match = p.data.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }));
  const dataScore = maxData > 0 ? Math.min(dataGB / maxData, 1) : (plan.data.toLowerCase().includes("unlimited") ? 1 : 0);
  
  // Duration score (longer is better) - 10% weight
  const durationMatch = plan.duration.match(/(\d+)/);
  const durationDays = durationMatch ? parseFloat(durationMatch[1]) : 0;
  const maxDuration = Math.max(...allPlans.map(p => {
    const match = p.duration.match(/(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }));
  const durationScore = maxDuration > 0 ? Math.min(durationDays / maxDuration, 1) : 0.5;
  
  // Calculate weighted score
  const totalScore = (
    priceScore * 0.4 +
    ratingScore * 0.3 +
    dataScore * 0.2 +
    durationScore * 0.1
  ) * 100;
  
  return Math.round(totalScore);
}

/**
 * Extract numeric value from data string (e.g., "10 GB" -> 10)
 */
export function extractDataGB(data: string): number {
  const match = data.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : (data.toLowerCase().includes("unlimited") ? Infinity : 0);
}

/**
 * Extract numeric value from duration string (e.g., "30 days" -> 30)
 */
export function extractDurationDays(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Extract max speed from speed string (e.g., "Up to 150 Mbps" -> 150)
 */
export function extractMaxSpeed(speed: string): number {
  const match = speed.match(/(\d+)/);
  return match ? parseFloat(match[1]) : 0;
}

