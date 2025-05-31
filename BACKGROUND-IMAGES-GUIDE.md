# Background Images Guide for Netlify CMS

## Overview

Your Netlify CMS now supports background images for all major sections of your website:
- Hero Section
- Advantages Section  
- Program Section
- Registration Section

## How to Use Background Images

### Step 1: Upload Images to Media Library

1. Access your Netlify CMS admin panel at `/admin/`
2. Navigate to the **Media** tab in the top menu
3. Click **Upload** or drag and drop your image files
4. Supported formats: JPG, PNG, WebP, SVG
5. Recommended image sizes:
   - **Hero Section**: 1920x1080px or larger
   - **Other Sections**: 1200x800px or larger
6. Copy the image path (e.g., `/assets/images/your-image.jpg`)

### Step 2: Set Background Images in CMS

#### For Hero Section:
1. Go to **Site Settings** → **Hero Section**
2. Scroll down to **Background Settings**
3. In **Background Image**, paste your image path or click to browse
4. Adjust **Background Color** (used as fallback)
5. Set **Overlay Opacity** for text readability:
   - **No Overlay**: Text appears directly on image
   - **Light (10%)**: Subtle darkening
   - **Medium (30%)**: Moderate darkening
   - **Heavy (50%)**: Strong darkening
   - **Very Heavy (70%)**: Maximum darkening

#### For Other Sections:
Follow the same process for:
- **Advantages Section** → Background Settings
- **Program Section** → Background Settings  
- **Registration Section** → Background Settings

### Step 3: Preview and Adjust

1. Save your changes in the CMS
2. Visit your live website to see the changes
3. Adjust overlay opacity if text is hard to read
4. Try different images if needed

## Background Options Explained

### Background Image
- **Empty**: Uses default background (solid color)
- **Image Path**: Displays your uploaded image as background
- **Format**: `/assets/images/filename.jpg`

### Background Color
- Acts as fallback when no image is set
- Shows behind transparent parts of images
- Used as overlay color when overlay is applied

### Overlay Opacity
Controls how much the background image is darkened:
- **0**: No overlay (image at full brightness)
- **0.1**: 10% dark overlay (very light)
- **0.3**: 30% dark overlay (moderate)
- **0.5**: 50% dark overlay (strong)
- **0.7**: 70% dark overlay (very strong)

## Best Practices

### Image Selection
- **Hero Section**: Use inspiring, high-quality images related to education
- **Advantages Section**: Choose images that complement your content cards
- **Program Section**: Select images related to learning/studying
- **Registration Section**: Use welcoming, professional images

### Image Optimization
- Compress images to 100-300KB for web performance
- Use WebP format for better compression
- Ensure images look good at different screen sizes

### Text Readability
- Always test text readability with your chosen images
- Use overlay opacity to ensure text is clearly visible
- Consider the contrast between text color and image
- Test on both desktop and mobile devices

### Color Coordination
- Choose background colors that complement your image
- Ensure background colors work well when images fail to load
- Maintain consistency with your brand colors

## Troubleshooting

### Image Not Showing
1. Check the image path is correct
2. Ensure image was uploaded to Media Library
3. Verify image file isn't corrupted
4. Clear browser cache and refresh

### Text Hard to Read
1. Increase overlay opacity
2. Choose a darker background color
3. Select a different image with better contrast
4. Consider adding text shadows in custom CSS

### CMS Changes Not Visible
1. Save changes in CMS and wait a few minutes
2. Clear browser cache
3. Check if website is deployed to live server
4. Verify image paths are correct

## Technical Details

### CSS Variables
The system uses CSS variables that are dynamically updated:
- `--hero-bg-image`
- `--hero-bg-color` 
- `--hero-overlay-opacity`
- (Similar variables for other sections)

### File Structure
- Images stored in: `/assets/images/`
- Background settings in: `/_data/[section].yml`
- CSS styles in: `/assets/css/style.css`

### Responsive Behavior
- Images automatically scale on mobile devices
- Overlay opacity remains consistent across screen sizes
- Background positioning optimized for all devices

## Examples

### Example 1: Hero with Classroom Image
```yaml
background:
  image: "/assets/images/classroom-hero.jpg"
  color: "#F5E6D3"
  overlay_opacity: "0.5"
```

### Example 2: Advantages with Light Background
```yaml
background:
  image: "/assets/images/students-studying.jpg"
  color: "#FAFAFA"
  overlay_opacity: "0.1"
```

### Example 3: No Image (Color Only)
```yaml
background:
  image: ""
  color: "#E8E6E3"
  overlay_opacity: "0"
```

## Support

If you encounter any issues:
1. Check this guide first
2. Verify all steps were followed correctly
3. Test with different images
4. Clear browser cache
5. Contact technical support if problems persist

Remember: Changes made in the CMS will be reflected on your live website within a few minutes of saving.
