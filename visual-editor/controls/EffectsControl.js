// Effects Control Module
class EffectsControl {
    constructor(editor) {
        this.editor = editor;
    }

    init() {
        this.setupEffectsControls();
        this.setupAnimationControls();
    }

    setupEffectsControls() {
        // Card shadow control
        const cardShadowSlider = document.getElementById('cardShadow');
        const cardShadowValue = cardShadowSlider?.nextElementSibling;
        
        if (cardShadowSlider && cardShadowValue) {
            cardShadowSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                cardShadowValue.textContent = `${value}px`;
                this.updateCardShadow(value);
                this.editor.currentSettings.cardShadow = value;
            });
        }

        // Hover effects control
        const hoverEffectSlider = document.getElementById('hoverEffect');
        const hoverEffectValue = hoverEffectSlider?.nextElementSibling;
        
        if (hoverEffectSlider && hoverEffectValue) {
            hoverEffectSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                hoverEffectValue.textContent = `${value}px`;
                this.updateHoverEffects(value);
                this.editor.currentSettings.hoverEffect = value;
            });
        }
    }

    setupAnimationControls() {
        // Animations toggle
        const animationsCheckbox = document.getElementById('animationsEnabled');
        if (animationsCheckbox) {
            animationsCheckbox.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                this.toggleAnimations(enabled);
                this.editor.currentSettings.animationsEnabled = enabled;
            });
        }

        // Add advanced animation controls
        this.addAdvancedAnimationControls();
    }

    updateCardShadow(value) {
        if (this.editor.previewDocument) {
            const cards = this.editor.previewDocument.querySelectorAll('.advantage-card, .program-card');
            cards.forEach(card => {
                card.style.boxShadow = `0 5px ${value}px rgba(212, 165, 116, 0.1)`;
            });
            
            // Update hover shadows too
            this.updateHoverShadows(value);
        }
    }

    updateHoverShadows(shadowValue) {
        if (this.editor.previewDocument) {
            const style = this.getOrCreateStyle('dynamic-shadow-styles');
            const hoverShadow = Math.min(parseInt(shadowValue) + 10, 40);
            
            style.textContent = `
                .advantage-card:hover, .program-card:hover {
                    box-shadow: 0 10px ${hoverShadow}px rgba(212, 165, 116, 0.2) !important;
                }
            `;
        }
    }

    updateHoverEffects(value) {
        if (this.editor.previewDocument) {
            const style = this.getOrCreateStyle('dynamic-hover-styles');
            
            style.textContent = `
                .advantage-card:hover, .program-card:hover {
                    transform: translateY(-${value}px) !important;
                    transition: all 0.3s ease !important;
                }
                .hero-cta:hover, .program-cta:hover, .submit-btn:hover {
                    transform: translateY(-${Math.ceil(value/2)}px) !important;
                    transition: all 0.3s ease !important;
                }
            `;
        }
    }

    toggleAnimations(enabled) {
        if (this.editor.previewDocument) {
            const style = this.getOrCreateStyle('animation-toggle');
            
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
        }
    }

    addAdvancedAnimationControls() {
        const effectsSection = document.querySelector('.control-section:has(#cardShadow)');
        if (effectsSection && !effectsSection.querySelector('.advanced-effects')) {
            const advancedEffectsHTML = `
                <div class="advanced-effects">
                    <h4>Advanced Effects</h4>
                    <div class="control-group">
                        <label for="transitionSpeed">Transition Speed</label>
                        <div class="slider-group">
                            <input type="range" id="transitionSpeed" min="0.1" max="1" step="0.1" value="0.3">
                            <span class="slider-value">0.3s</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label for="borderWidth">Border Width</label>
                        <div class="slider-group">
                            <input type="range" id="borderWidth" min="0" max="5" step="1" value="0">
                            <span class="slider-value">0px</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label for="glowIntensity">Glow Effect</label>
                        <div class="slider-group">
                            <input type="range" id="glowIntensity" min="0" max="20" step="1" value="0">
                            <span class="slider-value">0px</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>
                            <input type="checkbox" id="pulseEffect">
                            Pulse Animation
                        </label>
                    </div>
                </div>
            `;
            
            effectsSection.insertAdjacentHTML('beforeend', advancedEffectsHTML);
            this.setupAdvancedEffectControls();
        }
    }

    setupAdvancedEffectControls() {
        // Transition speed
        const transitionSpeedSlider = document.getElementById('transitionSpeed');
        const transitionSpeedValue = transitionSpeedSlider?.nextElementSibling;
        
        if (transitionSpeedSlider && transitionSpeedValue) {
            transitionSpeedSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                transitionSpeedValue.textContent = `${value}s`;
                this.updateTransitionSpeed(value);
            });
        }

        // Border width
        const borderWidthSlider = document.getElementById('borderWidth');
        const borderWidthValue = borderWidthSlider?.nextElementSibling;
        
        if (borderWidthSlider && borderWidthValue) {
            borderWidthSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                borderWidthValue.textContent = `${value}px`;
                this.updateBorderWidth(value);
            });
        }

        // Glow effect
        const glowIntensitySlider = document.getElementById('glowIntensity');
        const glowIntensityValue = glowIntensitySlider?.nextElementSibling;
        
        if (glowIntensitySlider && glowIntensityValue) {
            glowIntensitySlider.addEventListener('input', (e) => {
                const value = e.target.value;
                glowIntensityValue.textContent = `${value}px`;
                this.updateGlowEffect(value);
            });
        }

        // Pulse effect
        const pulseEffectCheckbox = document.getElementById('pulseEffect');
        if (pulseEffectCheckbox) {
            pulseEffectCheckbox.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                this.togglePulseEffect(enabled);
            });
        }
    }

    updateTransitionSpeed(value) {
        if (this.editor.previewDocument) {
            const style = this.getOrCreateStyle('transition-speed');
            
            style.textContent = `
                .advantage-card, .program-card, .hero-cta, .program-cta, .submit-btn {
                    transition-duration: ${value}s !important;
                }
            `;
        }
    }

    updateBorderWidth(value) {
        if (this.editor.previewDocument) {
            const cards = this.editor.previewDocument.querySelectorAll('.advantage-card, .program-card, .registration-form');
            cards.forEach(card => {
                if (parseInt(value) > 0) {
                    card.style.border = `${value}px solid rgba(212, 165, 116, 0.3)`;
                } else {
                    card.style.border = 'none';
                }
            });
        }
    }

    updateGlowEffect(value) {
        if (this.editor.previewDocument) {
            const style = this.getOrCreateStyle('glow-effect');
            
            if (parseInt(value) > 0) {
                style.textContent = `
                    .advantage-card:hover, .program-card:hover {
                        box-shadow: 0 5px 20px rgba(212, 165, 116, 0.1), 
                                   0 0 ${value}px rgba(212, 165, 116, 0.4) !important;
                    }
                    .hero-cta:hover, .program-cta:hover, .submit-btn:hover {
                        box-shadow: 0 0 ${value}px rgba(143, 188, 143, 0.5) !important;
                    }
                `;
            } else {
                style.textContent = '';
            }
        }
    }

    togglePulseEffect(enabled) {
        if (this.editor.previewDocument) {
            const style = this.getOrCreateStyle('pulse-effect');
            
            if (enabled) {
                style.textContent = `
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                    .hero-cta, .program-cta, .submit-btn {
                        animation: pulse 2s infinite !important;
                    }
                `;
            } else {
                style.textContent = '';
            }
        }
    }

    getOrCreateStyle(id) {
        if (this.editor.previewDocument) {
            let style = this.editor.previewDocument.getElementById(id);
            if (!style) {
                style = this.editor.previewDocument.createElement('style');
                style.id = id;
                this.editor.previewDocument.head.appendChild(style);
            }
            return style;
        }
        return null;
    }

    // Preset effect configurations
    applyEffectPreset(preset) {
        const presets = {
            subtle: {
                cardShadow: 10,
                hoverEffect: 2,
                transitionSpeed: 0.2,
                borderWidth: 0,
                glowIntensity: 0,
                pulseEffect: false
            },
            moderate: {
                cardShadow: 20,
                hoverEffect: 5,
                transitionSpeed: 0.3,
                borderWidth: 1,
                glowIntensity: 5,
                pulseEffect: false
            },
            dramatic: {
                cardShadow: 30,
                hoverEffect: 8,
                transitionSpeed: 0.4,
                borderWidth: 2,
                glowIntensity: 15,
                pulseEffect: true
            }
        };

        const settings = presets[preset];
        if (settings) {
            Object.entries(settings).forEach(([key, value]) => {
                const control = document.getElementById(key);
                if (control) {
                    if (control.type === 'checkbox') {
                        control.checked = value;
                    } else {
                        control.value = value;
                    }
                    // Trigger the change event
                    control.dispatchEvent(new Event(control.type === 'checkbox' ? 'change' : 'input'));
                }
            });
        }
    }
}

window.EffectsControl = EffectsControl;
