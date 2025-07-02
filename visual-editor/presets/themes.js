// Theme Presets for Visual Editor
class ThemePresets {
    constructor(editor) {
        this.editor = editor;
        this.themes = {
            professional: {
                name: 'Professional',
                description: 'Clean and corporate design',
                colors: {
                    primaryColor: '#2B5A9C',
                    secondaryColor: '#8FBC8F',
                    accentColor: '#D4A574',
                    backgroundColor: '#FAFAFA'
                },
                typography: {
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    heroFontSize: 3.2,
                    headingFontSize: 2.5,
                    bodyFontSize: 1
                },
                layout: {
                    containerWidth: 1200,
                    sectionPadding: 80,
                    cardBorderRadius: 15,
                    buttonBorderRadius: 30
                },
                effects: {
                    cardShadow: 20,
                    hoverEffect: 5,
                    animationsEnabled: true
                }
            },
            warm: {
                name: 'Warm & Inviting',
                description: 'Friendly and approachable design',
                colors: {
                    primaryColor: '#E67E22',
                    secondaryColor: '#F39C12',
                    accentColor: '#E74C3C',
                    backgroundColor: '#FDF6E3'
                },
                typography: {
                    fontFamily: "'Poppins', sans-serif",
                    heroFontSize: 3.0,
                    headingFontSize: 2.3,
                    bodyFontSize: 1.05
                },
                layout: {
                    containerWidth: 1150,
                    sectionPadding: 90,
                    cardBorderRadius: 20,
                    buttonBorderRadius: 35
                },
                effects: {
                    cardShadow: 25,
                    hoverEffect: 7,
                    animationsEnabled: true
                }
            },
            modern: {
                name: 'Modern Minimal',
                description: 'Clean and minimalist design',
                colors: {
                    primaryColor: '#2C3E50',
                    secondaryColor: '#34495E',
                    accentColor: '#95A5A6',
                    backgroundColor: '#FFFFFF'
                },
                typography: {
                    fontFamily: "'Inter', sans-serif",
                    heroFontSize: 3.5,
                    headingFontSize: 2.8,
                    bodyFontSize: 0.95
                },
                layout: {
                    containerWidth: 1100,
                    sectionPadding: 70,
                    cardBorderRadius: 8,
                    buttonBorderRadius: 6
                },
                effects: {
                    cardShadow: 15,
                    hoverEffect: 3,
                    animationsEnabled: true
                }
            },
            vibrant: {
                name: 'Vibrant & Energetic',
                description: 'Bold and colorful design',
                colors: {
                    primaryColor: '#9B59B6',
                    secondaryColor: '#3498DB',
                    accentColor: '#1ABC9C',
                    backgroundColor: '#F8F9FA'
                },
                typography: {
                    fontFamily: "'Montserrat', sans-serif",
                    heroFontSize: 3.8,
                    headingFontSize: 2.7,
                    bodyFontSize: 1.1
                },
                layout: {
                    containerWidth: 1300,
                    sectionPadding: 100,
                    cardBorderRadius: 25,
                    buttonBorderRadius: 40
                },
                effects: {
                    cardShadow: 30,
                    hoverEffect: 8,
                    animationsEnabled: true
                }
            },
            elegant: {
                name: 'Elegant & Refined',
                description: 'Sophisticated and luxurious design',
                colors: {
                    primaryColor: '#2C2C54',
                    secondaryColor: '#40407A',
                    accentColor: '#B8860B',
                    backgroundColor: '#FFFEF7'
                },
                typography: {
                    fontFamily: "'Playfair Display', serif",
                    heroFontSize: 3.6,
                    headingFontSize: 2.9,
                    bodyFontSize: 1.05
                },
                layout: {
                    containerWidth: 1150,
                    sectionPadding: 85,
                    cardBorderRadius: 12,
                    buttonBorderRadius: 25
                },
                effects: {
                    cardShadow: 18,
                    hoverEffect: 4,
                    animationsEnabled: true
                }
            }
        };
    }

    init() {
        this.setupThemeCards();
        this.addThemeCustomization();
    }

