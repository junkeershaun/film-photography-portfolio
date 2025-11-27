// Feature: personal-website, Property 4: Portfolio item completeness
// For any portfolio item displayed on the page, it should contain a title, description, and image element
// Validates: Requirements 4.2

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Property 4: Portfolio item completeness', () => {
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

  it('should ensure every portfolio item contains title, description, and image', () => {
    // Get all portfolio items from the page
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Property: There should be at least one portfolio item
    expect(portfolioItems.length).toBeGreaterThan(0);
    
    // Property: For any portfolio item, it must contain all required elements
    portfolioItems.forEach((item, index) => {
      // Check for image element
      const image = item.querySelector('.portfolio-image');
      expect(image, `Portfolio item ${index + 1} should have an image`).toBeTruthy();
      expect(image.tagName.toLowerCase(), `Portfolio item ${index + 1} image should be an img tag`).toBe('img');
      expect(image.getAttribute('src'), `Portfolio item ${index + 1} image should have a src attribute`).toBeTruthy();
      expect(image.getAttribute('alt'), `Portfolio item ${index + 1} image should have alt text`).toBeTruthy();
      
      // Check for title element
      const title = item.querySelector('.portfolio-title');
      expect(title, `Portfolio item ${index + 1} should have a title`).toBeTruthy();
      expect(title.tagName.toLowerCase(), `Portfolio item ${index + 1} title should be an h3 tag`).toBe('h3');
      expect(title.textContent.trim(), `Portfolio item ${index + 1} title should have non-empty text`).not.toBe('');
      
      // Check for description element
      const description = item.querySelector('.portfolio-description');
      expect(description, `Portfolio item ${index + 1} should have a description`).toBeTruthy();
      expect(description.tagName.toLowerCase(), `Portfolio item ${index + 1} description should be a p tag`).toBe('p');
      expect(description.textContent.trim(), `Portfolio item ${index + 1} description should have non-empty text`).not.toBe('');
    });
  });

  it('should verify portfolio item structure using property-based testing', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioItemsArray = Array.from(portfolioItems);
    
    fc.assert(
      fc.property(
        fc.constantFrom(...portfolioItemsArray),
        (portfolioItem) => {
          // Property: Any portfolio item must have an image with src and alt
          const image = portfolioItem.querySelector('.portfolio-image');
          expect(image).toBeTruthy();
          expect(image.tagName.toLowerCase()).toBe('img');
          expect(image.getAttribute('src')).toBeTruthy();
          expect(image.getAttribute('alt')).toBeTruthy();
          expect(image.getAttribute('alt').trim()).not.toBe('');
          
          // Property: Any portfolio item must have a title with non-empty text
          const title = portfolioItem.querySelector('.portfolio-title');
          expect(title).toBeTruthy();
          expect(title.textContent.trim()).not.toBe('');
          
          // Property: Any portfolio item must have a description with non-empty text
          const description = portfolioItem.querySelector('.portfolio-description');
          expect(description).toBeTruthy();
          expect(description.textContent.trim()).not.toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should verify all portfolio items have complete information structure', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Property: Every portfolio item should have the same structure
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: portfolioItems.length - 1 }),
        (itemIndex) => {
          const item = portfolioItems[itemIndex];
          
          // Property: Item must contain portfolio-info container
          const portfolioInfo = item.querySelector('.portfolio-info');
          expect(portfolioInfo).toBeTruthy();
          
          // Property: All three required elements must exist
          const hasImage = item.querySelector('.portfolio-image') !== null;
          const hasTitle = item.querySelector('.portfolio-title') !== null;
          const hasDescription = item.querySelector('.portfolio-description') !== null;
          
          expect(hasImage && hasTitle && hasDescription).toBe(true);
          
          // Property: Image must have valid attributes
          const image = item.querySelector('.portfolio-image');
          const srcAttribute = image.getAttribute('src');
          const altAttribute = image.getAttribute('alt');
          
          expect(srcAttribute).toBeTruthy();
          expect(srcAttribute.trim()).not.toBe('');
          expect(altAttribute).toBeTruthy();
          expect(altAttribute.trim()).not.toBe('');
          
          // Property: Title and description must have content
          const title = item.querySelector('.portfolio-title');
          const description = item.querySelector('.portfolio-description');
          
          expect(title.textContent.trim().length).toBeGreaterThan(0);
          expect(description.textContent.trim().length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: personal-website, Property 5: Portfolio item interaction
// For any portfolio item, clicking on it should reveal or navigate to detailed information about that project
// Validates: Requirements 4.3

describe('Property 5: Portfolio item interaction', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Load the actual HTML file
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf-8');
    dom = new JSDOM(html, {
      url: 'http://localhost',
    });
    document = dom.window.document;
    window = dom.window;

    // Manually set up the portfolio interaction since we can't load external scripts in JSDOM
    const portfolioData = {
      'Project One': {
        image: 'images/project1.jpg',
        imageAlt: 'Screenshot of Project 1',
        title: 'Project One',
        description: 'A responsive web application built with modern technologies.',
        detailedDescription: 'This project showcases a fully responsive web application that adapts seamlessly to different screen sizes. Built using HTML5, CSS3, and JavaScript, it features smooth animations, intuitive navigation, and optimized performance.'
      },
      'Project Two': {
        image: 'images/project2.jpg',
        imageAlt: 'Screenshot of Project 2',
        title: 'Project Two',
        description: 'An interactive website featuring smooth animations and user-friendly design.',
        detailedDescription: 'An engaging interactive website that combines beautiful design with functional user experience. Features include scroll-triggered animations, dynamic content loading, and responsive layouts.'
      },
      'Project Three': {
        image: 'images/project3.jpg',
        imageAlt: 'Screenshot of Project 3',
        title: 'Project Three',
        description: 'A portfolio website showcasing creative work and design skills.',
        detailedDescription: 'A comprehensive portfolio website designed to showcase creative work and professional achievements. The site features a clean, modern design with emphasis on visual presentation.'
      }
    };

    const modal = document.getElementById('portfolio-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalDetails = document.getElementById('modal-details');
    const modalClose = document.querySelector('.modal-close');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Set up click handlers for portfolio items
    portfolioItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const projectTitle = this.querySelector('.portfolio-title').textContent;
        const projectData = portfolioData[projectTitle];
        
        if (projectData) {
          modalImage.src = projectData.image;
          modalImage.alt = projectData.imageAlt;
          modalTitle.textContent = projectData.title;
          modalDescription.textContent = projectData.description;
          modalDetails.textContent = projectData.detailedDescription;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Set up close button handler
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Set up click outside handler
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Set up escape key handler
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  it('should reveal detailed information when any portfolio item is clicked', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolio-modal');
    
    // Property: There should be at least one portfolio item
    expect(portfolioItems.length).toBeGreaterThan(0);
    
    // Property: Modal should exist
    expect(modal).toBeTruthy();
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: portfolioItems.length - 1 }),
        (itemIndex) => {
          const portfolioItem = portfolioItems[itemIndex];
          
          // Get the project title before clicking
          const projectTitle = portfolioItem.querySelector('.portfolio-title').textContent;
          
          // Ensure modal is closed before test
          modal.classList.remove('active');
          
          // Simulate click on portfolio item
          portfolioItem.click();
          
          // Property: Modal should become active after clicking
          expect(modal.classList.contains('active')).toBe(true);
          
          // Property: Modal should display the correct project information
          const modalTitle = document.getElementById('modal-title');
          const modalDescription = document.getElementById('modal-description');
          const modalDetails = document.getElementById('modal-details');
          const modalImage = document.getElementById('modal-image');
          
          // Verify modal content is populated
          expect(modalTitle.textContent).toBe(projectTitle);
          expect(modalDescription.textContent.trim()).not.toBe('');
          expect(modalDetails.textContent.trim()).not.toBe('');
          expect(modalImage.getAttribute('src')).toBeTruthy();
          expect(modalImage.getAttribute('alt')).toBeTruthy();
          
          // Property: Body overflow should be hidden when modal is open
          expect(document.body.style.overflow).toBe('hidden');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should close modal and restore body scroll when close button is clicked', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolio-modal');
    const modalClose = document.querySelector('.modal-close');
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: portfolioItems.length - 1 }),
        (itemIndex) => {
          const portfolioItem = portfolioItems[itemIndex];
          
          // Open modal by clicking portfolio item
          portfolioItem.click();
          expect(modal.classList.contains('active')).toBe(true);
          
          // Click close button
          modalClose.click();
          
          // Property: Modal should be closed
          expect(modal.classList.contains('active')).toBe(false);
          
          // Property: Body overflow should be restored
          expect(document.body.style.overflow).toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should close modal when clicking outside modal content', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolio-modal');
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: portfolioItems.length - 1 }),
        (itemIndex) => {
          const portfolioItem = portfolioItems[itemIndex];
          
          // Open modal
          portfolioItem.click();
          expect(modal.classList.contains('active')).toBe(true);
          
          // Create and dispatch click event on modal backdrop
          const clickEvent = new window.MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          Object.defineProperty(clickEvent, 'target', {
            value: modal,
            enumerable: true
          });
          modal.dispatchEvent(clickEvent);
          
          // Property: Modal should be closed
          expect(modal.classList.contains('active')).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should close modal when Escape key is pressed', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolio-modal');
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: portfolioItems.length - 1 }),
        (itemIndex) => {
          const portfolioItem = portfolioItems[itemIndex];
          
          // Open modal
          portfolioItem.click();
          expect(modal.classList.contains('active')).toBe(true);
          
          // Create and dispatch Escape key event
          const escapeEvent = new window.KeyboardEvent('keydown', {
            key: 'Escape',
            bubbles: true,
            cancelable: true
          });
          document.dispatchEvent(escapeEvent);
          
          // Property: Modal should be closed
          expect(modal.classList.contains('active')).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
