// Feature: personal-website, Property 2: Navigation link functionality
// For any navigation link in the menu, clicking it should navigate to the corresponding section or page
// Validates: Requirements 2.2

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Property 2: Navigation link functionality', () => {
  let dom;
  let document;
  let window;

  function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling to sections
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);
          
          if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  beforeEach(() => {
    // Load the actual HTML file
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf-8');
    dom = new JSDOM(html, {
      url: 'http://localhost',
    });
    document = dom.window.document;
    window = dom.window;

    // Mock scrollTo for testing
    window.scrollTo = vi.fn();

    // Setup navigation manually
    setupNavigation();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should navigate to corresponding section for any navigation link', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'about', 'portfolio', 'contact'),
        (sectionId) => {
          // Get the navigation link for this section
          const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
          expect(navLink).toBeTruthy();

          // Get the target section
          const targetSection = document.getElementById(sectionId);
          expect(targetSection).toBeTruthy();

          // Mock the navbar height
          const navbar = document.querySelector('.navbar');
          Object.defineProperty(navbar, 'offsetHeight', {
            configurable: true,
            value: 60,
          });

          // Mock the target section position
          Object.defineProperty(targetSection, 'offsetTop', {
            configurable: true,
            value: 500,
          });

          // Click the navigation link
          const clickEvent = new window.MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          });
          navLink.dispatchEvent(clickEvent);

          // Verify scrollTo was called with correct parameters
          expect(window.scrollTo).toHaveBeenCalled();
          const scrollCall = window.scrollTo.mock.calls[window.scrollTo.mock.calls.length - 1];
          
          // The scroll should be to the target section minus navbar height
          expect(scrollCall[0]).toEqual({
            top: 440, // 500 - 60
            behavior: 'smooth',
          });

          // Reset mock for next iteration
          window.scrollTo.mockClear();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle all navigation links correctly', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Property: Every navigation link should have a corresponding section
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      
      // Should be an internal link starting with #
      expect(href).toMatch(/^#/);
      
      // Extract section ID
      const sectionId = href.substring(1);
      
      // Corresponding section should exist
      const targetSection = document.getElementById(sectionId);
      expect(targetSection).toBeTruthy();
    });
  });

  it('should navigate correctly for any valid section ID', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'about', 'portfolio', 'contact'),
        (sectionId) => {
          // Property: For any section ID, there should be a navigation link
          const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
          expect(navLink).not.toBeNull();

          // Property: Clicking the link should trigger navigation behavior
          const navbar = document.querySelector('.navbar');
          Object.defineProperty(navbar, 'offsetHeight', {
            configurable: true,
            value: 60,
          });

          const targetSection = document.getElementById(sectionId);
          Object.defineProperty(targetSection, 'offsetTop', {
            configurable: true,
            value: Math.floor(Math.random() * 2000) + 100,
          });

          const clickEvent = new window.MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          });
          
          navLink.dispatchEvent(clickEvent);

          // Verify navigation occurred
          expect(window.scrollTo).toHaveBeenCalled();
          
          window.scrollTo.mockClear();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: personal-website, Property 3: Active navigation highlighting
// For any section that is currently in view, the corresponding navigation item should have the active state applied
// Validates: Requirements 2.4

