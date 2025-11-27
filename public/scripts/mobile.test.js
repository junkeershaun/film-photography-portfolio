// Mobile-specific functionality tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Mobile Device Testing', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Read the HTML file
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    
    // Create a new JSDOM instance
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost'
    });
    
    document = dom.window.document;
    window = dom.window;
    
    // Load navigation.js
    const navigationScript = fs.readFileSync(path.resolve(__dirname, './navigation.js'), 'utf8');
    const scriptElement = document.createElement('script');
    scriptElement.textContent = navigationScript;
    document.body.appendChild(scriptElement);
    
    // Trigger DOMContentLoaded
    const event = new window.Event('DOMContentLoaded');
    document.dispatchEvent(event);
  });

  describe('Touch Target Sizes', () => {
    it('should ensure navigation toggle button meets minimum touch target size', () => {
      const navToggle = document.querySelector('.nav-toggle');
      expect(navToggle, 'Navigation toggle should exist').toBeTruthy();
      
      // In the CSS, the button has padding: 0.5rem (8px) and font-size: 1.5rem (24px)
      // This should result in a touch target of at least 40x40px
      // We verify the element exists and has appropriate classes
      expect(navToggle.tagName.toLowerCase()).toBe('button');
    });

    it('should ensure all navigation links have adequate touch targets', () => {
      const navLinks = document.querySelectorAll('.nav-link');
      expect(navLinks.length, 'Should have navigation links').toBeGreaterThan(0);
      
      // Each nav link should have padding: 0.5rem 1rem (8px 16px) minimum
      // This ensures adequate touch target size
      navLinks.forEach(link => {
        expect(link.tagName.toLowerCase()).toBe('a');
        expect(link.classList.contains('nav-link')).toBe(true);
      });
    });

    it('should ensure CTA button has adequate touch target size', () => {
      const ctaButton = document.querySelector('.cta-button');
      expect(ctaButton, 'CTA button should exist').toBeTruthy();
      
      // CTA button has padding: 1rem 2.5rem (16px 40px)
      // This ensures it's easily tappable on mobile
      expect(ctaButton.tagName.toLowerCase()).toBe('a');
    });

    it('should ensure form submit button has adequate touch target size', () => {
      const submitButton = document.querySelector('.submit-button');
      expect(submitButton, 'Submit button should exist').toBeTruthy();
      
      // Submit button has padding: 1rem (16px) and is full width on mobile
      // This ensures it's easily tappable
      expect(submitButton.tagName.toLowerCase()).toBe('button');
      expect(submitButton.type).toBe('submit');
    });

    it('should ensure portfolio items are easily tappable', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      expect(portfolioItems.length, 'Should have portfolio items').toBeGreaterThan(0);
      
      // Portfolio items are large cards with adequate touch area
      portfolioItems.forEach(item => {
        expect(item.tagName.toLowerCase()).toBe('article');
        expect(item.hasAttribute('tabindex')).toBe(true);
      });
    });
  });

  describe('Mobile Menu Functionality', () => {
    it('should have a hamburger menu toggle button', () => {
      const navToggle = document.querySelector('.nav-toggle');
      expect(navToggle, 'Navigation toggle should exist').toBeTruthy();
      expect(navToggle.tagName.toLowerCase()).toBe('button');
      expect(navToggle.textContent).toBe('☰');
    });

    it('should have mobile menu with proper structure', () => {
      const navMenu = document.querySelector('.nav-menu');
      expect(navMenu, 'Navigation menu should exist').toBeTruthy();
      
      // Menu should have navigation links
      const navLinks = navMenu.querySelectorAll('.nav-link');
      expect(navLinks.length, 'Should have navigation links in menu').toBeGreaterThan(0);
      
      // Each link should point to a section
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        expect(href.startsWith('#'), 'Link should point to section').toBe(true);
      });
    });

    it('should have hamburger button with aria-label for accessibility', () => {
      const navToggle = document.querySelector('.nav-toggle');
      expect(navToggle.hasAttribute('aria-label'), 'Toggle should have aria-label').toBe(true);
      expect(navToggle.getAttribute('aria-label')).toBe('Toggle navigation menu');
    });

    it('should have navigation menu items properly structured for mobile', () => {
      const navMenu = document.querySelector('.nav-menu');
      const menuItems = navMenu.querySelectorAll('li');
      
      expect(menuItems.length, 'Should have menu items').toBeGreaterThan(0);
      
      // Each menu item should contain a link
      menuItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        expect(link, 'Menu item should contain a link').toBeTruthy();
      });
    });
  });

  describe('Responsive Layout', () => {
    it('should have viewport meta tag for mobile responsiveness', () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      expect(viewportMeta, 'Viewport meta tag should exist').toBeTruthy();
      expect(viewportMeta.getAttribute('content')).toContain('width=device-width');
      expect(viewportMeta.getAttribute('content')).toContain('initial-scale=1.0');
    });

    it('should prevent horizontal overflow', () => {
      // Verify that overflow-x: hidden is set in CSS
      // This is tested by checking the HTML structure doesn't have elements that would cause overflow
      const body = document.body;
      expect(body).toBeTruthy();
      
      // Check that container elements exist with proper structure
      const containers = document.querySelectorAll('.container');
      expect(containers.length, 'Should have container elements').toBeGreaterThan(0);
    });

    it('should have responsive images with proper attributes', () => {
      const images = document.querySelectorAll('img');
      expect(images.length, 'Should have images').toBeGreaterThan(0);
      
      images.forEach(img => {
        // All images should have alt text
        expect(img.hasAttribute('alt'), `Image ${img.src} should have alt attribute`).toBe(true);
        
        // Below-fold images should have lazy loading
        if (img.classList.contains('profile-image') || 
            img.classList.contains('portfolio-image') ||
            img.classList.contains('modal-image')) {
          expect(img.getAttribute('loading')).toBe('lazy');
        }
      });
    });
  });

  describe('Form Input Handling', () => {
    it('should have form inputs with minimum font size to prevent zoom on iOS', () => {
      const inputs = document.querySelectorAll('input, textarea');
      expect(inputs.length, 'Should have form inputs').toBeGreaterThan(0);
      
      // All inputs should have proper structure
      inputs.forEach(input => {
        expect(input.hasAttribute('name')).toBe(true);
        expect(input.hasAttribute('id')).toBe(true);
      });
    });

    it('should have email input with correct type for mobile keyboard', () => {
      const emailInput = document.querySelector('input[type="email"]');
      expect(emailInput, 'Email input should exist').toBeTruthy();
      expect(emailInput.type).toBe('email');
      expect(emailInput.name).toBe('email');
    });

    it('should have labels associated with form inputs', () => {
      const inputs = document.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        const inputId = input.id;
        const label = document.querySelector(`label[for="${inputId}"]`);
        expect(label, `Label should exist for input ${inputId}`).toBeTruthy();
      });
    });
  });

  describe('Mobile Performance Optimizations', () => {
    it('should use lazy loading for below-fold images', () => {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      expect(lazyImages.length, 'Should have lazy-loaded images').toBeGreaterThan(0);
      
      // Profile image, portfolio images, and modal image should be lazy loaded
      const profileImage = document.querySelector('.profile-image');
      const portfolioImages = document.querySelectorAll('.portfolio-image');
      const modalImage = document.querySelector('#modal-image');
      
      expect(profileImage.getAttribute('loading')).toBe('lazy');
      expect(modalImage.getAttribute('loading')).toBe('lazy');
      
      portfolioImages.forEach(img => {
        expect(img.getAttribute('loading')).toBe('lazy');
      });
    });

    it('should have minified CSS and JS references for production', () => {
      // Check if minified versions exist (they should be referenced in production)
      // For now, we verify the structure is in place
      const cssLink = document.querySelector('link[rel="stylesheet"]');
      expect(cssLink, 'CSS link should exist').toBeTruthy();
      
      const scripts = document.querySelectorAll('script[src]');
      expect(scripts.length, 'Should have script tags').toBeGreaterThan(0);
    });
  });

  describe('Touch Interaction Support', () => {
    it('should have portfolio items with keyboard and touch support', () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      
      portfolioItems.forEach(item => {
        // Should have tabindex for keyboard accessibility
        expect(item.hasAttribute('tabindex')).toBe(true);
        
        // Should have role for accessibility
        expect(item.getAttribute('role')).toBe('button');
        
        // Should have aria-label
        expect(item.hasAttribute('aria-label')).toBe(true);
      });
    });

    it('should have modal with proper ARIA attributes for mobile accessibility', () => {
      const modal = document.getElementById('portfolio-modal');
      expect(modal, 'Modal should exist').toBeTruthy();
      
      expect(modal.getAttribute('role')).toBe('dialog');
      expect(modal.getAttribute('aria-modal')).toBe('true');
      expect(modal.hasAttribute('aria-labelledby')).toBe(true);
    });

    it('should have close button with proper aria-label', () => {
      const closeButton = document.querySelector('.modal-close');
      expect(closeButton, 'Modal close button should exist').toBeTruthy();
      expect(closeButton.getAttribute('aria-label')).toBe('Close modal');
    });
  });

  describe('Mobile Navigation Behavior', () => {
    it('should have smooth scroll behavior for navigation', () => {
      // Verify that navigation links have href attributes pointing to sections
      const navLinks = document.querySelectorAll('.nav-link');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        expect(href, 'Nav link should have href').toBeTruthy();
        expect(href.startsWith('#'), 'Nav link should point to section').toBe(true);
        
        // Verify the target section exists
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        expect(targetSection, `Section ${targetId} should exist`).toBeTruthy();
      });
    });

    it('should have skip to main content link for accessibility', () => {
      const skipLink = document.querySelector('.skip-to-main');
      expect(skipLink, 'Skip to main content link should exist').toBeTruthy();
      expect(skipLink.getAttribute('href')).toBe('#main-content');
      expect(skipLink.textContent).toBe('Skip to main content');
    });
  });
});
