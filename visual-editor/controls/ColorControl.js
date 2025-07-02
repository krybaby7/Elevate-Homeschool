// Color Control Module
class ColorControl {
    constructor(editor) {
        this.editor = editor;
        this.colorInputs = [
            { id: 'primaryColor', variable: '--primary-color', label: 'Primary Color' },
            { id: 'secondaryColor', variable: '--secondary-color', label: 'Secondary Color' },
            { id: 'accentColor', variable: '--accent-color', label: 'Accent Color' },
            { id: 'backgroundColor', variable: '--background-color', label: 'Background Color' }
        ];
    }

    init() {
        this.setupColorControls();
        this.setupColorPalettes();
    }

    setupColorControls() {
        this.colorInputs.forEach(({ id, variable, label }) => {
            const colorInput = document.getElementById(id);
            const textInput = document.getElementById(id + 'Text');
            
            if (colorInput && textInput) {
                // Set initial values
                const currentValue = this.editor.getCSSVariable(variable) || this.getDefaultColor(id);
                colorInput.value = currentValue;
                textInput.value = currentValue;

                // Color picker change
                colorInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    this.updateColor(id, variable, value, textInput);
                });

                // Text input change with validation
                textInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (this.isValidColor(value)) {
                        this.updateColor(id, variable, value, colorInput);
                        textInput.classList.remove('error');
                    } else {
                        textInput.classList.add('error');
                    }
                });

