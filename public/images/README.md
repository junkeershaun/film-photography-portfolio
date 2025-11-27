# Image Optimization Guide

This folder contains all images for the personal website. Follow these guidelines to ensure optimal performance:

## Image Requirements

### Required Images
1. **hero-background.jpg** - Hero section background (1920x1080px recommended)
2. **profile.jpg** - Profile photo for About section (600x600px recommended)
3. **project1.jpg** - Portfolio project 1 screenshot (800x600px recommended)
4. **project2.jpg** - Portfolio project 2 screenshot (800x600px recommended)
5. **project3.jpg** - Portfolio project 3 screenshot (800x600px recommended)

## Optimization Guidelines

### 1. Image Sizing
- **Hero background**: Max 1920px width, 1080px height
- **Profile photo**: Max 600px width and height (displayed as circle)
- **Portfolio images**: Max 800px width, 600px height

### 2. Compression
Before adding images to this folder, compress them using one of these tools:

**Online Tools:**
- [TinyPNG](https://tinypng.com/) - PNG and JPEG compression
- [Squoosh](https://squoosh.app/) - Advanced image compression with preview
- [ImageOptim](https://imageoptim.com/) - Mac application for image optimization

**Command Line Tools:**
- **ImageMagick**: `magick convert input.jpg -quality 85 -strip output.jpg`
- **jpegoptim**: `jpegoptim --max=85 --strip-all image.jpg`
- **pngquant**: `pngquant --quality=65-80 image.png`

### 3. Format Recommendations
- **JPEG**: Use for photos and images with many colors (hero, profile, portfolio)
- **PNG**: Use for images with transparency or text
- **WebP**: Modern format with better compression (optional, with JPEG fallback)

### 4. Compression Settings
- **JPEG Quality**: 80-85% (good balance between quality and file size)
- **PNG**: Use 8-bit color depth when possible
- **Target file sizes**:
  - Hero background: < 300KB
  - Profile photo: < 100KB
  - Portfolio images: < 150KB each

### 5. Lazy Loading
All below-the-fold images already have `loading="lazy"` attribute applied in the HTML:
- Profile image (About section)
- All portfolio images
- Modal image

The hero background is loaded immediately as it's above the fold.

## Quick Optimization Workflow

1. **Resize** your image to the recommended dimensions
2. **Compress** using one of the tools above
3. **Verify** file size meets targets
4. **Add** to this folder with the correct filename
5. **Test** on the website to ensure quality is acceptable

## Example: Optimizing with ImageMagick

```bash
# Resize and compress hero background
magick convert hero-original.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 -strip hero-background.jpg

# Resize and compress profile photo
magick convert profile-original.jpg -resize 600x600^ -gravity center -extent 600x600 -quality 85 -strip profile.jpg

# Resize and compress portfolio images
magick convert project1-original.jpg -resize 800x600^ -gravity center -extent 800x600 -quality 85 -strip project1.jpg
```

## Performance Impact

Properly optimized images will:
- Reduce initial page load time
- Decrease bandwidth usage
- Improve Lighthouse performance score
- Provide better user experience, especially on mobile devices

## Notes

- The `loading="lazy"` attribute is already implemented for all below-fold images
- Images are appropriately sized using CSS to prevent layout shifts
- All images have descriptive alt text for accessibility
