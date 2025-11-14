# Deploying to Netlify

## Quick Deploy Options

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://www.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next` (or leave empty - the plugin handles it)
   - Node version: `18` (or use `.nvmrc` file)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically install dependencies and build your site

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Environment Variables (if needed)

If you need to set environment variables:
- Go to Site settings → Environment variables
- Add any required variables (e.g., API keys, secrets)

## Important Notes

- The `@netlify/plugin-nextjs` plugin is already configured in `netlify.toml`
- Node.js version 18 is recommended (specified in `.nvmrc`)
- The build will automatically detect Next.js and use the appropriate settings
- API routes will work automatically with the Netlify Next.js plugin

## Troubleshooting

- If build fails, check the build logs in Netlify dashboard
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version matches (18.x recommended)
- Check that `@netlify/plugin-nextjs` is in `devDependencies`

