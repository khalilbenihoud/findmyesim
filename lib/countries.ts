export interface Country {
  name: string;
  code: string;
  flag: string;
}

export const countries: Country[] = [
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Italy", code: "IT", flag: "🇮🇹" },
  { name: "Spain", code: "ES", flag: "🇪🇸" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", flag: "🇰🇷" },
  { name: "China", code: "CN", flag: "🇨🇳" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", flag: "🇲🇽" },
  { name: "Argentina", code: "AR", flag: "🇦🇷" },
  { name: "Chile", code: "CL", flag: "🇨🇱" },
  { name: "Thailand", code: "TH", flag: "🇹🇭" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "Malaysia", code: "MY", flag: "🇲🇾" },
  { name: "Indonesia", code: "ID", flag: "🇮🇩" },
  { name: "Philippines", code: "PH", flag: "🇵🇭" },
  { name: "Vietnam", code: "VN", flag: "🇻🇳" },
  { name: "Turkey", code: "TR", flag: "🇹🇷" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦" },
  { name: "Egypt", code: "EG", flag: "🇪🇬" },
  { name: "Morocco", code: "MA", flag: "🇲🇦" },
  { name: "Greece", code: "GR", flag: "🇬🇷" },
  { name: "Portugal", code: "PT", flag: "🇵🇹" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱" },
  { name: "Belgium", code: "BE", flag: "🇧🇪" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭" },
  { name: "Austria", code: "AT", flag: "🇦🇹" },
  { name: "Sweden", code: "SE", flag: "🇸🇪" },
  { name: "Norway", code: "NO", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", flag: "🇩🇰" },
  { name: "Finland", code: "FI", flag: "🇫🇮" },
  { name: "Poland", code: "PL", flag: "🇵🇱" },
  { name: "Czech Republic", code: "CZ", flag: "🇨🇿" },
  { name: "Hungary", code: "HU", flag: "🇭🇺" },
  { name: "Romania", code: "RO", flag: "🇷🇴" },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿" },
  { name: "Israel", code: "IL", flag: "🇮🇱" },
  { name: "Russia", code: "RU", flag: "🇷🇺" },
  { name: "Ukraine", code: "UA", flag: "🇺🇦" },
];

export function searchCountries(query: string): Country[] {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return countries.filter(
    (country) =>
      country.name.toLowerCase().includes(lowerQuery) ||
      country.code.toLowerCase().includes(lowerQuery)
  );
}

