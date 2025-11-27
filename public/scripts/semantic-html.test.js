// Feature: personal-website, Property 8: Semantic HTML usage
// For any content section on the page, it should use appropriate semantic HTML5 elements (header, nav, main, section, article, footer) rather than generic divs
// Validates: Requirements 7.1

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Property 8: Semantic HTML usage', () => {
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

  it('should use semantic HTML5 elements for all major content sections', () => {
    // Property: The document should have proper semantic structure
    
    // Check for header element (navigation area)
    const header = document.querySelector('header');
    expect(header, 'Document should have a <header> element').toBeTruthy();
    
    // Check for nav element (navigation menu)
    const nav = document.querySelector('nav');
    expect(nav, 'Document should have a <nav> element').toBeTruthy();
    
    // Check for main element (main content area)
    const main = document.querySelector('main');
    expect(main, 'Document should have a <main> element').toBeTruthy();
    
    // Check for footer element
    const footer = document.querySelector('footer');
    expect(footer, 'Document should have a <footer> element').toBeTruthy();
    
    // Check that all major content areas use section elements
    const sections = document.querySelectorAll('section');
    expect(sections.length, 'Document should have multiple <section> elements').toBeGreaterThan(0);
    
    // Verify specific sections exist with semantic tags
    const expectedSections = ['home', 'about', 'portfolio', 'contact'];
    expectedSections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      expect(section, `Section with id "${sectionId}" should exist`).toBeTruthy();
      expect(section.tagName.toLowerCase(), `Element with id "${sectionId}" should be a <section> tag`).toBe('section');
    });
  });

  it('should use article elements for portfolio items', () => {
    // Property: Portfolio items should use <article> semantic elements
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    expect(portfolioItems.length, 'Portfolio should have items').toBeGreaterThan(0);
    
    portfolioItems.forEach((item, index) => {
      expect(item.tagName.toLowerCase(), `Portfolio item ${index} should be an <article> element`).toBe('article');
    });
  });

  it('should not use generic divs for major structural elements', () => {
    // Property: Major structural containers should use semantic elements, not divs
    
    // The direct children of body should include semantic elements
    const bodyChildren = Array.from(document.body.children);
    const semanticElements = bodyChildren.filter(child => {
      const tagName = child.tagName.toLowerCase();
      return ['header', 'main', 'footer', 'nav', 'section', 'article', 'aside'].includes(tagName);
    });
    
    expect(semanticElements.length, 'Body should have semantic element children').toBeGreaterThan(0);
    
    // Check that main content sections are not just divs
    const mainElement = document.querySelector('main');
    if (mainElement) {
      const mainChildren = Array.from(mainElement.children);
      const semanticSections = mainChildren.filter(child => {
        const tagName = child.tagName.toLowerCase();
        return ['section', 'article', 'aside', 'nav'].includes(tagName);
      });
      
      // Most children of main should be semantic elements
      expect(semanticSections.length, 'Main element should contain semantic sections').toBeGreaterThan(0);
    }
  });

  it('should use proper heading hierarchy within semantic sections', () => {
    // Property: Each semantic section should have appropriate heading structure
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionId = section.getAttribute('id');
      
      // Each section should have a heading (h1, h2, h3, etc.)
      const headings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length, `Section "${sectionId}" should have at least one heading`).toBeGreaterThan(0);
      
      // The first heading should typically be h1 or h2
      const firstHeading = headings[0];
      const headingLevel = parseInt(firstHeading.tagName.substring(1));
      expect(headingLevel, `First heading in section "${sectionId}" should be h1 or h2`).toBeLessThanOrEqual(2);
    });
  });

  it('should use semantic elements consistently across all content areas', () => {
    // Property: For any major content area, semantic HTML should be used
    
    // Generate test cases for all major areas
    const contentAreas = [
      { selector: 'header', expectedTag: 'header', description: 'Header area' },
      { selector: 'nav', expectedTag: 'nav', description: 'Navigation area' },
      { selector: 'main', expectedTag: 'main', description: 'Main content area' },
      { selector: 'footer', expectedTag: 'footer', description: 'Footer area' },
      { selector: '#home', expectedTag: 'section', description: 'Home section' },
      { selector: '#about', expectedTag: 'section', description: 'About section' },
      { selector: '#portfolio', expectedTag: 'section', description: 'Portfolio section' },
      { selector: '#contact', expectedTag: 'section', description: 'Contact section' },
    ];
    
    contentAreas.forEach(({ selector, expectedTag, description }) => {
      const element = document.querySelector(selector);
      expect(element, `${description} should exist`).toBeTruthy();
      expect(element.tagName.toLowerCase(), `${description} should use <${expectedTag}> tag`).toBe(expectedTag);
    });
  });

  it('should use semantic list elements for navigation', () => {
    // Property: Navigation menus should use semantic list elements (ul/ol with li)
    const nav = document.querySelector('nav');
    expect(nav, 'Navigation element should exist').toBeTruthy();
    
    // Navigation should contain a list
    const navList = nav.querySelector('ul, ol');
    expect(navList, 'Navigation should contain a list (ul or ol)').toBeTruthy();
    
    // List should contain list items
    const listItems = navList.querySelectorAll('li');
    expect(listItems.length, 'Navigation list should contain list items').toBeGreaterThan(0);
    
    // Each list item should contain a link
    listItems.forEach((li, index) => {
      const link = li.querySelector('a');
      expect(link, `List item ${index} should contain a link`).toBeTruthy();
    });
  });

  it('should use semantic form elements properly', () => {
    // Property: Forms should use proper semantic form elements
    const form = document.querySelector('form');
    expect(form, 'Form element should exist').toBeTruthy();
    
    // Form should have proper input elements with labels
    const inputs = form.querySelectorAll('input, textarea');
    expect(inputs.length, 'Form should have input elements').toBeGreaterThan(0);
    
    inputs.forEach((input, index) => {
      const inputId = input.getAttribute('id');
      expect(inputId, `Input ${index} should have an id attribute`).toBeTruthy();
      
      // Each input should have an associated label
      const label = form.querySelector(`label[for="${inputId}"]`);
      expect(label, `Input ${index} with id "${inputId}" should have an associated label`).toBeTruthy();
    });
    
    // Form should have a submit button
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton, 'Form should have a submit button').toBeTruthy();
  });

  it('should verify semantic structure using property-based testing', () => {
    // Property-based test: For any semantic element type, all instances should be used appropriately
    fc.assert(
      fc.property(
        fc.constantFrom('header', 'nav', 'main', 'section', 'article', 'footer', 'aside'),
        (semanticTag) => {
          const elements = document.querySelectorAll(semanticTag);
          
          // If the element type exists, verify it's used semantically
          if (elements.length > 0) {
            elements.forEach((element, index) => {
              // Element should have meaningful content or children
              const hasContent = element.textContent.trim().length > 0 || element.children.length > 0;
              expect(hasContent, `${semanticTag} element ${index} should have content or children`).toBe(true);
              
              // Element should not be empty or just whitespace
              if (element.children.length === 0) {
                expect(element.textContent.trim().length, `${semanticTag} element ${index} should not be empty`).toBeGreaterThan(0);
              }
            });
          }
          
          // Return true to satisfy fast-check
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ensure modal uses semantic elements', () => {
    // Property: Modal/dialog should use semantic elements
    const modal = document.querySelector('#portfolio-modal');
    expect(modal, 'Modal should exist').toBeTruthy();
    
    // Modal should have role="dialog" or be an aside element
    const isAside = modal.tagName.toLowerCase() === 'aside';
    const hasDialogRole = modal.getAttribute('role') === 'dialog';
    expect(isAside || hasDialogRole, 'Modal should be an <aside> element or have role="dialog"').toBe(true);
    
    // Modal content should use article or section
    const modalContent = modal.querySelector('article, section');
    expect(modalContent, 'Modal should contain semantic content (article or section)').toBeTruthy();
  });

  it('should verify all major sections use semantic HTML without relying on divs', () => {
    // Property: The ratio of semantic elements to divs should favor semantic elements in major areas
    
    const main = document.querySelector('main');
    expect(main, 'Main element should exist').toBeTruthy();
    
    // Count semantic elements within main
    const semanticElements = main.querySelectorAll('section, article, aside, nav, header, footer');
    const semanticCount = semanticElements.length;
    
    // Count direct div children of main (structural divs)
    const directDivs = Array.from(main.children).filter(child => child.tagName.toLowerCase() === 'div');
    const directDivCount = directDivs.length;
    
    // Property: There should be more semantic elements than direct structural divs
    expect(semanticCount, 'Should have more semantic elements than direct divs in main').toBeGreaterThan(directDivCount);
    
    // Property: All major content sections should be semantic elements
    const allSections = main.querySelectorAll('[id]');
    allSections.forEach(section => {
      const tagName = section.tagName.toLowerCase();
      const sectionId = section.getAttribute('id');
      
      // Major sections should use semantic tags
      if (['home', 'about', 'portfolio', 'contact'].includes(sectionId)) {
        expect(tagName, `Section with id "${sectionId}" should use semantic tag`).toBe('section');
      }
    });
  });
});
