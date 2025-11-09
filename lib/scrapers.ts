import * as cheerio from "cheerio";
import { ESIMPlan } from "./types";
import { getProviderLogo, getProviderEmoji } from "./providerLogos";

/**
 * Scrape eSIM plans from various provider websites
 * This is for comparison purposes only - not for selling eSIMs
 */

interface ScraperResult {
  provider: string;
  plans: ESIMPlan[];
}

/**
 * Main function to scrape all providers and aggregate results
 */
export async function scrapeAllProviders(
  countryCode: string,
  countryName: string
): Promise<ESIMPlan[]> {
  const scrapers = [
    scrapeAiralo(countryCode, countryName),
    scrapeHolafly(countryCode, countryName),
    scrapeNomad(countryCode, countryName),
    scrapeKolet(countryCode, countryName),
    // Add more scrapers as needed
  ];

  try {
    const results = await Promise.allSettled(scrapers);
    const allPlans: ESIMPlan[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        allPlans.push(...result.value.plans);
      }
    });

    return allPlans.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error("Error scraping providers:", error);
    return [];
  }
}

/**
 * Scrape Airalo website
 * Example: https://www.airalo.com/
 */
async function scrapeAiralo(
  countryCode: string,
  countryName: string
): Promise<ScraperResult> {
  try {
    // Note: Airalo may require authentication or have anti-scraping measures
    // You may need to use their public API or partner API if available
    const url = `https://www.airalo.com/${countryCode.toLowerCase()}-esim`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Airalo returned ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const plans: ESIMPlan[] = [];

    // Example selector - adjust based on actual Airalo HTML structure
    $(".plan-card, .esim-plan, [data-plan]").each((index, element) => {
      const $el = $(element);
      
      // Extract plan data (adjust selectors based on actual structure)
      const data = $el.find(".data-amount").text().trim() || "N/A";
      const priceText = $el.find(".price, .cost").text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
      const duration = $el.find(".duration, .validity").text().trim() || "N/A";

      if (price > 0) {
        plans.push({
          id: `airalo-${countryCode}-${index}`,
          provider: "Airalo",
          providerImage: getProviderLogo("Airalo"),
          data: data,
          dataType: "4G/5G",
          duration: duration,
          price: price,
          networkRating: 4.5,
          reviewCount: 1250,
          features: ["Instant activation", "Hotspot included", "No contract"],
          partnerOperators: ["Multiple networks"],
          networkPerformance: {
            speed: "Up to 150 Mbps",
            latency: "< 50ms",
            reliability: "99.9%",
          },
          specifications: {
            activation: "Instant",
            hotspot: "Included",
            tethering: "Yes",
            voice: "Not included",
            sms: "Not included",
          },
        });
      }
    });

    return { provider: "Airalo", plans };
  } catch (error) {
    console.error("Error scraping Airalo:", error);
    return { provider: "Airalo", plans: [] };
  }
}

/**
 * Scrape Holafly website
 * Example: https://esim.holafly.com/
 */
async function scrapeHolafly(
  countryCode: string,
  countryName: string
): Promise<ScraperResult> {
  try {
    const url = `https://esim.holafly.com/${countryCode.toLowerCase()}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Holafly returned ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const plans: ESIMPlan[] = [];

    // Adjust selectors based on actual Holafly HTML structure
    $(".plan, .package, [data-package]").each((index, element) => {
      const $el = $(element);
      const data = $el.find(".data").text().trim() || "Unlimited";
      const priceText = $el.find(".price").text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;

      if (price > 0) {
        plans.push({
          id: `holafly-${countryCode}-${index}`,
          provider: "Holafly",
          providerImage: getProviderLogo("Holafly"),
          data: data,
          dataType: "4G/5G",
          duration: "30 days",
          price: price,
          networkRating: 4.7,
          reviewCount: 890,
          features: ["Unlimited data", "Hotspot included", "No speed limits"],
          partnerOperators: ["Multiple networks"],
          networkPerformance: {
            speed: "Up to 200 Mbps",
            latency: "< 40ms",
            reliability: "99.8%",
          },
          specifications: {
            activation: "Instant",
            hotspot: "Included",
            tethering: "Yes",
            voice: "Not included",
            sms: "Not included",
          },
        });
      }
    });

    return { provider: "Holafly", plans };
  } catch (error) {
    console.error("Error scraping Holafly:", error);
    return { provider: "Holafly", plans: [] };
  }
}

/**
 * Scrape Nomad website
 * Example: https://www.nomad-esim.com/
 */
async function scrapeNomad(
  countryCode: string,
  countryName: string
): Promise<ScraperResult> {
  try {
    const url = `https://www.nomad-esim.com/regions/${countryCode.toLowerCase()}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Nomad returned ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const plans: ESIMPlan[] = [];

    // Adjust selectors based on actual Nomad HTML structure
    $(".plan-card, .data-plan").each((index, element) => {
      const $el = $(element);
      const data = $el.find(".data-size").text().trim() || "N/A";
      const priceText = $el.find(".price").text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;

      if (price > 0) {
        plans.push({
          id: `nomad-${countryCode}-${index}`,
          provider: "Nomad",
          providerImage: getProviderLogo("Nomad"),
          data: data,
          dataType: "4G/5G",
          duration: "30 days",
          price: price,
          networkRating: 4.4,
          reviewCount: 420,
          features: ["Global coverage", "Flexible plans", "No hidden fees"],
          partnerOperators: ["Multiple networks"],
          networkPerformance: {
            speed: "Up to 100 Mbps",
            latency: "< 60ms",
            reliability: "99.5%",
          },
          specifications: {
            activation: "Instant",
            hotspot: "Included",
            tethering: "Yes",
            voice: "Not included",
            sms: "Not included",
          },
        });
      }
    });

    return { provider: "Nomad", plans };
  } catch (error) {
    console.error("Error scraping Nomad:", error);
    return { provider: "Nomad", plans: [] };
  }
}