    setupThemeCards() {
        const themeCards = document.querySelectorAll('.theme-card');
        themeCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.selectTheme(card);
                const themeName = card.dataset.theme;
                this.applyTheme(themeName);
            });

            // Add hover preview
            card.addEventListener('mouseenter', () => {
                this.showThemePreview(card.dataset.theme);
            });

            card.addEventListener('mouseleave', () => {
                this.hideThemePreview();
            });
        });
    }

    selectTheme(selectedCard) {
        // Remove active class from all cards
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to selected card
        selectedCard.classList.add('active');
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        // Show loading state
        this.showApplyingState();

        // Apply colors
        this.applyColors(theme.colors);
        
        // Apply typography
        this.applyTypography(theme.typography);
        
        // Apply layout
        this.applyLayout(theme.layout);
        
        // Apply effects
        this.applyEffects(theme.effects);

        // Update current settings
        this.updateCurrentSettings(theme);

        // Hide loading state
        this.hideApplyingState();

        // Show success notification
        this.editor.showNotification(`Applied ${theme.name} theme successfully!`, 'success');
    }

    applyColors(colors) {
        Object.entries(colors).forEach(([colorKey, colorValue]) => {
            const colorInput = document.getElementById(colorKey);
            const textInput = document.getElementById(colorKey + 'Text');
            
            if (colorInput && textInput) {
                colorInput.value = colorValue;
                textInput.value = colorValue;
                
                // Trigger change event
                colorInput.dispatchEvent(new Event('input'));
            }
        });
    }

    applyTypography(typography) {
        Object.entries(typography).forEach(([key, value]) => {
            const control = document.getElementById(key);
            if (control) {
                control.value = value;
                // Trigger change event
                control.dispatchEvent(new Event(control.tagName === 'SELECT' ? 'change' : 'input'));
            }
        });
    }

    applyLayout(layout) {
        Object.entries(layout).forEach(([key, value]) => {
            const slider = document.getElementById(key);
            const valueDisplay = slider?.nextElementSibling;
            
            if (slider && valueDisplay) {
                slider.value = value;
                // Update display and trigger change
                slider.dispatchEvent(new Event('input'));
            }
        });
    }

    applyEffects(effects) {
        Object.entries(effects).forEach(([key, value]) => {
            const control = document.getElementById(key);
            if (control) {
                if (control.type === 'checkbox') {
                    control.checked = value;
                    control.dispatchEvent(new Event('change'));
                } else {
                    control.value = value;
                    control.dispatchEvent(new Event('input'));
                }
            }
        });
    }

    updateCurrentSettings(theme) {
        // Update editor's current settings with theme values
        Object.assign(this.editor.currentSettings, {
            ...theme.colors,
            ...theme.typography,
            ...theme.layout,
            ...theme.effects,
            currentTheme: theme.name
        });
    }

    showThemePreview(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        // Create preview tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'theme-tooltip';
        tooltip.innerHTML = `
            <div class="theme-tooltip-header">
                <h4>${theme.name}</h4>
                <p>${theme.description}</p>
            </div>
            <div class="theme-tooltip-preview">
                <div class="preview-colors">
                    ${Object.entries(theme.colors).map(([key, value]) => `
                        <div class="preview-color" style="background: ${value}" title="${key}"></div>
                    `).join('')}
                </div>
                <div class="preview-text" style="font-family: ${theme.typography.fontFamily}; color: ${theme.colors.primaryColor}">
                    Sample Text
                </div>
            </div>
        `;

        document.body.appendChild(tooltip);

        // Position tooltip
        this.positionTooltip(tooltip);
    }

    positionTooltip(tooltip) {
        const rect = event.target.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top}px`;
        tooltip.style.zIndex = '10000';
    }

    hideThemePreview() {
        const tooltip = document.querySelector('.theme-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    addThemeCustomization() {
        const themesSection = document.querySelector('.control-section:has(.theme-grid)');
        if (themesSection && !themesSection.querySelector('.theme-customization')) {
            const customizationHTML = `
                <div class="theme-customization">
                    <h4>Theme Customization</h4>
                    <div class="control-group">
                        <button class="btn-secondary" id="saveAsTheme">
                            <i class="fas fa-plus"></i> Save Current as Theme
                        </button>
                    </div>
                    <div class="control-group">
                        <button class="btn-secondary" id="exportTheme">
                            <i class="fas fa-download"></i> Export Theme
                        </button>
                    </div>
                    <div class="control-group">
                        <input type="file" id="importTheme" accept=".json" style="display: none;">
                        <button class="btn-secondary" id="importThemeBtn">
                            <i class="fas fa-upload"></i> Import Theme
                        </button>
                    </div>
                </div>
            `;
            
            themesSection.insertAdjacentHTML('beforeend', customizationHTML);
            this.setupThemeCustomizationControls();
        }
    }

    setupThemeCustomizationControls() {
        // Save current settings as theme
        document.getElementById('saveAsTheme')?.addEventListener('click', () => {
            this.saveCurrentAsTheme();
        });

        // Export theme
        document.getElementById('exportTheme')?.addEventListener('click', () => {
            this.exportCurrentTheme();
        });

        // Import theme
        document.getElementById('importThemeBtn')?.addEventListener('click', () => {
            document.getElementById('importTheme').click();
        });

        document.getElementById('importTheme')?.addEventListener('change', (e) => {
            this.importTheme(e.target.files[0]);
        });
    }

    saveCurrentAsTheme() {
        const themeName = prompt('Enter a name for your custom theme:');
        if (themeName) {
            const customTheme = {
                name: themeName,
                description: 'Custom theme',
                colors: {
                    primaryColor: this.editor.currentSettings.primaryColor,
                    secondaryColor: this.editor.currentSettings.secondaryColor,
                    accentColor: this.editor.currentSettings.accentColor,
                    backgroundColor: this.editor.currentSettings.backgroundColor
                },
                typography: {
                    fontFamily: this.editor.currentSettings.fontFamily,
                    heroFontSize: this.editor.currentSettings.heroFontSize,
                    headingFontSize: this.editor.currentSettings.headingFontSize,
                    bodyFontSize: this.editor.currentSettings.bodyFontSize
                },
                layout: {
                    containerWidth: this.editor.currentSettings.containerWidth,
                    sectionPadding: this.editor.currentSettings.sectionPadding,
                    cardBorderRadius: this.editor.currentSettings.cardBorderRadius,
                    buttonBorderRadius: this.editor.currentSettings.buttonBorderRadius
                },
                effects: {
                    cardShadow: this.editor.currentSettings.cardShadow,
                    hoverEffect: this.editor.currentSettings.hoverEffect,
                    animationsEnabled: this.editor.currentSettings.animationsEnabled
                }
            };

            // Save to localStorage
            const savedThemes = JSON.parse(localStorage.getItem('elevate-custom-themes') || '{}');
            savedThemes[themeName.toLowerCase().replace(/\s+/g, '-')] = customTheme;
            localStorage.setItem('elevate-custom-themes', JSON.stringify(savedThemes));

            this.editor.showNotification(`Theme "${themeName}" saved successfully!`, 'success');
        }
    }

    exportCurrentTheme() {
        const themeData = {
            name: this.editor.currentSettings.currentTheme || 'Custom Theme',
            settings: this.editor.currentSettings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `elevate-theme-${themeData.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.editor.showNotification('Theme exported successfully!', 'success');
    }

    importTheme(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const themeData = JSON.parse(e.target.result);
                
                if (themeData.settings) {
                    // Apply imported theme
                    Object.entries(themeData.settings).forEach(([key, value]) => {
                        const control = document.getElementById(key);
                        if (control) {
                            if (control.type === 'checkbox') {
                                control.checked = value;
                                control.dispatchEvent(new Event('change'));
                            } else {
                                control.value = value;
                                control.dispatchEvent(new Event(control.tagName === 'SELECT' ? 'change' : 'input'));
                            }
                        }
                    });

                    this.editor.showNotification(`Theme "${themeData.name}" imported successfully!`, 'success');
                } else {
                    throw new Error('Invalid theme file format');
                }
            } catch (error) {
                this.editor.showNotification('Failed to import theme. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    showApplyingState() {
        document.querySelectorAll('.theme-card').forEach(card => {
            card.style.pointerEvents = 'none';
            card.style.opacity = '0.6';
        });
    }

    hideApplyingState() {
        document.querySelectorAll('.theme-card').forEach(card => {
            card.style.pointerEvents = '';
            card.style.opacity = '';
        });
    }

    getCurrentTheme() {
        // Find which theme matches current settings most closely
        let bestMatch = 'professional';
        let bestScore = 0;

        Object.entries(this.themes).forEach(([themeName, theme]) => {
            let score = 0;
            
            // Check color matches
            Object.entries(theme.colors).forEach(([key, value]) => {
                if (this.editor.currentSettings[key] === value) score++;
            });

            if (score > bestScore) {
                bestScore = score;
                bestMatch = themeName;
            }
        });

        return bestMatch;
    }
}

window.ThemePresets = ThemePresets;
