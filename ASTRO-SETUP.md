# Astro Personal Website

This is your personal website migrated to Astro.

## Project Structure

```
astro-site/
├── public/
│   ├── images/          # Your images (profile, projects, etc.)
│   ├── scripts/         # JavaScript files (navigation, form-validation, portfolio)
│   └── styles/          # CSS files
├── src/
│   └── pages/
│       └── index.astro  # Main page (converted from index.html)
├── package.json
└── astro.config.mjs
```

## Commands

All commands are run from the `astro-site` directory:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## Getting Started

1. Navigate to the astro-site directory:
   ```cmd
   cd astro-site
   ```

2. Start the development server:
   ```cmd
   npm run dev
   ```

3. Open your browser to `http://localhost:4321`

## What Changed?

- Your `index.html` is now `src/pages/index.astro`
- CSS files are in `public/styles/` (accessible at `/styles/styles.css`)
- JavaScript files are in `public/scripts/` (accessible at `/scripts/*.js`)
- Images are in `public/images/` (accessible at `/images/*.jpg`)

## Benefits of Astro

- **Fast**: Ships zero JavaScript by default
- **Built-in dev server**: No need for http-server
- **Easy deployment**: Deploy to Netlify, Vercel, or any static host
- **Component-based**: Can break down into reusable components later
- **Image optimization**: Built-in image optimization available

## Next Steps

You can enhance your site by:
- Breaking down the page into Astro components
- Using Astro's built-in image optimization
- Adding a blog with markdown files
- Deploying to Netlify or Vercel with one command

## Deployment

Build for production:
```cmd
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting service.
