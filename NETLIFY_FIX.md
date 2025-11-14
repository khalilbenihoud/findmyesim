# Netlify Deployment Fix

## Issues Fixed

1. ✅ Removed `publish = ".next"` from `netlify.toml` - The Netlify Next.js plugin handles this automatically
2. ✅ Updated `package-lock.json` to sync with dependencies
3. ✅ Verified local build works successfully

## Next Steps to Deploy

1. **Commit the updated files:**
   ```bash
   git add netlify.toml package-lock.json package.json
   git commit -m "Fix Netlify deployment configuration"
   git push origin main
   ```

2. **Redeploy on Netlify:**
   - Go to your Netlify dashboard
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - Or push to trigger automatic deployment

## Important Notes

- The API route `/api/esim` is dynamic (uses `searchParams`), which is expected and will work on Netlify
- The `@netlify/plugin-nextjs` plugin will handle all Next.js routing automatically
- Node.js 18 is specified in `.nvmrc` and `netlify.toml`

## If Build Still Fails

If you still get errors, check:
1. Ensure `package-lock.json` is committed to the repo
2. Check the full build logs in Netlify dashboard (not just the excerpt)
3. Verify all files are committed (especially `next.config.js`, `tailwind.config.ts`, etc.)

