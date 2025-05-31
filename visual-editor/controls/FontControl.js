// Font Control Module
class FontControl {
    constructor(editor) {
        this.editor = editor;
        this.googleFonts = [
            'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 
            'Nunito', 'Source Sans Pro', 'Playfair Display', 'Merriweather'
        ];
    }

    init() {
        this.setupFontFamilyControl();
        this.setupFontSizeControls();
        this.preloadGoogleFonts();
    }

    setupFontFamilyControl() {
        const fontFamilySelect = document.getElementById('fontFamily');
        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', (e) => {
                const value = e.target.value;
                this.applyFontFamily(value);
                this.editor.currentSettings.fontFamily = value;
            });
        }
    }

    setupFontSizeControls() {
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
                    this.applyFontSize(selector, value, unit);
                    this.editor.currentSettings[id] = value;
                });
            }
        });
    }

    applyFontFamily(fontFamily) {
        if (this.editor.previewDocument) {
            this.editor.previewDocument.body.style.fontFamily = fontFamily;
            
            // Load Google Font if needed
            this.loadGoogleFont(fontFamily);
        }
    }

    applyFontSize(selector, value, unit) {
        if (this.editor.previewDocument) {
            const elements = this.editor.previewDocument.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.fontSize = `${value}${unit}`;
            });
        }
    }

    loadGoogleFont(fontFamily) {
        const fontName = fontFamily.replace(/['",]/g, '').split(',')[0].trim();
        
        if (this.googleFonts.includes(fontName)) {
            const linkId = `font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
            
            // Check if already loaded
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
                document.head.appendChild(link);
                
                // Also add to preview document
                if (this.editor.previewDocument) {
                    const previewLink = link.cloneNode();
                    previewLink.id = linkId + '-preview';
                    this.editor.previewDocument.head.appendChild(previewLink);
                }
            }
        }
    }

    preloadGoogleFonts() {
        // Preload popular fonts for better performance
        const popularFonts = ['Inter', 'Roboto', 'Open Sans', 'Poppins'];
        popularFonts.forEach(font => {
            this.loadGoogleFont(`'${font}', sans-serif`);
        });
    }
}

window.FontControl = FontControl;
