# Quick Deploy to Vercel - 5 Minutes

## 🚀 Fast Track Deployment

### 1. Initialize Git (in astro-site folder)

```cmd
git init
git add .
git commit -m "Initial commit: Film photography portfolio"
```

### 2. Create GitHub Repo

- Go to: https://github.com/new
- Name: `film-photography-portfolio`
- Click "Create repository"

### 3. Push to GitHub

```cmd
git remote add origin https://github.com/YOUR-USERNAME/film-photography-portfolio.git
git branch -M main
git push -u origin main
```

(Replace `YOUR-USERNAME` with your GitHub username)

### 4. Deploy to Vercel

- Go to: https://vercel.com
- Click "Add New..." → "Project"
- Import your GitHub repository
- Click "Deploy"

Done! Your site will be live at `https://your-project.vercel.app`

## 📝 Update Your Site Later

```cmd
# Make changes to your files
git add .
git commit -m "Updated photos"
git push
```

Vercel auto-deploys in ~1 minute!

## 🎯 What You Get

✅ Free hosting
✅ Automatic HTTPS
✅ Global CDN
✅ Auto-deployments on push
✅ Preview URLs for testing

See `DEPLOYMENT-GUIDE.md` for detailed instructions.
