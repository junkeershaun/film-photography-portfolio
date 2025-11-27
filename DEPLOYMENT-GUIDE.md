# Deploy Your Film Photography Portfolio to Vercel

This guide will help you deploy your Astro website to Vercel using GitHub.

## Prerequisites

- GitHub account (create one at https://github.com if you don't have one)
- Vercel account (sign up at https://vercel.com - you can use your GitHub account)
- Git installed on your computer

## Step 1: Initialize Git Repository

Open your terminal in the `astro-site` folder and run:

```cmd
cd astro-site
git init
git add .
git commit -m "Initial commit: Film photography portfolio"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - Name: `film-photography-portfolio` (or any name you prefer)
   - Description: "My film photography portfolio built with Astro"
   - Keep it **Public** or **Private** (your choice)
   - **Don't** initialize with README, .gitignore, or license (we already have files)
3. Click "Create repository"

## Step 3: Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```cmd
git remote add origin https://github.com/YOUR-USERNAME/film-photography-portfolio.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## Step 4: Deploy to Vercel

### Option A: Using Vercel Website (Recommended)

1. Go to https://vercel.com
2. Click "Sign Up" or "Log In" (use your GitHub account)
3. Click "Add New..." → "Project"
4. Click "Import Git Repository"
5. Find your `film-photography-portfolio` repository and click "Import"
6. Configure your project:
   - **Framework Preset**: Astro (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
7. Click "Deploy"

### Option B: Using Vercel CLI

```cmd
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts and select your GitHub repository.

## Step 5: Automatic Deployments

Once connected, Vercel will automatically:
- Deploy every time you push to the `main` branch
- Create preview deployments for pull requests
- Provide a production URL like: `https://your-site.vercel.app`

## Making Updates

To update your live site:

```cmd
# Make your changes to files
# Then commit and push:
git add .
git commit -m "Update portfolio images"
git push
```

Vercel will automatically rebuild and deploy your changes in ~1 minute!

## Custom Domain (Optional)

To use your own domain:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Environment Variables (If Needed)

If you need to add environment variables:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add your variables

## Troubleshooting

### Build Fails

Check the build logs in Vercel dashboard. Common issues:
- Missing dependencies: Make sure `package.json` is correct
- Image paths: Ensure all images are in `public/images/`

### Images Not Loading

- Verify images are in `astro-site/public/images/`
- Check that paths start with `/images/` not `./images/`

### Site Not Updating

- Check GitHub to ensure your commits were pushed
- Check Vercel dashboard for deployment status
- Clear your browser cache

## Your Live URLs

After deployment, you'll get:
- **Production**: `https://your-project.vercel.app`
- **Preview**: Unique URL for each branch/PR

## Next Steps

1. Share your portfolio URL!
2. Add a custom domain
3. Monitor analytics in Vercel dashboard
4. Keep updating your photography work

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/vercel/)
- [GitHub Documentation](https://docs.github.com)
