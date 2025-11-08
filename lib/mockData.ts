import { ESIMPlan } from "./types";
import { getProviderLogo, getProviderEmoji } from "./providerLogos";

/**
 * Generate realistic mock eSIM data for development and testing
 * This is used when no API is configured or as a fallback
 */
export function generateMockESIMData(
  countryCode: string,
  countryName: string
): ESIMPlan[] {
  // Base price varies by country (simulating regional pricing)
  const basePrice = 15 + Math.floor(Math.random() * 25);
  
  const providers = [
    {
      name: "Airalo",
      image: getProviderLogo("Airalo"),
      emoji: getProviderEmoji("Airalo"),
      basePriceOffset: 0,
      rating: 4.5,
      reviews: 1250,
      features: [
        "Instant activation",
        "Hotspot included",
        "No contract",
        "24/7 support",
      ],
      operators: ["Verizon", "AT&T", "T-Mobile"],
      speed: "Up to 150 Mbps",
      latency: "< 50ms",
      reliability: "99.9%",
    },
    {
      name: "Holafly",
      image: getProviderLogo("Holafly"),
      emoji: getProviderEmoji("Holafly"),
      basePriceOffset: 15,
      rating: 4.7,
      reviews: 890,
      features: [
        "Unlimited data",
        "Hotspot included",
        "No speed limits",
        "Multi-country",
      ],
      operators: ["Verizon", "AT&T", "T-Mobile", "Sprint"],
      speed: "Up to 200 Mbps",
      latency: "< 40ms",
      reliability: "99.8%",
    },
    {
      name: "Orange",
      image: getProviderLogo("Orange"),
      emoji: getProviderEmoji("Orange"),
      basePriceOffset: 5,
      rating: 4.3,
      reviews: 650,
      features: [
        "5G network",
        "Fast speeds",
        "EU coverage",
        "Easy setup",
      ],
      operators: ["Orange", "T-Mobile", "Verizon"],
      speed: "Up to 300 Mbps",
      latency: "< 30ms",
      reliability: "99.7%",
    },
    {
      name: "Nomad",
      image: getProviderLogo("Nomad"),
      emoji: getProviderEmoji("Nomad"),
      basePriceOffset: 3,
      rating: 4.4,
      reviews: 420,
      features: [
        "Global coverage",
        "Flexible plans",
        "No hidden fees",
        "Easy top-up",
      ],
      operators: ["AT&T", "T-Mobile", "Verizon"],
      speed: "Up to 100 Mbps",
      latency: "< 60ms",
      reliability: "99.5%",
    },
    {
      name: "Ubigi",
      image: getProviderLogo("Ubigi"),
      emoji: getProviderEmoji("Ubigi"),
      basePriceOffset: 8,
      rating: 4.6,
      reviews: 750,
      features: [
        "5G ready",
        "Instant setup",
        "Multi-device",
        "Global network",
      ],
      operators: ["SoftBank", "T-Mobile", "Orange"],
      speed: "Up to 250 Mbps",
      latency: "< 35ms",
      reliability: "99.6%",
    },
  ];

  const plans: ESIMPlan[] = providers.map((provider, index) => {
    const dataOptions = [
      { amount: "5 GB", type: "4G/5G" as const, duration: "7 days" },
      { amount: "10 GB", type: "4G/5G" as const, duration: "30 days" },
      { amount: "20 GB", type: "5G" as const, duration: "30 days" },
      { amount: "Unlimited", type: "4G/5G" as const, duration: "30 days" },
      { amount: "15 GB", type: "4G/5G" as const, duration: "14 days" },
    ];

    const selectedPlan = dataOptions[index % dataOptions.length];
    const isUnlimited = selectedPlan.amount === "Unlimited";

    return {
      id: `${provider.name.toLowerCase()}-${countryCode}-${index + 1}`,
      provider: provider.name,
      providerImage: provider.image,
      data: selectedPlan.amount,
      dataType: selectedPlan.type,
      duration: selectedPlan.duration,
      price: parseFloat((basePrice + provider.basePriceOffset + (isUnlimited ? 10 : 0)).toFixed(2)),
      networkRating: provider.rating,
      reviewCount: provider.reviews,
      features: provider.features,
      partnerOperators: provider.operators,
      networkPerformance: {
        speed: provider.speed,
        latency: provider.latency,
        reliability: provider.reliability,
      },
      specifications: {
        activation: "Instant",
        hotspot: "Included",
        tethering: "Yes",
        voice: index % 2 === 0 ? "Not included" : "Included",
        sms: index % 3 === 0 ? "Included" : "Not included",
      },
    };
  });

  // Sort by price (cheapest first)
  return plans.sort((a, b) => a.price - b.price);
}

