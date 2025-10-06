// Navigation active state tracking and mobile menu
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    initThemeToggle();
    
    // Navigation highlighting
    initNavigation();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Copy portfolio expand/collapse
    initCopyPortfolio();
});

/**
 * Initialize theme toggle with localStorage persistence and accessibility
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const srText = themeToggle.querySelector('.sr-only');
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
        updateThemeToggleState(savedTheme, themeToggle, srText);
    } else if (prefersDark) {
        root.setAttribute('data-theme', 'dark');
        updateThemeToggleState('dark', themeToggle, srText);
    }
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleState(newTheme, themeToggle, srText);
    });
    
    // Keyboard accessibility for theme toggle
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });
}

/**
 * Update theme toggle button state and accessibility attributes
 */
function updateThemeToggleState(theme, button, srText) {
    const isDark = theme === 'dark';
    button.setAttribute('aria-pressed', isDark);
    srText.textContent = isDark ? 'Switch to light theme' : 'Switch to dark theme';
}

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
    });
    
    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
            menuToggle.focus();
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mainNav.classList.contains('active') && 
            !mainNav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
        }
    });
}

/**
 * Initialize navigation highlighting based on scroll position
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');
    
    // Highlight navigation on scroll
    function highlightNavigation() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        // Update active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 90;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Listen for scroll events with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                highlightNavigation();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial highlight
    highlightNavigation();
}

/**
 * Initialize copy portfolio expand/collapse functionality
 */
function initCopyPortfolio() {
    const copyCards = document.querySelectorAll('.copy-card');
    
    copyCards.forEach(card => {
        const expandBtn = card.querySelector('.expand-btn');
        const copyContent = card.querySelector('.copy-content');
        
        if (expandBtn && copyContent) {
            expandBtn.addEventListener('click', function() {
                const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';
                
                // Toggle expanded state
                expandBtn.setAttribute('aria-expanded', !isExpanded);
                
                if (isExpanded) {
                    // Collapse
                    copyContent.setAttribute('hidden', '');
                    copyContent.setAttribute('aria-hidden', 'true');
                } else {
                    // Expand
                    copyContent.removeAttribute('hidden');
                    copyContent.setAttribute('aria-hidden', 'false');
                    
                    // Smooth scroll to card if it's partially off-screen
                    setTimeout(() => {
                        const cardRect = card.getBoundingClientRect();
                        if (cardRect.top < 100) {
                            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 100);
                }
            });
            
            // Keyboard accessibility
            expandBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    expandBtn.click();
                }
            });
        }
    });
}