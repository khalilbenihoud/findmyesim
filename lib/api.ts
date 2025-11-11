import { ESIMPlan, APIResponse } from "./types";

/**
 * Fetch eSIM plans for a specific country
 * @param countryCode - ISO country code (e.g., "US", "GB")
 * @param countryName - Full country name for display
 * @returns Promise with eSIM plans or error
 */
export async function fetchESIMPlans(
  countryCode: string,
  countryName: string,
  opts?: { minDurationDays?: number; maxPrice?: number }
): Promise<APIResponse> {
  try {
    // Call our Next.js API route
    const params = new URLSearchParams({
      countryCode: countryCode,
      countryName: countryName,
    });
    if (opts?.minDurationDays !== undefined) {
      params.set("minDurationDays", String(opts.minDurationDays));
    }
    if (opts?.maxPrice !== undefined) {
      params.set("maxPrice", String(opts.maxPrice));
    }
    const response = await fetch(`/api/esim?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: APIResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch eSIM plans");
    }

    return data;
  } catch (error) {
    console.error("Error fetching eSIM plans:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Transform external API data to our ESIMPlan format
 * This function can be customized based on the actual API provider's response structure
 */
export function transformAPIData(rawData: any): ESIMPlan[] {
  // This is a placeholder - customize based on your API provider's response format
  // Example transformation for different API structures
  
  if (Array.isArray(rawData)) {
    return rawData.map((item, index) => ({
      id: item.id || `plan-${index}`,
      provider: item.provider || item.name || "Unknown Provider",
      providerImage: item.logo || item.icon || "📱",
      data: item.data || item.dataAmount || "N/A",
      dataType: item.dataType || item.networkType || "4G/5G",
      duration: item.duration || item.validity || "N/A",
      price: parseFloat(item.price || item.cost || 0),
      networkRating: parseFloat(item.rating || item.networkRating || 4.0),
      reviewCount: parseInt(item.reviews || item.reviewCount || 0),
      features: item.features || item.benefits || [],
      partnerOperators: item.operators || item.networks || [],
      networkPerformance: {
        speed: item.speed || item.maxSpeed || "N/A",
        latency: item.latency || "N/A",
        reliability: item.reliability || item.uptime || "N/A",
      },
      specifications: {
        activation: item.activation || "Instant",
        hotspot: item.hotspot || "Included",
        tethering: item.tethering || "Yes",
        voice: item.voice || "Not included",
        sms: item.sms || "Not included",
      },
    }));
  }

  return [];
}

