// Feature: personal-website, Property 9: Image alt text presence
// For any image element on the website, it should have a non-empty alt attribute providing descriptive text
// Validates: Requirements 7.2

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Property 9: Image alt text presence', () => {
  let dom;
  let document;

  beforeEach(() => {
    // Load the actual HTML file
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf-8');
    dom = new JSDOM(html, {
      url: 'http://localhost',
    });
    document = dom.window.document;
  });

  it('should ensure all images have non-empty alt attributes', () => {
    // Property: For any image element, it should have a non-empty alt attribute
    const images = document.querySelectorAll('img');
    
    // Verify that images exist on the page
    expect(images.length, 'Website should have images').toBeGreaterThan(0);
    
    // Check each image for alt text
    images.forEach((img, index) => {
      const altText = img.getAttribute('alt');
      const imgSrc = img.getAttribute('src') || 'unknown';
      
      // Property: Image should have an alt attribute
      expect(altText, `Image ${index} (${imgSrc}) should have an alt attribute`).not.toBeNull();
      
      // Property: Alt attribute should not be empty
      expect(altText.trim(), `Image ${index} (${imgSrc}) should have non-empty alt text`).not.toBe('');
      
      // Property: Alt text should be descriptive (more than just a single character)
      expect(altText.trim().length, `Image ${index} (${imgSrc}) should have descriptive alt text`).toBeGreaterThan(0);
    });
  });

  it('should verify profile image has descriptive alt text', () => {
    // Property: Profile image should have meaningful alt text
    const profileImage = document.querySelector('.profile-image');
    expect(profileImage, 'Profile image should exist').toBeTruthy();
    
    const altText = profileImage.getAttribute('alt');
    expect(altText, 'Profile image should have alt attribute').not.toBeNull();
    expect(altText.trim(), 'Profile image should have non-empty alt text').not.toBe('');
    
    // Property: Alt text should be descriptive (contain meaningful words)
    expect(altText.trim().length, 'Profile image alt text should be descriptive').toBeGreaterThan(5);
  });

  it('should verify all portfolio images have descriptive alt text', () => {
    // Property: All portfolio images should have meaningful alt text
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    expect(portfolioImages.length, 'Portfolio should have images').toBeGreaterThan(0);
    
    portfolioImages.forEach((img, index) => {
      const altText = img.getAttribute('alt');
      const imgSrc = img.getAttribute('src') || 'unknown';
      
      expect(altText, `Portfolio image ${index} (${imgSrc}) should have alt attribute`).not.toBeNull();
      expect(altText.trim(), `Portfolio image ${index} (${imgSrc}) should have non-empty alt text`).not.toBe('');
      
      // Property: Portfolio image alt text should be descriptive
      expect(altText.trim().length, `Portfolio image ${index} (${imgSrc}) alt text should be descriptive`).toBeGreaterThan(5);
    });
  });

  it('should verify modal image has alt attribute', () => {
    // Property: Modal image should have alt attribute (even if dynamically populated)
    const modalImage = document.querySelector('#modal-image');
    expect(modalImage, 'Modal image should exist').toBeTruthy();
    
    const altText = modalImage.getAttribute('alt');
    // Modal image may have empty alt initially, but should have the attribute
    expect(altText, 'Modal image should have alt attribute').not.toBeNull();
  });

  it('should use property-based testing to verify alt text for any image', () => {
    // Property-based test: For any image on the page, it should have non-empty alt text
    const images = Array.from(document.querySelectorAll('img'));
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: images.length - 1 }),
        (imageIndex) => {
          const img = images[imageIndex];
          const altText = img.getAttribute('alt');
          const imgSrc = img.getAttribute('src') || 'unknown';
          
          // Property: Image should have alt attribute
          expect(altText, `Random image ${imageIndex} (${imgSrc}) should have alt attribute`).not.toBeNull();
          
          // Property: Alt attribute should not be null or undefined
          expect(altText !== null && altText !== undefined, `Image ${imageIndex} should have defined alt`).toBe(true);
          
          // For non-modal images, alt text should be non-empty
          // Modal image may be empty initially but should have the attribute
          const isModalImage = img.id === 'modal-image';
          if (!isModalImage) {
            expect(altText.trim().length, `Image ${imageIndex} (${imgSrc}) should have non-empty alt text`).toBeGreaterThan(0);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ensure no images are missing alt attributes', () => {
    // Property: The set of images without alt attributes should be empty
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => {
      const altText = img.getAttribute('alt');
      return altText === null || altText === undefined;
    });
    
    expect(imagesWithoutAlt.length, 'No images should be missing alt attributes').toBe(0);
    
    // If any images are missing alt, list them for debugging
    if (imagesWithoutAlt.length > 0) {
      const missingSrcs = imagesWithoutAlt.map(img => img.getAttribute('src') || 'unknown');
      console.error('Images missing alt attributes:', missingSrcs);
    }
  });

  it('should ensure no images have empty alt text (except decorative images)', () => {
    // Property: The set of images with empty alt text should only include decorative images
    const images = document.querySelectorAll('img');
    const imagesWithEmptyAlt = Array.from(images).filter(img => {
      const altText = img.getAttribute('alt');
      return altText !== null && altText.trim() === '';
    });
    
    // For this website, we expect all images to be meaningful, not decorative
    // So no images should have empty alt text
    expect(imagesWithEmptyAlt.length, 'No meaningful images should have empty alt text').toBe(0);
    
    // If any images have empty alt, list them for debugging
    if (imagesWithEmptyAlt.length > 0) {
      const emptySrcs = imagesWithEmptyAlt.map(img => img.getAttribute('src') || 'unknown');
      console.error('Images with empty alt text:', emptySrcs);
    }
  });

  it('should verify alt text quality across all images', () => {
    // Property: All images should have meaningful alt text (not just placeholder text)
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      const altText = img.getAttribute('alt');
      const imgSrc = img.getAttribute('src') || 'unknown';
      
      // Skip modal image as it's dynamically populated
      if (img.id === 'modal-image') {
        return;
      }
      
      // Property: Alt text should not be generic placeholders
      const genericPlaceholders = ['image', 'img', 'picture', 'photo'];
      const isGeneric = genericPlaceholders.some(placeholder => 
        altText.toLowerCase().trim() === placeholder
      );
      
      expect(isGeneric, `Image ${index} (${imgSrc}) should not have generic alt text like "image" or "photo"`).toBe(false);
      
      // Property: Alt text should be reasonably descriptive (at least a few words)
      const wordCount = altText.trim().split(/\s+/).length;
      expect(wordCount, `Image ${index} (${imgSrc}) alt text should contain multiple words`).toBeGreaterThan(1);
    });
  });

  it('should verify all images are accessible through alt text', () => {
    // Property: For any image, a screen reader user should understand its purpose through alt text
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      const altText = img.getAttribute('alt');
      const imgSrc = img.getAttribute('src') || 'unknown';
      
      // Skip modal image
      if (img.id === 'modal-image') {
        return;
      }
      
      // Property: Alt text should exist and be meaningful
      expect(altText, `Image ${index} (${imgSrc}) should have alt text`).toBeTruthy();
      expect(altText.trim().length, `Image ${index} (${imgSrc}) should have substantial alt text`).toBeGreaterThan(3);
      
      // Property: Alt text should not just be the filename
      const filename = imgSrc.split('/').pop().split('.')[0];
      expect(altText.toLowerCase(), `Image ${index} alt text should not just be the filename`).not.toBe(filename.toLowerCase());
    });
  });
});