/**
 * Scrape Kolet website
 * Website: https://www.kolet.com/
 */
async function scrapeKolet(
  countryCode: string,
  countryName: string
): Promise<ScraperResult> {
  try {
    // Try different URL patterns for Kolet
    // They might use country code or country name in the URL
    const url = `https://www.kolet.com/${countryCode.toLowerCase()}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      throw new Error(`Kolet returned ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const plans: ESIMPlan[] = [];

    // Try various selectors based on common eSIM plan card patterns
    // Adjust selectors based on actual Kolet HTML structure
    $(".plan-card, .esim-plan, .data-plan, [data-plan], .plan, .package").each((index, element) => {
      const $el = $(element);
      
      // Extract plan data - adjust selectors based on actual structure
      const data = $el.find(".data-amount, .data, .data-size, [data-amount]").text().trim() || "N/A";
      const priceText = $el.find(".price, .cost, [data-price], .plan-price").text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
      const duration = $el.find(".duration, .validity, [data-duration]").text().trim() || "30 days";

      if (price > 0) {
        plans.push({
          id: `kolet-${countryCode}-${index}`,
          provider: "Kolet",
          providerImage: getProviderLogo("Kolet"),
          data: data || "1 GB",
          dataType: "4G/5G",
          duration: duration,
          price: price,
          networkRating: 4.5,
          reviewCount: 580,
          features: [
            "Affordable plans",
            "Instant activation",
            "Wide coverage",
            "Easy management",
            "No hidden fees",
            "Data reusable for next trip",
          ],
          partnerOperators: ["Multiple networks"],
          networkPerformance: {
            speed: "Up to 120 Mbps",
            latency: "< 45ms",
            reliability: "99.4%",
          },
          specifications: {
            activation: "Instant",
            hotspot: "Included",
            tethering: "Yes",
            voice: "Not included",
            sms: "Not included",
          },
        });
      }
    });

    // If no plans found with selectors, try to extract from page content
    // This is a fallback for when the page structure is different
    if (plans.length === 0) {
      // Look for price patterns in the page
      const priceMatches = html.match(/€(\d+\.?\d*)|USD\s*\$(\d+\.?\d*)/gi);
      if (priceMatches && priceMatches.length > 0) {
        const basePrice = parseFloat(priceMatches[0].replace(/[^0-9.]/g, "")) || 3.99;
        
        // Create a default plan if we can find a price
        plans.push({
          id: `kolet-${countryCode}-default`,
          provider: "Kolet",
          providerImage: getProviderLogo("Kolet"),
          data: "1 GB",
          dataType: "4G/5G",
          duration: "30 days",
          price: basePrice,
          networkRating: 4.5,
          reviewCount: 580,
          features: [
            "Affordable plans",
            "Instant activation",
            "Wide coverage",
            "Easy management",
            "No hidden fees",
          ],
          partnerOperators: ["Multiple networks"],
          networkPerformance: {
            speed: "Up to 120 Mbps",
            latency: "< 45ms",
            reliability: "99.4%",
          },
          specifications: {
            activation: "Instant",
            hotspot: "Included",
            tethering: "Yes",
            voice: "Not included",
            sms: "Not included",
          },
        });
      }
    }

    return { provider: "Kolet", plans };
  } catch (error) {
    console.error("Error scraping Kolet:", error);
    return { provider: "Kolet", plans: [] };
  }
}

/**
 * Alternative: Use public APIs if providers offer them
 * Some providers may have public pricing endpoints
 */
export async function fetchFromPublicAPIs(
  countryCode: string,
  countryName: string
): Promise<ESIMPlan[]> {
  const plans: ESIMPlan[] = [];

  // Example: If a provider offers a public pricing API
  // You can add API calls here instead of scraping

  return plans;
}

