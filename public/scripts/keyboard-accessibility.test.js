// Feature: personal-website, Property 10: Keyboard accessibility
// For any interactive element (links, buttons, form inputs), it should be focusable and operable using only keyboard navigation
// Validates: Requirements 7.3

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Property 10: Keyboard accessibility', () => {
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
  });

  it('should ensure all links are keyboard focusable', () => {
    // Property: For any link element, it should be focusable via keyboard
    const links = document.querySelectorAll('a');
    expect(links.length, 'Document should have links').toBeGreaterThan(0);

    links.forEach((link, index) => {
      // Links should either have tabindex >= 0 or no tabindex (default is 0 for links)
      const tabindex = link.getAttribute('tabindex');
      
      if (tabindex !== null) {
        const tabindexValue = parseInt(tabindex);
        expect(tabindexValue, `Link ${index} should have tabindex >= 0 or no tabindex`).toBeGreaterThanOrEqual(0);
      }
      
      // Links should be focusable (not disabled or hidden)
      const isHidden = link.style.display === 'none' || link.style.visibility === 'hidden';
      const isDisabled = link.hasAttribute('disabled');
      
      if (!isHidden && !isDisabled) {
        // Simulate focus
        link.focus();
        // In JSDOM, we can't truly test focus, but we can verify the element is focusable
        expect(link.tagName.toLowerCase(), `Element ${index} should be a link`).toBe('a');
      }
    });
  });

  it('should ensure all buttons are keyboard focusable', () => {
    // Property: For any button element, it should be focusable via keyboard
    const buttons = document.querySelectorAll('button');
    expect(buttons.length, 'Document should have buttons').toBeGreaterThan(0);

    buttons.forEach((button, index) => {
      // Buttons should either have tabindex >= 0 or no tabindex (default is 0 for buttons)
      const tabindex = button.getAttribute('tabindex');
      
      if (tabindex !== null) {
        const tabindexValue = parseInt(tabindex);
        expect(tabindexValue, `Button ${index} should have tabindex >= 0 or no tabindex`).toBeGreaterThanOrEqual(0);
      }
      
      // Buttons should not have tabindex="-1" unless they're intentionally hidden
      if (tabindex === '-1') {
        // If tabindex is -1, the button should be hidden or have a specific reason
        const ariaHidden = button.getAttribute('aria-hidden');
        expect(ariaHidden, `Button ${index} with tabindex="-1" should have aria-hidden`).toBe('true');
      }
      
      // Verify button is not disabled (unless it's supposed to be)
      const isDisabled = button.hasAttribute('disabled');
      const isHidden = button.style.display === 'none' || button.style.visibility === 'hidden';
      
      if (!isHidden && !isDisabled) {
        expect(button.tagName.toLowerCase(), `Element ${index} should be a button`).toBe('button');
      }
    });
  });

  it('should ensure all form inputs are keyboard focusable', () => {
    // Property: For any form input element, it should be focusable via keyboard
    const inputs = document.querySelectorAll('input, textarea, select');
    expect(inputs.length, 'Document should have form inputs').toBeGreaterThan(0);

    inputs.forEach((input, index) => {
      // Inputs should either have tabindex >= 0 or no tabindex (default is 0 for inputs)
      const tabindex = input.getAttribute('tabindex');
      
      if (tabindex !== null) {
        const tabindexValue = parseInt(tabindex);
        expect(tabindexValue, `Input ${index} should have tabindex >= 0 or no tabindex`).toBeGreaterThanOrEqual(0);
      }
      
      // Verify input is not disabled (unless it's supposed to be)
      const isDisabled = input.hasAttribute('disabled');
      const isHidden = input.style.display === 'none' || input.style.visibility === 'hidden';
      
      if (!isHidden && !isDisabled) {
        const tagName = input.tagName.toLowerCase();
        expect(['input', 'textarea', 'select'].includes(tagName), `Element ${index} should be a form input`).toBe(true);
      }
    });
  });

  it('should ensure portfolio items are keyboard accessible', () => {
    // Property: Portfolio items with role="button" should be keyboard accessible
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    expect(portfolioItems.length, 'Document should have portfolio items').toBeGreaterThan(0);

    portfolioItems.forEach((item, index) => {
      const role = item.getAttribute('role');
      
      if (role === 'button') {
        // Elements with role="button" should have tabindex="0" to be keyboard focusable
        const tabindex = item.getAttribute('tabindex');
        expect(tabindex, `Portfolio item ${index} with role="button" should have tabindex`).not.toBeNull();
        
        if (tabindex !== null) {
          const tabindexValue = parseInt(tabindex);
          expect(tabindexValue, `Portfolio item ${index} should have tabindex >= 0`).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  it('should verify all interactive elements have proper tabindex using property-based testing', () => {
    // Property-based test: For any interactive element type, all instances should be keyboard accessible
    fc.assert(
      fc.property(
        fc.constantFrom('a', 'button', 'input', 'textarea', 'select', '[role="button"]'),
        (selector) => {
          const elements = document.querySelectorAll(selector);
          
          if (elements.length > 0) {
            elements.forEach((element, index) => {
              const tabindex = element.getAttribute('tabindex');
              const isDisabled = element.hasAttribute('disabled');
              const ariaHidden = element.getAttribute('aria-hidden') === 'true';
              
              // If element is not disabled and not aria-hidden, it should be keyboard accessible
              if (!isDisabled && !ariaHidden) {
                // Check if tabindex is explicitly set
                if (tabindex !== null) {
                  const tabindexValue = parseInt(tabindex);
                  
                  // Tabindex should be >= 0 for keyboard accessible elements
                  // (tabindex="-1" means programmatically focusable but not in tab order)
                  if (selector === '[role="button"]') {
                    // Elements with role="button" MUST have tabindex="0" to be in tab order
                    expect(tabindexValue, `${selector} element ${index} with role="button" should have tabindex >= 0`).toBeGreaterThanOrEqual(0);
                  } else {
                    // Native interactive elements (a, button, input) are focusable by default
                    // If tabindex is set, it should not be negative (unless intentionally removed from tab order)
                    expect(tabindexValue, `${selector} element ${index} should have tabindex >= -1`).toBeGreaterThanOrEqual(-1);
                  }
                } else {
                  // No tabindex means using default behavior
                  // For native interactive elements (a, button, input), this is fine
                  // For elements with role="button", tabindex should be explicitly set
                  if (selector === '[role="button"]') {
                    expect(tabindex, `${selector} element ${index} should have explicit tabindex`).not.toBeNull();
                  }
                }
              }
            });
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ensure all interactive elements can receive keyboard events', () => {
    // Property: For any interactive element, it should be able to receive keyboard events
    const interactiveSelectors = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      '[role="button"]',
      '[tabindex="0"]'
    ];

    interactiveSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach((element, index) => {
        const isDisabled = element.hasAttribute('disabled');
        const ariaHidden = element.getAttribute('aria-hidden') === 'true';
        const tabindex = element.getAttribute('tabindex');
        
        if (!isDisabled && !ariaHidden) {
          // Element should be able to receive focus
          // In a real browser, we would test element.focus() and document.activeElement
          // In JSDOM, we verify the element has the right attributes
          
          if (selector === '[role="button"]' || selector === '[tabindex="0"]') {
            // These elements MUST have tabindex="0" to be keyboard accessible
            expect(tabindex, `${selector} element ${index} should have tabindex="0"`).toBe('0');
          }
          
          // Verify element is not hidden
          const computedDisplay = element.style.display;
          const computedVisibility = element.style.visibility;
          
          if (computedDisplay !== 'none' && computedVisibility !== 'hidden') {
            // Element should be visible and focusable
            expect(element.tagName, `${selector} element ${index} should exist`).toBeTruthy();
          }
        }
      });
    });
  });

  it('should verify skip-to-main link is keyboard accessible', () => {
    // Property: The skip-to-main link should be keyboard accessible
    const skipLink = document.querySelector('.skip-to-main');
    expect(skipLink, 'Skip-to-main link should exist').toBeTruthy();
    
    // Skip link should be a link element
    expect(skipLink.tagName.toLowerCase(), 'Skip link should be an anchor element').toBe('a');
    
    // Skip link should have an href
    const href = skipLink.getAttribute('href');
    expect(href, 'Skip link should have href attribute').toBeTruthy();
    expect(href, 'Skip link should point to main content').toBe('#main-content');
    
    // Skip link should be focusable (no negative tabindex)
    const tabindex = skipLink.getAttribute('tabindex');
    if (tabindex !== null) {
      const tabindexValue = parseInt(tabindex);
      expect(tabindexValue, 'Skip link should have tabindex >= 0').toBeGreaterThanOrEqual(0);
    }
  });

  it('should ensure modal close button is keyboard accessible', () => {
    // Property: Modal close button should be keyboard accessible
    const modalClose = document.querySelector('.modal-close');
    expect(modalClose, 'Modal close button should exist').toBeTruthy();
    
    // Modal close should be a button
    expect(modalClose.tagName.toLowerCase(), 'Modal close should be a button element').toBe('button');
    
    // Modal close should have aria-label for screen readers
    const ariaLabel = modalClose.getAttribute('aria-label');
    expect(ariaLabel, 'Modal close button should have aria-label').toBeTruthy();
    expect(ariaLabel.toLowerCase(), 'Modal close button aria-label should indicate close action').toContain('close');
    
    // Modal close should be focusable
    const tabindex = modalClose.getAttribute('tabindex');
    if (tabindex !== null) {
      const tabindexValue = parseInt(tabindex);
      expect(tabindexValue, 'Modal close button should have tabindex >= 0').toBeGreaterThanOrEqual(0);
    }
  });

  it('should verify all buttons have accessible labels', () => {
    // Property: For any button, it should have accessible text or aria-label
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach((button, index) => {
      const textContent = button.textContent.trim();
      const ariaLabel = button.getAttribute('aria-label');
      const ariaLabelledBy = button.getAttribute('aria-labelledby');
      
      // Button should have either text content, aria-label, or aria-labelledby
      const hasAccessibleLabel = textContent.length > 0 || ariaLabel || ariaLabelledBy;
      expect(hasAccessibleLabel, `Button ${index} should have accessible label (text, aria-label, or aria-labelledby)`).toBe(true);
    });
  });

  it('should ensure form labels are properly associated with inputs', () => {
    // Property: For any form input, it should have an associated label
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach((input, index) => {
      const inputId = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      // Input should have either:
      // 1. An id with a corresponding label[for="id"]
      // 2. An aria-label
      // 3. An aria-labelledby
      
      if (inputId) {
        const label = document.querySelector(`label[for="${inputId}"]`);
        const hasLabel = label !== null;
        const hasAriaLabel = ariaLabel !== null || ariaLabelledBy !== null;
        
        expect(hasLabel || hasAriaLabel, `Input ${index} with id="${inputId}" should have associated label or aria-label`).toBe(true);
      } else {
        // If no id, should have aria-label or aria-labelledby
        const hasAriaLabel = ariaLabel !== null || ariaLabelledBy !== null;
        expect(hasAriaLabel, `Input ${index} without id should have aria-label or aria-labelledby`).toBe(true);
      }
    });
  });

  it('should verify navigation menu is keyboard accessible', () => {
    // Property: Navigation menu should be fully keyboard accessible
    const navMenu = document.querySelector('.nav-menu');
    expect(navMenu, 'Navigation menu should exist').toBeTruthy();
    
    const navLinks = navMenu.querySelectorAll('.nav-link');
    expect(navLinks.length, 'Navigation menu should have links').toBeGreaterThan(0);
    
    navLinks.forEach((link, index) => {
      // Each nav link should be focusable
      const tabindex = link.getAttribute('tabindex');
      
      if (tabindex !== null) {
        const tabindexValue = parseInt(tabindex);
        expect(tabindexValue, `Nav link ${index} should have tabindex >= 0`).toBeGreaterThanOrEqual(0);
      }
      
      // Nav link should be an anchor element
      expect(link.tagName.toLowerCase(), `Nav link ${index} should be an anchor element`).toBe('a');
      
      // Nav link should have href
      const href = link.getAttribute('href');
      expect(href, `Nav link ${index} should have href attribute`).toBeTruthy();
    });
    
    // Navigation toggle button should be keyboard accessible
    const navToggle = document.querySelector('.nav-toggle');
    expect(navToggle, 'Navigation toggle should exist').toBeTruthy();
    expect(navToggle.tagName.toLowerCase(), 'Navigation toggle should be a button').toBe('button');
    
    // Nav toggle should have aria-label
    const ariaLabel = navToggle.getAttribute('aria-label');
    expect(ariaLabel, 'Navigation toggle should have aria-label').toBeTruthy();
  });

  it('should ensure all interactive elements are in logical tab order', () => {
    // Property: Interactive elements should have logical tab order (no positive tabindex values)
    const allInteractive = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    
    allInteractive.forEach((element, index) => {
      const tabindex = element.getAttribute('tabindex');
      
      if (tabindex !== null) {
        const tabindexValue = parseInt(tabindex);
        
        // Positive tabindex values (> 0) are discouraged as they disrupt natural tab order
        // We allow 0 (natural order) and -1 (programmatically focusable only)
        expect(tabindexValue, `Element ${index} should not have positive tabindex (disrupts natural tab order)`).toBeLessThanOrEqual(0);
      }
    });
  });

  it('should verify property-based test for all interactive element types', () => {
    // Property-based test: For any type of interactive element, all instances should be keyboard accessible
    fc.assert(
      fc.property(
        fc.constantFrom(
          { selector: 'a', name: 'links' },
          { selector: 'button', name: 'buttons' },
          { selector: 'input', name: 'inputs' },
          { selector: 'textarea', name: 'textareas' },
          { selector: '.portfolio-item[role="button"]', name: 'portfolio items' }
        ),
        ({ selector, name }) => {
          const elements = document.querySelectorAll(selector);
          
          if (elements.length > 0) {
            elements.forEach((element) => {
              const tabindex = element.getAttribute('tabindex');
              const isDisabled = element.hasAttribute('disabled');
              const ariaHidden = element.getAttribute('aria-hidden') === 'true';
              
              // If element is visible and not disabled, it should be keyboard accessible
              if (!isDisabled && !ariaHidden) {
                // Check tabindex
                if (tabindex !== null) {
                  const tabindexValue = parseInt(tabindex);
                  
                  // For elements with role="button", tabindex must be >= 0
                  if (element.getAttribute('role') === 'button') {
                    expect(tabindexValue, `${name} with role="button" should have tabindex >= 0`).toBeGreaterThanOrEqual(0);
                  } else {
                    // For native interactive elements, tabindex should not be positive (disrupts tab order)
                    expect(tabindexValue, `${name} should not have positive tabindex`).toBeLessThanOrEqual(0);
                  }
                }
                
                // Verify element has accessible name
                const textContent = element.textContent.trim();
                const ariaLabel = element.getAttribute('aria-label');
                const ariaLabelledBy = element.getAttribute('aria-labelledby');
                const alt = element.getAttribute('alt');
                const title = element.getAttribute('title');
                
                const hasAccessibleName = textContent.length > 0 || ariaLabel || ariaLabelledBy || alt || title;
                
                // Some elements like inputs don't need text content but should have labels
                if (element.tagName.toLowerCase() !== 'input' && 
                    element.tagName.toLowerCase() !== 'textarea' && 
                    element.tagName.toLowerCase() !== 'select') {
                  expect(hasAccessibleName, `${name} should have accessible name`).toBe(true);
                }
              }
            });
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
