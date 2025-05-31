// Visual Editor Main JavaScript
class VisualEditor {
    constructor() {
        this.previewFrame = document.getElementById('previewFrame');
        this.currentSettings = {};
        this.originalSettings = {};
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        // Wait for iframe to load
        this.previewFrame.addEventListener('load', () => {
            this.setupEditor();
        });

        // If already loaded
        if (this.previewFrame.contentDocument && this.previewFrame.contentDocument.readyState === 'complete') {
            this.setupEditor();
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEditor() {
        this.previewDocument = this.previewFrame.contentDocument;
        this.previewWindow = this.previewFrame.contentWindow;
        
        // Get current CSS variables
        this.loadCurrentSettings();
        
        // Initialize all controls
        this.initializeControls();
        
        this.isInitialized = true;
        console.log('Visual Editor initialized successfully');
    }

    loadCurrentSettings() {
        const documentElement = this.previewDocument.documentElement;
        const computedStyle = this.previewWindow.getComputedStyle(documentElement);
        
        // Load current CSS variables
        this.currentSettings = {
            // Colors
            primaryColor: this.getCSSVariable('--primary-color') || '#2B5A9C',
            secondaryColor: this.getCSSVariable('--secondary-color') || '#8FBC8F',
            accentColor: this.getCSSVariable('--accent-color') || '#D4A574',
            backgroundColor: this.getCSSVariable('--background-color') || '#FAFAFA',
            
            // Typography
            fontFamily: computedStyle.getPropertyValue('font-family') || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            
            // Layout
            containerWidth: 1200,
            sectionPadding: 80,
            cardBorderRadius: 15,
            buttonBorderRadius: 30,
            
            // Effects
            cardShadow: 20,
            hoverEffect: 5,
            animationsEnabled: true,
            
            // Background overlays
            heroOverlay: 0.3,
            advantagesOverlay: 0
        };

        // Store original settings for reset functionality
        this.originalSettings = { ...this.currentSettings };
    }

    getCSSVariable(variableName) {
        const style = this.previewWindow.getComputedStyle(this.previewDocument.documentElement);
        return style.getPropertyValue(variableName).trim();
    }

    setCSSVariable(variableName, value) {
        if (this.previewDocument) {
            this.previewDocument.documentElement.style.setProperty(variableName, value);
        }
    }

    initializeControls() {
        // Initialize enhanced control modules
        this.colorControl = new ColorControl(this);
        this.fontControl = new FontControl(this);
        this.spacingControl = new SpacingControl(this);
        this.effectsControl = new EffectsControl(this);
        this.themePresets = new ThemePresets(this);
        
        // Initialize all control modules
        this.colorControl.init();
        this.fontControl.init();
        this.spacingControl.init();
        this.effectsControl.init();
        this.themePresets.init();
        
        // Initialize background controls (still using basic implementation)
        this.initBackgroundControls();
        
        // Initialize device controls
        this.initDeviceControls();
    }

    initColorControls() {
        const colorInputs = [
            { id: 'primaryColor', variable: '--primary-color' },
            { id: 'secondaryColor', variable: '--secondary-color' },
            { id: 'accentColor', variable: '--accent-color' },
            { id: 'backgroundColor', variable: '--background-color' }
        ];

        colorInputs.forEach(({ id, variable }) => {
            const colorInput = document.getElementById(id);
            const textInput = document.getElementById(id + 'Text');
            
            if (colorInput && textInput) {
                // Set initial values
                const currentValue = this.currentSettings[id] || this.getCSSVariable(variable);
                colorInput.value = currentValue;
                textInput.value = currentValue;

                // Color picker change
                colorInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    textInput.value = value;
                    this.updateColor(variable, value);
                    this.currentSettings[id] = value;
                });

                // Text input change
                textInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (this.isValidColor(value)) {
                        colorInput.value = value;
                        this.updateColor(variable, value);
                        this.currentSettings[id] = value;
                    }
                });
            }
        });
    }

    initTypographyControls() {
        // Font family
        const fontFamilySelect = document.getElementById('fontFamily');
        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', (e) => {
                const value = e.target.value;
                this.setCSSVariable('--font-family', value);
                this.previewDocument.body.style.fontFamily = value;
                this.currentSettings.fontFamily = value;
                this.loadGoogleFont(value);
            });
        }

        // Font sizes with sliders
        const fontSizeControls = [
            { id: 'heroFontSize', selector: '.hero h1', property: 'fontSize', unit: 'rem' },
            { id: 'headingFontSize', selector: 'h2', property: 'fontSize', unit: 'rem' },
            { id: 'bodyFontSize', selector: 'body', property: 'fontSize', unit: 'rem' }
        ];

        fontSizeControls.forEach(({ id, selector, property, unit }) => {
            const slider = document.getElementById(id);
            const valueDisplay = slider?.nextElementSibling;
            
            if (slider && valueDisplay) {
                slider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    valueDisplay.textContent = `${value}${unit}`;
                    
                    // Apply to preview
                    const elements = this.previewDocument.querySelectorAll(selector);
                    elements.forEach(el => {
                        el.style[property] = `${value}${unit}`;
                    });
                    
                    this.currentSettings[id] = value;
                });
            }
        });
    }

    initLayoutControls() {
        const layoutControls = [
            { 
                id: 'containerWidth', 
                callback: (value) => {
                    const containers = this.previewDocument.querySelectorAll('.container');
                    containers.forEach(container => {
                        container.style.maxWidth = `${value}px`;
                    });
                },
                unit: 'px'
            },
            { 
                id: 'sectionPadding', 
                callback: (value) => {
                    const sections = this.previewDocument.querySelectorAll('.hero, .advantage, .programs, .registration');
                    sections.forEach(section => {
                        section.style.padding = `${value}px 0`;
                    });
                },
                unit: 'px'
            },
            { 
                id: 'cardBorderRadius', 
                callback: (value) => {
                    const cards = this.previewDocument.querySelectorAll('.advantage-card, .program-card, .registration-form');
                    cards.forEach(card => {
                        card.style.borderRadius = `${value}px`;
                    });
                },
                unit: 'px'
            },
            { 
                id: 'buttonBorderRadius', 
                callback: (value) => {
                    const buttons = this.previewDocument.querySelectorAll('.hero-cta, .program-cta, .submit-btn');
                    buttons.forEach(button => {
                        button.style.borderRadius = `${value}px`;
                    });
                },
                unit: 'px'
            }
        ];

        layoutControls.forEach(({ id, callback, unit }) => {
            const slider = document.getElementById(id);
            const valueDisplay = slider?.nextElementSibling;
            
            if (slider && valueDisplay) {
                slider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    valueDisplay.textContent = `${value}${unit}`;
                    callback(value);
                    this.currentSettings[id] = value;
                });
            }
        });
    }

    initEffectsControls() {
        // Card shadow
        const cardShadowSlider = document.getElementById('cardShadow');
        const cardShadowValue = cardShadowSlider?.nextElementSibling;
        
        if (cardShadowSlider && cardShadowValue) {
            cardShadowSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                cardShadowValue.textContent = `${value}px`;
                
                const cards = this.previewDocument.querySelectorAll('.advantage-card, .program-card');
                cards.forEach(card => {
                    card.style.boxShadow = `0 5px ${value}px rgba(212, 165, 116, 0.1)`;
                });
                
                this.currentSettings.cardShadow = value;
            });
        }

        // Hover effects
        const hoverEffectSlider = document.getElementById('hoverEffect');
        const hoverEffectValue = hoverEffectSlider?.nextElementSibling;
        
        if (hoverEffectSlider && hoverEffectValue) {
            hoverEffectSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                hoverEffectValue.textContent = `${value}px`;
                
                // Update hover transform values
                this.updateHoverEffects(value);
                this.currentSettings.hoverEffect = value;
            });
        }

        // Animations toggle
        const animationsCheckbox = document.getElementById('animationsEnabled');
        if (animationsCheckbox) {
            animationsCheckbox.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                this.toggleAnimations(enabled);
                this.currentSettings.animationsEnabled = enabled;
            });
        }
    }

    initBackgroundControls() {
        // Hero overlay
        const heroOverlaySlider = document.getElementById('heroOverlay');
        const heroOverlayValue = heroOverlaySlider?.nextElementSibling;
        
        if (heroOverlaySlider && heroOverlayValue) {
            heroOverlaySlider.addEventListener('input', (e) => {
                const value = e.target.value;
                heroOverlayValue.textContent = value;
                this.setCSSVariable('--hero-overlay-opacity', value);
                this.currentSettings.heroOverlay = value;
            });
        }

        // Advantages overlay
        const advantagesOverlaySlider = document.getElementById('advantagesOverlay');
        const advantagesOverlayValue = advantagesOverlaySlider?.nextElementSibling;
        
        if (advantagesOverlaySlider && advantagesOverlayValue) {
            advantagesOverlaySlider.addEventListener('input', (e) => {
                const value = e.target.value;
                advantagesOverlayValue.textContent = value;
                this.setCSSVariable('--advantages-overlay-opacity', value);
                this.currentSettings.advantagesOverlay = value;
            });
        }
    }

    initThemeControls() {
        const themeCards = document.querySelectorAll('.theme-card');
        themeCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                themeCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                card.classList.add('active');
                
                const theme = card.dataset.theme;
                this.applyTheme(theme);
            });
        });
    }

    initDeviceControls() {
        const deviceButtons = document.querySelectorAll('.device-btn');
        deviceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                deviceButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const device = btn.dataset.device;
                this.switchDevice(device);
            });
        });
    }

    setupEventListeners() {
        // Save button
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveChanges());
        }

        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetToOriginal());
        }
    }

    updateColor(variable, value) {
        this.setCSSVariable(variable, value);
        
        // Update related colors if needed
        if (variable === '--primary-color') {
            // Update lighter versions
            const lightVersion = this.lightenColor(value, 20);
            this.setCSSVariable('--primary-light', lightVersion);
        }
    }

    isValidColor(color) {
        const style = new Option().style;
        style.color = color;
        return style.color !== '';
    }

    lightenColor(color, percent) {
        const amount = Math.round(2.55 * percent);
        const R = parseInt(color.substring(1, 3), 16);
        const G = parseInt(color.substring(3, 5), 16);
        const B = parseInt(color.substring(5, 7), 16);
        
        return `#${(0x1000000 + (Math.round((255 - R) * percent / 100) + R) * 0x10000 + 
            (Math.round((255 - G) * percent / 100) + G) * 0x100 + 
            (Math.round((255 - B) * percent / 100) + B)).toString(16).slice(1)}`;
    }

    loadGoogleFont(fontFamily) {
        // Extract font name for Google Fonts
        const fontName = fontFamily.replace(/['",]/g, '').split(',')[0].trim();
        
        if (fontName && !fontFamily.includes('Segoe UI')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
            
            // Add to both editor and preview
            document.head.appendChild(link);
            
            if (this.previewDocument) {
                const previewLink = link.cloneNode();
                this.previewDocument.head.appendChild(previewLink);
            }
        }
    }

    updateHoverEffects(value) {
        // Create dynamic CSS for hover effects
        const style = this.previewDocument.getElementById('dynamic-hover-styles') || 
                      this.previewDocument.createElement('style');
        style.id = 'dynamic-hover-styles';
        
        style.textContent = `
            .advantage-card:hover, .program-card:hover {
                transform: translateY(-${value}px) !important;
            }
            .hero-cta:hover, .program-cta:hover, .submit-btn:hover {
                transform: translateY(-${Math.ceil(value/2)}px) !important;
            }
        `;
        
        if (!this.previewDocument.getElementById('dynamic-hover-styles')) {
            this.previewDocument.head.appendChild(style);
        }
    }

    toggleAnimations(enabled) {
        const style = this.previewDocument.getElementById('animation-toggle') || 
                      this.previewDocument.createElement('style');
        style.id = 'animation-toggle';
        
        if (!enabled) {
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0s !important;
                    transition-duration: 0s !important;
                }
            `;
        } else {
            style.textContent = '';
        }
        
        if (!this.previewDocument.getElementById('animation-toggle')) {
            this.previewDocument.head.appendChild(style);
        }
    }

    applyTheme(themeName) {
        const themes = {
            professional: {
                primaryColor: '#2B5A9C',
                secondaryColor: '#8FBC8F',
                accentColor: '#D4A574',
                backgroundColor: '#FAFAFA'
            },
            warm: {
                primaryColor: '#E67E22',
                secondaryColor: '#F39C12',
                accentColor: '#E74C3C',
                backgroundColor: '#FDF6E3'
            },
            modern: {
                primaryColor: '#2C3E50',
                secondaryColor: '#34495E',
                accentColor: '#95A5A6',
                backgroundColor: '#FFFFFF'
            },
            vibrant: {
                primaryColor: '#9B59B6',
                secondaryColor: '#3498DB',
                accentColor: '#1ABC9C',
                backgroundColor: '#F8F9FA'
            }
        };

        const theme = themes[themeName];
        if (theme) {
            // Update colors
            Object.entries(theme).forEach(([key, value]) => {
                const variable = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                this.setCSSVariable(variable, value);
                this.currentSettings[key] = value;
                
                // Update UI controls
                const colorInput = document.getElementById(key);
                const textInput = document.getElementById(key + 'Text');
                if (colorInput) colorInput.value = value;
                if (textInput) textInput.value = value;
            });
        }
    }

    switchDevice(device) {
        const frame = this.previewFrame;
        
        // Remove existing device classes
        frame.classList.remove('tablet', 'mobile');
        
        if (device === 'tablet') {
            frame.classList.add('tablet');
        } else if (device === 'mobile') {
            frame.classList.add('mobile');
        }
        // desktop is default (no class needed)
    }

    async saveChanges() {
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.classList.add('saving');
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        try {
            // Here you would typically send the settings to a backend
            // For now, we'll save to localStorage and show success
            localStorage.setItem('elevate-design-settings', JSON.stringify(this.currentSettings));
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showNotification('Changes saved successfully!', 'success');
            
        } catch (error) {
            console.error('Save failed:', error);
            this.showNotification('Failed to save changes. Please try again.', 'error');
        } finally {
            saveBtn.classList.remove('saving');
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        }
    }

    resetToOriginal() {
        if (confirm('Are you sure you want to reset all changes? This cannot be undone.')) {
            // Reset all settings to original values
            Object.entries(this.originalSettings).forEach(([key, value]) => {
                this.currentSettings[key] = value;
                
                // Update UI controls
                const input = document.getElementById(key);
                if (input) {
                    input.value = value;
                    
                    // Trigger change event to update preview
                    input.dispatchEvent(new Event('input'));
                }
            });
            
            // Reset theme selection
            document.querySelectorAll('.theme-card').forEach(card => {
                card.classList.remove('active');
                if (card.dataset.theme === 'professional') {
                    card.classList.add('active');
                }
            });
            
            this.showNotification('Settings reset to original values', 'success');
        }
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        document.querySelector('.controls-content').prepend(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the visual editor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VisualEditor();
});
