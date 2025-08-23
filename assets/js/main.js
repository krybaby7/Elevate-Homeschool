// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    initializeMobileMenu();

    // Get all links that have href starting with #
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset to account for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dynamic Gradient Background System
    initializeDynamicGradient();
});

function initializeDynamicGradient() {
    // Brand color palette for gradient progression
    const colorStops = [
        { position: 0.0, colors: ['#FAFAFA', '#F5E6D3', '#E8E6E3'] }, // Light tones
        { position: 0.2, colors: ['#F5E6D3', '#E8A87C', '#D4A574'] }, // Warm beige to gold
        { position: 0.4, colors: ['#D4A574', '#8FBC8F', '#A8D8DC'] }, // Gold to sage to light blue
        { position: 0.6, colors: ['#8FBC8F', '#A8D8DC', '#7aa87a'] }, // Sage to light blue blend
        { position: 0.8, colors: ['#A8D8DC', '#5B8FB0', '#2B5A9C'] }, // Light blue to deeper blue
        { position: 1.0, colors: ['#5B8FB0', '#2B5A9C', '#1a4480'] }  // Deep blue tones
    ];

    let ticking = false;

    function updateGradient() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.max(0, Math.min(1, scrollTop / scrollHeight));

        // Find the two color stops to interpolate between
        let lowerStop = colorStops[0];
        let upperStop = colorStops[colorStops.length - 1];

        for (let i = 0; i < colorStops.length - 1; i++) {
            if (scrollPercent >= colorStops[i].position && scrollPercent <= colorStops[i + 1].position) {
                lowerStop = colorStops[i];
                upperStop = colorStops[i + 1];
                break;
            }
        }

        // Calculate interpolation factor between the two stops
        const range = upperStop.position - lowerStop.position;
        const factor = range === 0 ? 0 : (scrollPercent - lowerStop.position) / range;

        // Interpolate between the three gradient colors
        const interpolatedColors = [
            interpolateColor(lowerStop.colors[0], upperStop.colors[0], factor),
            interpolateColor(lowerStop.colors[1], upperStop.colors[1], factor),
            interpolateColor(lowerStop.colors[2], upperStop.colors[2], factor)
        ];

        // Update CSS custom properties
        document.documentElement.style.setProperty('--gradient-color-1', interpolatedColors[0]);
        document.documentElement.style.setProperty('--gradient-color-2', interpolatedColors[1]);
        document.documentElement.style.setProperty('--gradient-color-3', interpolatedColors[2]);

        ticking = false;
    }

    function interpolateColor(color1, color2, factor) {
        // Convert hex to RGB
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);

        // Interpolate each channel
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

        // Convert back to hex
        return rgbToHex(r, g, b);
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateGradient);
            ticking = true;
        }
    }

    // Listen for scroll events with throttling
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial gradient update
    updateGradient();
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            // Toggle active class on button for animation
            mobileMenuBtn.classList.toggle('active');
            
            // Toggle active class on nav links to show/hide menu
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on navigation links
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                // Close the mobile menu
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnButton = mobileMenuBtn.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnButton && navLinks.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close mobile menu on window resize if screen becomes large
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}
