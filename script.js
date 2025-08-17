// CHANGE: You can modify these configurations and add your own functionality

/* Configuration Object - CHANGE: Update these settings as needed */
const config = {
    // Animation Settings
    animationDelay: 100,
    skillBarAnimationDuration: 1500,
    
    // Form Settings - CHANGE: Update with your form handling service
    formSubmitURL: '', // Add your form submission endpoint here
    
    // Scroll Settings
    backToTopOffset: 300,
    navbarScrollOffset: 50,
    
    // Typing Animation Settings (for hero section)
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseDuration: 2000
};

/* DOM Elements */
const elements = {
    navbar: document.getElementById('navbar'),
    navToggle: document.getElementById('mobile-menu'),
    navMenu: document.getElementById('nav-menu'),
    backToTopBtn: document.getElementById('back-to-top'),
    contactForm: document.getElementById('contact-form'),
    skillBars: document.querySelectorAll('.skill-progress'),
    fadeInElements: document.querySelectorAll('.fade-in')
};

/* Initialize App */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeSkillBars();
    
    // CHANGE: Add any additional initialization functions here
    // initializeTypingAnimation(); // Uncomment if you want typing animation
});

/* Navigation Functions */
function initializeNavigation() {
    // Mobile menu toggle
    if (elements.navToggle && elements.navMenu) {
        elements.navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = elements.navMenu?.querySelectorAll('.nav-link');
    mobileNavLinks?.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    elements.navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    elements.navMenu.classList.remove('active');
    elements.navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

function handleNavClick(e) {
    const href = e.target.getAttribute('href');
    
    if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 150; // Offset for better UX
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* Scroll Effects */
function initializeScrollEffects() {
    window.addEventListener('scroll', handleScroll);
}

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Navbar background change
    if (elements.navbar) {
        if (scrollTop > config.navbarScrollOffset) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    }
    
    // Back to top button visibility
    if (elements.backToTopBtn) {
        if (scrollTop > config.backToTopOffset) {
            elements.backToTopBtn.classList.add('show');
        } else {
            elements.backToTopBtn.classList.remove('show');
        }
    }
    
    // Trigger animations for elements in viewport
    triggerScrollAnimations();
}

// Back to top button functionality
if (elements.backToTopBtn) {
    elements.backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* Animation Functions */
function initializeAnimations() {
    // Add fade-in class to elements that should animate
    const animatableElements = document.querySelectorAll(
        '.skill-card, .project-card, .contact-item, .about-text, .skills-bars'
    );
    
    animatableElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Initial check for elements in viewport
    setTimeout(triggerScrollAnimations, 100);
}

function triggerScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in:not(.animate)');
    
    fadeElements.forEach(element => {
        if (isElementInViewport(element)) {
            setTimeout(() => {
                element.classList.add('animate');
            }, Math.random() * config.animationDelay);
        }
    });
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
        rect.top <= windowHeight * 0.8 && // Trigger when element is 80% in view
        rect.bottom >= 0
    );
}

/* Skill Bars Animation */
function initializeSkillBars() {
    const skillSection = document.getElementById('about');
    let skillsAnimated = false;
    
    window.addEventListener('scroll', () => {
        if (!skillsAnimated && isElementInViewport(skillSection)) {
            animateSkillBars();
            skillsAnimated = true;
        }
    });
}

function animateSkillBars() {
    elements.skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        
        setTimeout(() => {
            bar.style.width = width;
            
            // Add percentage text animation
            const skillItem = bar.closest('.skill-item');
            const skillName = skillItem.querySelector('.skill-name');
            const percentage = document.createElement('span');
            percentage.textContent = width;
            percentage.style.fontWeight = '600';
            percentage.style.color = 'var(--primary-color)';
            skillName.appendChild(percentage);
            
        }, index * 200); // Stagger animation
    });
}

/* Contact Form Handling */
function initializeContactForm() {
    if (!elements.contactForm) return;
    
    elements.contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const formInputs = elements.contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.contactForm);
    const formObject = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Validate form
    if (!validateForm(formObject)) {
        return;
    }
    
    // Show loading state
    const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // CHANGE: Replace this with your actual form submission logic
        await simulateFormSubmission(formObject);
        
        showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        elements.contactForm.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// CHANGE: Replace this function with your actual form submission logic
