// Spacing Control Module
class SpacingControl {
    constructor(editor) {
        this.editor = editor;
    }

    init() {
        this.setupLayoutControls();
        this.setupSpacingControls();
    }

    setupLayoutControls() {
        const layoutControls = [
            { 
                id: 'containerWidth', 
                callback: (value) => this.updateContainerWidth(value),
                unit: 'px'
            },
            { 
                id: 'sectionPadding', 
                callback: (value) => this.updateSectionPadding(value),
                unit: 'px'
            },
            { 
                id: 'cardBorderRadius', 
                callback: (value) => this.updateCardBorderRadius(value),
                unit: 'px'
            },
            { 
                id: 'buttonBorderRadius', 
                callback: (value) => this.updateButtonBorderRadius(value),
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
                    this.editor.currentSettings[id] = value;
                });
            }
        });
    }

    setupSpacingControls() {
        // Add advanced spacing controls if needed
        this.addAdvancedSpacingSection();
    }

    updateContainerWidth(value) {
        if (this.editor.previewDocument) {
            const containers = this.editor.previewDocument.querySelectorAll('.container');
            containers.forEach(container => {
                container.style.maxWidth = `${value}px`;
            });
        }
    }

    updateSectionPadding(value) {
        if (this.editor.previewDocument) {
            const sections = this.editor.previewDocument.querySelectorAll('.hero, .advantage, .programs, .registration');
            sections.forEach(section => {
                section.style.padding = `${value}px 0`;
            });
        }
    }

    updateCardBorderRadius(value) {
        if (this.editor.previewDocument) {
            const cards = this.editor.previewDocument.querySelectorAll('.advantage-card, .program-card, .registration-form');
            cards.forEach(card => {
                card.style.borderRadius = `${value}px`;
            });
        }
    }

    updateButtonBorderRadius(value) {
        if (this.editor.previewDocument) {
            const buttons = this.editor.previewDocument.querySelectorAll('.hero-cta, .program-cta, .submit-btn');
            buttons.forEach(button => {
                button.style.borderRadius = `${value}px`;
            });
        }
    }

    addAdvancedSpacingSection() {
        // Add more granular spacing controls
        const spacingSection = document.querySelector('.control-section:has(#containerWidth)');
        if (spacingSection && !spacingSection.querySelector('.advanced-spacing')) {
            const advancedSpacingHTML = `
                <div class="advanced-spacing">
                    <h4>Advanced Spacing</h4>
                    <div class="control-group">
                        <label for="elementGap">Element Gap</label>
                        <div class="slider-group">
                            <input type="range" id="elementGap" min="10" max="50" step="5" value="20">
                            <span class="slider-value">20px</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label for="gridGap">Grid Gap</label>
                        <div class="slider-group">
                            <input type="range" id="gridGap" min="1" max="4" step="0.5" value="2">
                            <span class="slider-value">2rem</span>
                        </div>
                    </div>
                </div>
            `;
            
            spacingSection.insertAdjacentHTML('beforeend', advancedSpacingHTML);
            
            // Add event listeners for advanced controls
            this.setupAdvancedSpacingControls();
        }
    }

    setupAdvancedSpacingControls() {
        // Element gap control
        const elementGapSlider = document.getElementById('elementGap');
        const elementGapValue = elementGapSlider?.nextElementSibling;
        
        if (elementGapSlider && elementGapValue) {
            elementGapSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                elementGapValue.textContent = `${value}px`;
                this.updateElementGap(value);
            });
        }

        // Grid gap control
        const gridGapSlider = document.getElementById('gridGap');
        const gridGapValue = gridGapSlider?.nextElementSibling;
        
        if (gridGapSlider && gridGapValue) {
            gridGapSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                gridGapValue.textContent = `${value}rem`;
                this.updateGridGap(value);
            });
        }
    }

    updateElementGap(value) {
        if (this.editor.previewDocument) {
            // Update margins between elements
            const elements = this.editor.previewDocument.querySelectorAll('.advantage-card, .program-card');
            elements.forEach(element => {
                element.style.marginBottom = `${value}px`;
            });
        }
    }

    updateGridGap(value) {
        if (this.editor.previewDocument) {
            // Update grid gaps
            const grids = this.editor.previewDocument.querySelectorAll('.advantage-grid, .programs-grid');
            grids.forEach(grid => {
                grid.style.gap = `${value}rem`;
            });
        }
    }

    // Preset spacing configurations
    applySpacingPreset(preset) {
        const presets = {
            compact: {
                containerWidth: 1000,
                sectionPadding: 60,
                cardBorderRadius: 8,
                buttonBorderRadius: 20,
                elementGap: 15,
                gridGap: 1.5
            },
            comfortable: {
                containerWidth: 1200,
                sectionPadding: 80,
                cardBorderRadius: 15,
                buttonBorderRadius: 30,
                elementGap: 20,
                gridGap: 2
            },
            spacious: {
                containerWidth: 1400,
                sectionPadding: 100,
                cardBorderRadius: 20,
                buttonBorderRadius: 40,
                elementGap: 30,
                gridGap: 3
            }
        };

        const settings = presets[preset];
        if (settings) {
            Object.entries(settings).forEach(([key, value]) => {
                const slider = document.getElementById(key);
                const valueDisplay = slider?.nextElementSibling;
                
                if (slider && valueDisplay) {
                    slider.value = value;
                    const unit = key.includes('Gap') && key !== 'elementGap' ? 'rem' : 'px';
                    valueDisplay.textContent = `${value}${unit}`;
                    
                    // Trigger the change
                    slider.dispatchEvent(new Event('input'));
                }
            });
        }
    }
}

window.SpacingControl = SpacingControl;
