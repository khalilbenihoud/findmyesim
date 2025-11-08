# 🌐 eSIM Comparator

A dynamic web application to **compare international eSIM offers** based on country, price, duration, and data volume.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Design**: Clean, minimalist interface inspired by ChatGPT/Claude

## 📦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles with Tailwind
├── components/         # React components
│   └── ui/            # UI components
├── lib/               # Utility functions
└── public/            # Static assets
```

## 🎨 Features

- Clean, minimalist UI design
- Responsive layout
- Dark mode support
- TypeScript for type safety
- Tailwind CSS for styling
- Real-time eSIM data from API providers
- Country autocomplete with flag emojis
- Detailed plan comparison with ratings and reviews

## 🔌 Data Source Configuration

This is a **comparison website** that aggregates eSIM plan data from various provider websites. The app scrapes pricing and plan information for comparison purposes only - it does not sell eSIMs.

### How It Works

The app scrapes comparison data from popular eSIM provider websites:

- **Airalo** - https://www.airalo.com/
- **Holafly** - https://esim.holafly.com/
- **Nomad** - https://www.nomad-esim.com/
- More providers can be added easily

### Setup Instructions

1. **Install dependencies** (including Cheerio for web scraping):
   ```bash
   npm install
   ```

2. **Customize scrapers** in `lib/scrapers.ts`:
   - Update the CSS selectors to match each provider's website structure
   - Add more providers by creating new scraper functions
   - Adjust data extraction logic based on each site's HTML structure

3. **Test the scrapers**:
   - The app will attempt to scrape real data from provider websites
   - If scraping fails or returns no results, it falls back to mock data
   - Check browser console for scraping errors

### Important Notes

⚠️ **Legal & Ethical Considerations:**
- Always respect websites' `robots.txt` files
- Don't scrape too frequently (rate limiting)
- Check each provider's Terms of Service
- Consider reaching out to providers for official data access
- This is for comparison/display purposes only

### Adding More Providers

To add a new provider:

1. Create a new scraper function in `lib/scrapers.ts`:
   ```typescript
   async function scrapeNewProvider(countryCode: string, countryName: string) {
     // Fetch the provider's website
     // Parse HTML with Cheerio
     // Extract plan data
     // Return formatted ESIMPlan[]
   }
   ```

2. Add it to the `scrapeAllProviders` function

3. Update the selectors based on the provider's HTML structure

### Fallback Behavior

- If scraping fails → Uses mock data
- If no plans found → Uses mock data
- Mock data is realistic and suitable for demos/testing