async function simulateFormSubmission(formData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // CHANGE: Implement your form submission here
    // Examples:
    // - Send to your backend API
    // - Use services like EmailJS, Formspree, or Netlify Forms
    // - Integrate with your preferred form handling service
    
    console.log('Form data:', formData);
    
    // For now, just log the data (replace with actual submission)
    return Promise.resolve();
}

function validateForm(formData) {
    const errors = {};
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Subject validation
    if (!formData.subject || formData.subject.trim().length < 3) {
        errors.subject = 'Subject must be at least 3 characters long';
    }
    
    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
    }
    
    // Display errors
    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return false;
    }
    
    return true;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let error = '';
    
    switch (field.name) {
        case 'name':
            if (value.length < 2) error = 'Name must be at least 2 characters long';
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) error = 'Please enter a valid email address';
            break;
        case 'subject':
            if (value.length < 3) error = 'Subject must be at least 3 characters long';
            break;
        case 'message':
            if (value.length < 10) error = 'Message must be at least 10 characters long';
            break;
    }
    
    displayFieldError(field, error);
}

function clearErrors(e) {
    const field = e.target;
    displayFieldError(field, '');
}

function displayFormErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
        const field = elements.contactForm.querySelector(`[name="${fieldName}"]`);
        displayFieldError(field, errors[fieldName]);
    });
}

function displayFieldError(field, error) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error if exists
    if (error) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = error;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '0.5rem';
        field.parentNode.appendChild(errorElement);
        
        field.style.borderColor = '#e74c3c';
    } else {
        field.style.borderColor = '#e0e0e0';
    }
}

function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = elements.contactForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Style the message
    messageElement.style.padding = '1rem';
    messageElement.style.borderRadius = '5px';
    messageElement.style.marginTop = '1rem';
    messageElement.style.textAlign = 'center';
    
    if (type === 'success') {
        messageElement.style.backgroundColor = '#d4edda';
        messageElement.style.color = '#155724';
        messageElement.style.border = '1px solid #c3e6cb';
    } else {
        messageElement.style.backgroundColor = '#f8d7da';
        messageElement.style.color = '#721c24';
        messageElement.style.border = '1px solid #f5c6cb';
    }
    
    elements.contactForm.appendChild(messageElement);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

/* Optional: Typing Animation for Hero Section */
// CHANGE: Uncomment and modify this if you want a typing effect in the hero section
/*
function initializeTypingAnimation() {
    const heroTitle = document.querySelector('.hero-content h2');
    if (!heroTitle) return;
    
    const titles = [
        'Full Stack Developer',
        'UI/UX Designer',
        'Problem Solver',
        'Creative Thinker'
    ];
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            heroTitle.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            heroTitle.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? config.deletingSpeed : config.typingSpeed;
        
        if (!isDeleting && charIndex === currentTitle.length) {
            typeSpeed = config.pauseDuration;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
}
*/

/* Utility Functions */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimize scroll event handlers
window.addEventListener('scroll', throttle(handleScroll, 16));

/* Performance Optimization */
// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
}

/* CHANGE INSTRUCTIONS:

1. FORM SUBMISSION:
   - Update the simulateFormSubmission function with your actual form handling
   - Popular services: EmailJS, Formspree, Netlify Forms, or your own backend API
   - Update the config.formSubmitURL with your endpoint

2. TYPING ANIMATION:
   - Uncomment the initializeTypingAnimation function and add it to DOMContentLoaded
   - Modify the titles array with your own titles/roles

3. ADDITIONAL FEATURES:
   - Add more animation effects by modifying the triggerScrollAnimations function
   - Customize validation rules in the validateForm function
   - Add more interactive features in the initialization functions

4. PERFORMANCE:
   - Adjust throttle/debounce timings based on your needs
   - Add more lazy loading for other elements if needed

5. ANALYTICS:
   - Add Google Analytics, Facebook Pixel, or other tracking codes
   - Track form submissions, scroll depth, etc.

6. SOCIAL MEDIA:
   - Add share buttons functionality
   - Integrate with social media APIs for dynamic content

*/
