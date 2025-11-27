// Unit tests for form validation functions
// Requirements: 5.2, 5.3

import { describe, it, expect } from 'vitest';
import { validateEmail, validateRequired, validateForm, validateField } from './form-validation.js';
import * as fc from 'fast-check';

describe('Form Validation - validateEmail', () => {
  describe('Valid email addresses', () => {
    it('should accept standard email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should accept email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true);
    });

    it('should accept email with numbers', () => {
      expect(validateEmail('user123@example.com')).toBe(true);
    });

    it('should accept email with dots in local part', () => {
      expect(validateEmail('first.last@example.com')).toBe(true);
    });

    it('should accept email with hyphens', () => {
      expect(validateEmail('user-name@example-domain.com')).toBe(true);
    });

    it('should accept email with plus sign', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should accept email with underscore', () => {
      expect(validateEmail('user_name@example.com')).toBe(true);
    });
  });

  describe('Invalid email addresses', () => {
    it('should reject email without @ symbol', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('should reject email without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('should reject email without local part', () => {
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('should reject email without TLD', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    it('should reject email with spaces', () => {
      expect(validateEmail('user name@example.com')).toBe(false);
    });

    it('should reject email with multiple @ symbols', () => {
      expect(validateEmail('user@@example.com')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should reject email with only spaces', () => {
      expect(validateEmail('   ')).toBe(false);
    });

    it('should reject email starting with @', () => {
      expect(validateEmail('@user.example.com')).toBe(false);
    });

    it('should reject email ending with @', () => {
      expect(validateEmail('user.example.com@')).toBe(false);
    });
  });
});

describe('Form Validation - validateRequired', () => {
  describe('Valid required field values', () => {
    it('should accept non-empty string', () => {
      expect(validateRequired('Hello')).toBe(true);
    });

    it('should accept string with multiple words', () => {
      expect(validateRequired('Hello World')).toBe(true);
    });

    it('should accept string with numbers', () => {
      expect(validateRequired('Test123')).toBe(true);
    });

    it('should accept string with special characters', () => {
      expect(validateRequired('Hello! How are you?')).toBe(true);
    });

    it('should accept string with leading/trailing spaces after trim', () => {
      expect(validateRequired('  Hello  ')).toBe(true);
    });
  });

  describe('Invalid required field values', () => {
    it('should reject empty string', () => {
      expect(validateRequired('')).toBe(false);
    });

    it('should reject string with only spaces', () => {
      expect(validateRequired('   ')).toBe(false);
    });

    it('should reject string with only tabs', () => {
      expect(validateRequired('\t\t')).toBe(false);
    });

    it('should reject string with only newlines', () => {
      expect(validateRequired('\n\n')).toBe(false);
    });

    it('should reject string with mixed whitespace', () => {
      expect(validateRequired('  \t\n  ')).toBe(false);
    });
  });
});

// Feature: personal-website, Property 6: Form validation for valid data
// **Validates: Requirements 5.2**
describe('Property Test - Form validation for valid data', () => {
  it('should pass validation for any form with all required fields completed with valid data', () => {
    fc.assert(
      fc.property(
        // Generate valid name (non-empty string with at least one non-whitespace character)
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        // Generate valid email
        fc.emailAddress(),
        // Generate valid message (non-empty string with at least one non-whitespace character)
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        (name, email, message) => {
          // Create a mock form with valid data
          const mockForm = {
            querySelectorAll: () => {
              return [
                {
                  name: 'name',
                  value: name,
                  type: 'text',
                  hasAttribute: (attr) => attr === 'required',
                  closest: () => ({
                    classList: {
                      add: () => {},
                      remove: () => {}
                    },
                    querySelector: () => ({
                      textContent: ''
                    })
                  })
                },
                {
                  name: 'email',
                  value: email,
                  type: 'email',
                  hasAttribute: (attr) => attr === 'required',
                  closest: () => ({
                    classList: {
                      add: () => {},
                      remove: () => {}
                    },
                    querySelector: () => ({
                      textContent: ''
                    })
                  })
                },
                {
                  name: 'message',
                  value: message,
                  type: 'textarea',
                  hasAttribute: (attr) => attr === 'required',
                  closest: () => ({
                    classList: {
                      add: () => {},
                      remove: () => {}
                    },
                    querySelector: () => ({
                      textContent: ''
                    })
                  })
                }
              ];
            }
          };

          // Validate the form
          const result = validateForm(mockForm);

          // Property: For any valid form data, validation should pass
          expect(result).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: personal-website, Property 7: Email validation
// **Validates: Requirements 5.3**
describe('Property Test - Email validation', () => {
  it('should trigger error for any string that does not match valid email format', () => {
    fc.assert(
      fc.property(
        // Generate invalid email strings
        fc.oneof(
          // Strings without @ symbol
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('@')),
          // Strings with @ but no domain
          fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/@/g, '') + '@'),
          // Strings with @ but no local part
          fc.string({ minLength: 1, maxLength: 20 }).map(s => '@' + s.replace(/@/g, '')),
          // Strings with @ but no TLD (no dot after @)
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('@') && !s.includes('.')),
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('@') && !s.includes('.'))
          ).map(([local, domain]) => `${local}@${domain}`),
          // Strings with spaces
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 10 }),
            fc.string({ minLength: 1, maxLength: 10 })
          ).map(([part1, part2]) => `${part1} ${part2}@example.com`),
          // Multiple @ symbols
          fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/@/g, '') + '@@example.com'),
          // Empty string
          fc.constant(''),
          // Only whitespace
          fc.constant('   ')
        ),
        (invalidEmail) => {
          // Track if error was shown
          let errorShown = false;
          let errorMessage = '';

          // Create a mock email field with invalid data
          const mockField = {
            name: 'email',
            value: invalidEmail,
            type: 'email',
            hasAttribute: (attr) => attr === 'required',
            closest: () => ({
              classList: {
                add: (className) => {
                  if (className === 'error') {
                    errorShown = true;
                  }
                },
                remove: () => {}
              },
              querySelector: () => ({
                set textContent(msg) {
                  errorMessage = msg;
                }
              })
            })
          };

          // Validate the field (this should trigger an error for invalid emails)
          const result = validateField(mockField);

          // Property: For any invalid email string, validation should fail
          // and an error should be shown (unless the field is empty and not required)
          if (invalidEmail.trim().length > 0) {
            expect(result).toBe(false);
            expect(errorShown).toBe(true);
            expect(errorMessage).toBe('Please enter a valid email address');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
