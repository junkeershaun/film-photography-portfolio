// Unit test for about section content
// Validates: Requirements 3.1, 3.2

import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('About Section Content', () => {
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

  it('should have an about section with id "about"', () => {
    const aboutSection = document.getElementById('about');
    expect(aboutSection).toBeTruthy();
    expect(aboutSection.tagName.toLowerCase()).toBe('section');
    expect(aboutSection.classList.contains('about')).toBe(true);
  });

  it('should contain a profile image', () => {
    const aboutSection = document.getElementById('about');
    const profileImage = aboutSection.querySelector('.profile-image');
    
    expect(profileImage).toBeTruthy();
    expect(profileImage.tagName.toLowerCase()).toBe('img');
    
    // Verify image has src attribute
    expect(profileImage.getAttribute('src')).toBeTruthy();
    
    // Verify image has alt text (accessibility requirement)
    const altText = profileImage.getAttribute('alt');
    expect(altText).toBeTruthy();
    expect(altText.trim()).not.toBe('');
  });

  it('should contain biographical text', () => {
    const aboutSection = document.getElementById('about');
    const aboutText = aboutSection.querySelector('.about-text');
    
    expect(aboutText).toBeTruthy();
    
    // Verify there is text content
    expect(aboutText.textContent.trim()).not.toBe('');
    
    // Verify there are paragraph elements with content
    const paragraphs = aboutText.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThan(0);
    
    paragraphs.forEach(p => {
      expect(p.textContent.trim()).not.toBe('');
    });
  });

  it('should have both profile image and text within the about section', () => {
    const aboutSection = document.getElementById('about');
    
    // Verify about-content container exists
    const aboutContent = aboutSection.querySelector('.about-content');
    expect(aboutContent).toBeTruthy();
    
    // Verify both image and text are within the about section
    const profileImage = aboutSection.querySelector('.profile-image');
    const aboutText = aboutSection.querySelector('.about-text');
    
    expect(profileImage).toBeTruthy();
    expect(aboutText).toBeTruthy();
    
    // Verify they are both children of the about section
    expect(aboutSection.contains(profileImage)).toBe(true);
    expect(aboutSection.contains(aboutText)).toBe(true);
  });

  it('should have a section title', () => {
    const aboutSection = document.getElementById('about');
    const sectionTitle = aboutSection.querySelector('.section-title');
    
    expect(sectionTitle).toBeTruthy();
    expect(sectionTitle.tagName.toLowerCase()).toBe('h2');
    expect(sectionTitle.textContent.trim()).not.toBe('');
  });
});
