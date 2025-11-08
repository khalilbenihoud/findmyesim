/**
 * Provider logo URLs and configurations
 * 
 * Note: You may need to:
 * 1. Download logos from provider websites and host them in /public/images/
 * 2. Use official logo URLs if providers make them available
 * 3. Contact providers for permission to use their logos
 * 
 * For now, using placeholder URLs. Update these with actual logo paths.
 */

export const providerLogos: Record<string, string> = {
  // Airalo - Update with actual logo URL or use local file: /images/airalo-logo.png
  Airalo: "/images/airalo-logo.png", // Place in public/images/
  
  // Holafly - Update with actual logo URL or use local file
  Holafly: "/images/holafly-logo.png",
  
  // Nomad - Update with actual logo URL or use local file
  Nomad: "/images/nomad-logo.png",
  
  // Orange - Update with actual logo URL or use local file
  Orange: "/images/orange-logo.png",
  
  // Ubigi - Update with actual logo URL or use local file
  Ubigi: "/images/ubigi-logo.png",
  
  // Default fallback
  default: "/images/default-provider.svg",
};

/**
 * Get logo URL for a provider
 * Falls back to a default if provider not found
 */
export function getProviderLogo(providerName: string): string {
  // Try exact match first
  if (providerLogos[providerName]) {
    return providerLogos[providerName];
  }
  
  // Try case-insensitive match
  const normalizedName = providerName.toLowerCase();
  for (const [key, value] of Object.entries(providerLogos)) {
    if (key.toLowerCase() === normalizedName) {
      return value;
    }
  }
  
  // Fallback to default
  return providerLogos.default;
}

/**
 * Alternative: Use emoji as fallback if logo fails to load
 */
export function getProviderEmoji(providerName: string): string {
  const emojiMap: Record<string, string> = {
    Airalo: "📱",
    Holafly: "🌐",
    Nomad: "🗺️",
    Orange: "🍊",
    Ubigi: "🌍",
  };
  
  return emojiMap[providerName] || "📶";
}

