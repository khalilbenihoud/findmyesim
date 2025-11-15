import { NextRequest, NextResponse } from "next/server";
import { ESIMPlan, APIResponse } from "@/lib/types";
import { scrapeAllProviders } from "@/lib/scrapers";
import { generateMockESIMData } from "@/lib/mockData";

/**
 * Next.js API Route Handler for eSIM plans
 * 
 * This route scrapes comparison data from various eSIM provider websites
 * to aggregate pricing and plan information for comparison purposes.
 * 
 * Supported providers:
 * - Airalo
 * - Holafly
 * - Nomad
 * - Kolet
 * - (More can be added)
 * 
 * Note: This is for comparison/display purposes only, not for selling eSIMs.
 */

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryCode = searchParams.get("countryCode");
    const countryName = searchParams.get("countryName");
    const minDurationDaysParam = searchParams.get("minDurationDays");
    const maxPriceParam = searchParams.get("maxPrice");
    const minDurationDays = minDurationDaysParam ? Math.max(1, Number(minDurationDaysParam)) : undefined;
    const maxPrice = maxPriceParam ? Math.max(0, Number(maxPriceParam)) : undefined;

    if (!countryCode || !countryName) {
      return NextResponse.json(
        {
          success: false,
          error: "Country code and name are required",
        } as APIResponse,
        { status: 400 }
      );
    }

    // Try to scrape real data from provider websites
    let plans: ESIMPlan[] = [];
    
    try {
      plans = await scrapeAllProviders(countryCode, countryName);
      
      // If scraping returns no results, fall back to mock data
      if (plans.length === 0) {
        console.warn("No plans found from scraping. Using mock data.");
        plans = generateMockESIMData(countryCode, countryName);
      }
    } catch (error) {
      console.error("Error scraping providers, using mock data:", error);
      // Fallback to mock data if scraping fails
      plans = generateMockESIMData(countryCode, countryName);
    }

    // Apply optional server-side filters
    if (minDurationDays !== undefined || maxPrice !== undefined) {
      const extractDurationDays = (duration: string) => {
        const match = duration.match(/(\d+)/);
        return match ? Number(match[1]) : 0;
      };
      plans = plans.filter((p) => {
        const durationOk = minDurationDays === undefined ? true : extractDurationDays(p.duration) >= minDurationDays;
        const priceOk = maxPrice === undefined ? true : p.price <= maxPrice;
        return durationOk && priceOk;
      });
    }

    return NextResponse.json({
      success: true,
      data: plans,
    } as APIResponse);
  } catch (error) {
    console.error("Error in eSIM API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as APIResponse,
      { status: 500 }
    );
  }
}