                // Add color harmony suggestions
                this.addColorHarmonyButton(colorInput, variable);
            }
        });
    }

    updateColor(id, variable, value, otherInput) {
        otherInput.value = value;
        this.editor.setCSSVariable(variable, value);
        this.editor.currentSettings[id] = value;
        
        // Update related color variations
        this.generateColorVariations(variable, value);
        
        // Trigger change event for other listeners
        this.dispatchColorChange(id, value);
    }

    generateColorVariations(baseVariable, baseColor) {
        // Generate lighter and darker variations
        const lighter = this.adjustBrightness(baseColor, 20);
        const darker = this.adjustBrightness(baseColor, -20);
        
        // Set variations as CSS variables
        this.editor.setCSSVariable(baseVariable + '-light', lighter);
        this.editor.setCSSVariable(baseVariable + '-dark', darker);
    }

    adjustBrightness(color, percent) {
        const R = parseInt(color.substring(1, 3), 16);
        const G = parseInt(color.substring(3, 5), 16);
        const B = parseInt(color.substring(5, 7), 16);
        
        const adjustValue = (value) => {
            const adjusted = value + (value * percent / 100);
            return Math.max(0, Math.min(255, Math.round(adjusted)));
        };
        
        const newR = adjustValue(R);
        const newG = adjustValue(G);
        const newB = adjustValue(B);
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    addColorHarmonyButton(colorInput, variable) {
        const harmonyBtn = document.createElement('button');
        harmonyBtn.innerHTML = '<i class="fas fa-magic"></i>';
        harmonyBtn.className = 'harmony-btn';
        harmonyBtn.title = 'Generate harmony colors';
        
        harmonyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.generateHarmonyColors(colorInput.value);
        });
        
        colorInput.parentNode.appendChild(harmonyBtn);
    }

    generateHarmonyColors(baseColor) {
        const harmonies = this.calculateColorHarmonies(baseColor);
        
        // Show harmony palette popup
        this.showHarmonyPalette(harmonies);
    }

    calculateColorHarmonies(baseColor) {
        const hsl = this.hexToHsl(baseColor);
        
        return {
            complementary: this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
            triadic1: this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
            triadic2: this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
            analogous1: this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
            analogous2: this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
        };
    }

    hexToHsl(hex) {
        const r = parseInt(hex.substring(1, 3), 16) / 255;
        const g = parseInt(hex.substring(3, 5), 16) / 255;
        const b = parseInt(hex.substring(5, 7), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    showHarmonyPalette(harmonies) {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'harmony-overlay';
        
        const popup = document.createElement('div');
        popup.className = 'harmony-popup';
        popup.innerHTML = `
            <div class="harmony-header">
                <h3>Color Harmonies</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="harmony-colors">
                ${Object.entries(harmonies).map(([name, color]) => `
                    <div class="harmony-color" data-color="${color}">
                        <div class="color-swatch" style="background: ${color}"></div>
                        <span class="color-name">${name}</span>
                        <span class="color-value">${color}</span>
                    </div>
                `).join('')}
            </div>
            <div class="harmony-actions">
                <button class="apply-harmony-btn">Apply Color Scheme</button>
            </div>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        // Event listeners
        popup.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        // Color selection
        popup.querySelectorAll('.harmony-color').forEach(colorEl => {
            colorEl.addEventListener('click', () => {
                const color = colorEl.dataset.color;
                // Apply to primary color as example
                document.getElementById('primaryColor').value = color;
                document.getElementById('primaryColorText').value = color;
                this.updateColor('primaryColor', '--primary-color', color, document.getElementById('primaryColorText'));
            });
        });
    }

    setupColorPalettes() {
        // Popular color palettes
        const palettes = [
            { name: 'Material', colors: ['#2196F3', '#4CAF50', '#FF9800', '#F44336'] },
            { name: 'Pastel', colors: ['#FFB3D9', '#B3E5FF', '#B3FFB3', '#FFFFB3'] },
            { name: 'Professional', colors: ['#2B5A9C', '#8FBC8F', '#D4A574', '#FAFAFA'] },
            { name: 'Sunset', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'] }
        ];
        
        // Add palette section if not exists
        if (!document.querySelector('.color-palettes')) {
            this.createPaletteSection(palettes);
        }
    }

    createPaletteSection(palettes) {
        const colorSection = document.querySelector('.control-section:has(#primaryColor)');
        if (colorSection) {
            const paletteHTML = `
                <div class="color-palettes">
                    <h4>Quick Palettes</h4>
                    ${palettes.map(palette => `
                        <div class="palette" data-palette='${JSON.stringify(palette.colors)}'>
                            <span class="palette-name">${palette.name}</span>
                            <div class="palette-colors">
                                ${palette.colors.map(color => `
                                    <div class="palette-color" style="background: ${color}"></div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            colorSection.insertAdjacentHTML('beforeend', paletteHTML);
            
            // Add event listeners
            colorSection.querySelectorAll('.palette').forEach(paletteEl => {
                paletteEl.addEventListener('click', () => {
                    const colors = JSON.parse(paletteEl.dataset.palette);
                    this.applyPalette(colors);
                });
            });
        }
    }

    applyPalette(colors) {
        const colorMappings = [
            { input: 'primaryColor', variable: '--primary-color' },
            { input: 'secondaryColor', variable: '--secondary-color' },
            { input: 'accentColor', variable: '--accent-color' },
            { input: 'backgroundColor', variable: '--background-color' }
        ];
        
        colors.forEach((color, index) => {
            if (colorMappings[index]) {
                const { input, variable } = colorMappings[index];
                const colorInput = document.getElementById(input);
                const textInput = document.getElementById(input + 'Text');
                
                if (colorInput && textInput) {
                    this.updateColor(input, variable, color, textInput);
                }
            }
        });
    }

    isValidColor(color) {
        const style = new Option().style;
        style.color = color;
        return style.color !== '';
    }

    getDefaultColor(id) {
        const defaults = {
            primaryColor: '#2B5A9C',
            secondaryColor: '#8FBC8F',
            accentColor: '#D4A574',
            backgroundColor: '#FAFAFA'
        };
        return defaults[id] || '#000000';
    }

    dispatchColorChange(colorId, value) {
        const event = new CustomEvent('colorChanged', {
            detail: { colorId, value }
        });
        document.dispatchEvent(event);
    }
}

// Export for use in main editor
window.ColorControl = ColorControl;