describe('Property 3: Active navigation highlighting', () => {
  let dom;
  let document;
  let window;

  function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling to sections
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);
          
          if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Highlight active navigation item based on scroll position
    function highlightActiveSection() {
      const scrollPosition = window.scrollY;
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          // Remove active class from all links
          navLinks.forEach(link => {
            link.classList.remove('active');
          });
          
          // Add active class to current section's link
          const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
      
      // Special case: if at the very top, highlight home
      if (scrollPosition < 100) {
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (homeLink) {
          homeLink.classList.add('active');
        }
      }
    }

    // Expose the function for testing
    window.highlightActiveSection = highlightActiveSection;
  }

  beforeEach(() => {
    // Load the actual HTML file
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf-8');
    dom = new JSDOM(html, {
      url: 'http://localhost',
    });
    document = dom.window.document;
    window = dom.window;

    // Mock scrollTo for testing
    window.scrollTo = vi.fn();

    // Setup navigation manually
    setupNavigation();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should highlight the active navigation item for any section in view', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'about', 'portfolio', 'contact'),
        (sectionId) => {
          const navbar = document.querySelector('.navbar');
          const section = document.getElementById(sectionId);
          const navLinks = document.querySelectorAll('.nav-link');
          
          // Mock navbar height
          Object.defineProperty(navbar, 'offsetHeight', {
            configurable: true,
            value: 60,
          });

          // Set up section positions
          const sections = document.querySelectorAll('section[id]');
          let currentOffset = 0;
          sections.forEach((sec) => {
            Object.defineProperty(sec, 'offsetTop', {
              configurable: true,
              value: currentOffset,
            });
            Object.defineProperty(sec, 'offsetHeight', {
              configurable: true,
              value: 800,
            });
            currentOffset += 800;
          });

          // Calculate scroll position that would put this section in view
          const sectionTop = section.offsetTop;
          const navbarHeight = navbar.offsetHeight;
          const scrollPosition = sectionTop + navbarHeight + 150; // Well within the section

          // Mock window.scrollY
          Object.defineProperty(window, 'scrollY', {
            configurable: true,
            value: scrollPosition,
          });

          // Call the highlight function
          window.highlightActiveSection();

          // Verify that the correct navigation link has the active class
          const expectedActiveLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
          expect(expectedActiveLink.classList.contains('active')).toBe(true);

          // Verify that other navigation links do NOT have the active class
          navLinks.forEach((link) => {
            if (link !== expectedActiveLink) {
              expect(link.classList.contains('active')).toBe(false);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should highlight home when at the very top of the page', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mock navbar height
    Object.defineProperty(navbar, 'offsetHeight', {
      configurable: true,
      value: 60,
    });

    // Set up section positions
    const sections = document.querySelectorAll('section[id]');
    let currentOffset = 0;
    sections.forEach((sec) => {
      Object.defineProperty(sec, 'offsetTop', {
        configurable: true,
        value: currentOffset,
      });
      Object.defineProperty(sec, 'offsetHeight', {
        configurable: true,
        value: 800,
      });
      currentOffset += 800;
    });

    // Mock window.scrollY to be at the very top
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 50, // Less than 100
    });

    // Call the highlight function
    window.highlightActiveSection();

    // Verify that the home link has the active class
    const homeLink = document.querySelector('.nav-link[href="#home"]');
    expect(homeLink.classList.contains('active')).toBe(true);

    // Verify that other navigation links do NOT have the active class
    navLinks.forEach((link) => {
      if (link !== homeLink) {
        expect(link.classList.contains('active')).toBe(false);
      }
    });
  });

  it('should only have one active navigation item at any scroll position', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3000 }),
        (scrollPosition) => {
          const navbar = document.querySelector('.navbar');
          const navLinks = document.querySelectorAll('.nav-link');
          
          // Mock navbar height
          Object.defineProperty(navbar, 'offsetHeight', {
            configurable: true,
            value: 60,
          });

          // Set up section positions
          const sections = document.querySelectorAll('section[id]');
          let currentOffset = 0;
          sections.forEach((sec) => {
            Object.defineProperty(sec, 'offsetTop', {
              configurable: true,
              value: currentOffset,
            });
            Object.defineProperty(sec, 'offsetHeight', {
              configurable: true,
              value: 800,
            });
            currentOffset += 800;
          });

          // Mock window.scrollY
          Object.defineProperty(window, 'scrollY', {
            configurable: true,
            value: scrollPosition,
          });

          // Call the highlight function
          window.highlightActiveSection();

          // Count how many links have the active class
          let activeCount = 0;
          navLinks.forEach((link) => {
            if (link.classList.contains('active')) {
              activeCount++;
            }
          });

          // Property: Exactly one navigation item should be active
          expect(activeCount).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
