import { countries, type Country } from "./countries";
import { type FiatCurrency } from "./utils";

export interface ParsedQuery {
  country: Country | null;
  days: number | null;
  budget: number | null;
  currency: FiatCurrency;
}

const currencySymbols: Record<string, FiatCurrency> = {
  "$": "USD",
  "€": "EUR",
  "£": "GBP",
  "usd": "USD",
  "eur": "EUR",
  "euro": "EUR",
  "euros": "EUR",
  "gbp": "GBP",
  "pound": "GBP",
  "pounds": "GBP",
  "cad": "CAD",
  "aud": "AUD",
  "dollar": "USD",
  "dollars": "USD",
};

/**
 * Parse natural language query to extract country, days, budget, and currency
 */
export function parseNaturalLanguageQuery(query: string): ParsedQuery {
  const lowerQuery = query.toLowerCase();
  const result: ParsedQuery = {
    country: null,
    days: null,
    budget: null,
    currency: "USD",
  };

  // Extract country
  for (const country of countries) {
    const countryNameLower = country.name.toLowerCase();
    const countryCodeLower = country.code.toLowerCase();
    
    // Check for exact country name or code in the query
    if (
      lowerQuery.includes(countryNameLower) ||
      lowerQuery.includes(countryCodeLower) ||
      // Handle common variations
      (countryNameLower.includes("united states") && (lowerQuery.includes("usa") || lowerQuery.includes("us"))) ||
      (countryNameLower.includes("united kingdom") && (lowerQuery.includes("uk") || lowerQuery.includes("britain"))) ||
      (countryNameLower.includes("united arab emirates") && lowerQuery.includes("uae"))
    ) {
      result.country = country;
      break;
    }
  }

  // Extract currency
  for (const [symbol, currency] of Object.entries(currencySymbols)) {
    if (lowerQuery.includes(symbol)) {
      result.currency = currency;
      break;
    }
  }

  // Extract days/duration
  const dayPatterns = [
    /(\d+)\s*days?/i,
    /for\s+(\d+)\s*days?/i,
    /staying\s+(\d+)\s*days?/i,
    /traveling\s+for\s+(\d+)\s*days?/i,
    /(\d+)\s*day\s+trip/i,
    /(\d+)\s*day\s+stay/i,
    /duration\s+of\s+(\d+)\s*days?/i,
  ];

  for (const pattern of dayPatterns) {
    const match = query.match(pattern);
    if (match) {
      const days = parseInt(match[1], 10);
      if (days > 0 && days <= 365) {
        result.days = days;
        break;
      }
    }
  }

  // Extract budget
  const budgetPatterns = [
    /\$(\d+(?:\.\d+)?)/, // $20, $20.50
    /€(\d+(?:\.\d+)?)/, // €20
    /£(\d+(?:\.\d+)?)/, // £20
    /budget\s+of\s+(\d+(?:\.\d+)?)/i,
    /spending\s+(\d+(?:\.\d+)?)/i,
    /willing\s+to\s+spend\s+(\d+(?:\.\d+)?)/i,
    /spend\s+(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*(?:usd|eur|gbp|cad|aud)/i,
    /up\s+to\s+(\d+(?:\.\d+)?)/i,
    /maximum\s+of\s+(\d+(?:\.\d+)?)/i,
    /max\s+(\d+(?:\.\d+)?)/i,
  ];

  for (const pattern of budgetPatterns) {
    const match = query.match(pattern);
    if (match) {
      const budget = parseFloat(match[1]);
      if (budget > 0 && budget <= 10000) {
        result.budget = budget;
        // If currency symbol found, update currency
        if (pattern.source.includes("€")) {
          result.currency = "EUR";
        } else if (pattern.source.includes("£")) {
          result.currency = "GBP";
        }
        break;
      }
    }
  }

  return result;
}

