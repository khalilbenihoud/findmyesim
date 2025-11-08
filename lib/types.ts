// Shared types for eSIM plans
export interface ESIMPlan {
  id: string;
  provider: string;
  providerImage: string;
  data: string;
  dataType: "4G" | "5G" | "4G/5G";
  duration: string;
  price: number;
  networkRating: number;
  reviewCount: number;
  features: string[];
  partnerOperators: string[];
  networkPerformance: {
    speed: string;
    latency: string;
    reliability: string;
  };
  specifications: {
    activation: string;
    hotspot: string;
    tethering: string;
    voice: string;
    sms: string;
  };
}

export interface APIResponse {
  success: boolean;
  data?: ESIMPlan[];
  error?: string;
}

