// Form validation functionality

/**
 * Validates email format using regex
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates that a field is not empty (after trimming whitespace)
 * @param {string} value - The field value to validate
 * @returns {boolean} - True if field has content, false otherwise
 */
function validateRequired(value) {
    return value.trim().length > 0;
}

/**
 * Shows error message for a form field
 * @param {HTMLElement} formGroup - The form group element
 * @param {string} message - The error message to display
 */
function showError(formGroup, message) {
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clears error message for a form field
 * @param {HTMLElement} formGroup - The form group element
 */
function clearError(formGroup) {
    formGroup.classList.remove('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Validates a single form field
 * @param {HTMLElement} field - The input field to validate
 * @returns {boolean} - True if field is valid, false otherwise
 */
function validateField(field) {
    const formGroup = field.closest('.form-group');
    const value = field.value;
    const fieldName = field.name;
    
    // Clear previous error
    clearError(formGroup);
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !validateRequired(value)) {
        showError(formGroup, 'This field is required');
        return false;
    }
    
    // Validate email field
    if (field.type === 'email' && value.trim().length > 0 && !validateEmail(value)) {
        showError(formGroup, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

/**
 * Validates all form fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - True if all fields are valid, false otherwise
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required], input[type="email"]');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        return;
    }
    
    // Add blur event listeners to all form fields for real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear error when user starts typing
        field.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup.classList.contains('error')) {
                clearError(formGroup);
            }
        });
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate all fields
        if (validateForm(this)) {
            // Form is valid - in a real application, this would submit the data
            alert('Form submitted successfully! (This is a demo - no data was actually sent)');
            
            // Reset form
            this.reset();
            
            // Clear any remaining error states
            const formGroups = this.querySelectorAll('.form-group');
            formGroups.forEach(group => clearError(group));
        } else {
            // Form is invalid - errors are already displayed by validateForm
            console.log('Form validation failed');
        }
    });
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validateRequired,
        validateField,
        validateForm,
        showError,
        clearError
    };
}
