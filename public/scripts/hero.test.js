// Unit test for hero section presence
// Validates: Requirements 1.1

import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Hero Section Presence', () => {
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

  it('should have a hero section with id "home"', () => {
    const heroSection = document.getElementById('home');
    expect(heroSection).toBeTruthy();
    expect(heroSection.tagName.toLowerCase()).toBe('section');
    expect(heroSection.classList.contains('hero')).toBe(true);
  });

  it('should have a hero title element', () => {
    const heroTitle = document.querySelector('.hero-title');
    expect(heroTitle).toBeTruthy();
    expect(heroTitle.tagName.toLowerCase()).toBe('h1');
    expect(heroTitle.textContent.trim()).not.toBe('');
  });

  it('should have a hero subtitle element', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    expect(heroSubtitle).toBeTruthy();
    expect(heroSubtitle.tagName.toLowerCase()).toBe('p');
    expect(heroSubtitle.textContent.trim()).not.toBe('');
  });

  it('should have a CTA button', () => {
    const ctaButton = document.querySelector('.cta-button');
    expect(ctaButton).toBeTruthy();
    expect(ctaButton.tagName.toLowerCase()).toBe('a');
    expect(ctaButton.getAttribute('href')).toBeTruthy();
  });

  it('should have all required elements within the hero section', () => {
    const heroSection = document.getElementById('home');
    expect(heroSection).toBeTruthy();

    // Verify hero content container exists
    const heroContent = heroSection.querySelector('.hero-content');
    expect(heroContent).toBeTruthy();

    // Verify all required elements are within the hero section
    const titleInHero = heroSection.querySelector('.hero-title');
    const subtitleInHero = heroSection.querySelector('.hero-subtitle');
    const ctaInHero = heroSection.querySelector('.cta-button');

    expect(titleInHero).toBeTruthy();
    expect(subtitleInHero).toBeTruthy();
    expect(ctaInHero).toBeTruthy();
  });
});
