# Elevate Learning Center Website

A modern, fully editable website for Elevate Learning Center with Netlify CMS integration.

## 🚀 Features

- **Fully Editable Content**: Everything can be edited through Netlify CMS
- **Responsive Design**: Works perfectly on all devices
- **Smooth Scrolling Navigation**: Enhanced user experience
- **Google Maps Integration**: Interactive location display
- **Form Handling**: Contact form with Netlify Forms
- **Color Theme Management**: Easy color scheme customization
- **SEO Optimized**: Meta tags and structured content

## 📁 Project Structure

```
elevate-website/
├── index.html              # Main website file
├── admin/                  # Netlify CMS admin interface
│   ├── index.html         # CMS admin page
│   └── config.yml         # CMS configuration
├── _data/                 # Content data files (editable via CMS)
│   ├── site.yml          # Site settings & colors
│   ├── hero.yml          # Hero section content
│   ├── advantages.yml    # Advantage cards
│   ├── program.yml       # Program details & pricing
│   ├── registration.yml  # Registration form
│   └── footer.yml        # Footer content & location
├── assets/               # Static assets
│   ├── css/style.css    # Website styling
│   └── js/main.js       # JavaScript functionality
├── netlify.toml         # Netlify deployment config
└── README.md           # This file
```

## 🌐 Deployment Instructions

### Step 1: Deploy to Netlify

1. **Zip the website folder**:
   - Select all files inside the `elevate-website` folder
   - Create a ZIP file (e.g., `elevate-website.zip`)

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up or log in
   - Drag and drop your ZIP file to the deploy area
   - Wait for deployment to complete

### Step 2: Enable Netlify Identity

1. **In your Netlify dashboard**:
   - Go to **Site settings** → **Identity**
   - Click **Enable Identity**

2. **Configure Identity settings**:
   - **Registration**: Set to "Invite only" (recommended)
   - **External providers**: Enable if you want Google/GitHub login
   - **Git Gateway**: Enable this for CMS functionality

### Step 3: Set up CMS Access

1. **Invite yourself as an admin**:
   - Go to **Identity** tab in Netlify dashboard
   - Click **Invite users**
   - Enter your email address
   - Check your email and accept the invitation

2. **Access the CMS**:
   - Go to `your-site-name.netlify.app/admin/`
   - Log in with your credentials
   - Start editing your content!

## ✏️ Editing Content

### Available Sections in CMS:

1. **General Site Settings**
   - Site title and logo
   - Meta description and keywords
   - Color scheme (change website colors)

2. **Hero Section**
   - Main headline and subtitle
   - Call-to-action button

3. **Advantages Section**
   - Section title
   - Add/remove/edit advantage cards
   - Icons, titles, and descriptions

4. **Program Section**
   - Program details and description
   - Features list (add/remove items)
   - Pricing information
   - Call-to-action button

5. **Registration Section**
   - Form title and subtitle
   - Form fields (modify labels, types, options)
   - Submit button text and disclaimer

6. **Footer**
   - Contact information
   - Partnership details
   - Location text and map coordinates

### Making Changes:

1. Log into `/admin/` on your website
2. Select the section you want to edit
3. Make your changes
4. Click **Save** 
5. Click **Publish** to make changes live
6. Changes appear on your website immediately!

## 🎨 Customizing Colors

You can change the entire website color scheme through the CMS:

1. Go to **Site Settings** → **General Site Settings**
2. Expand **Color Scheme**
3. Use color pickers to adjust:
   - Primary Color (header, titles)
   - Secondary Color (buttons, accents)
   - Accent Color (highlights)
   - Background colors
   - Text colors

## 📍 Updating Location

To change the map location:

1. Go to **Footer** settings in CMS
2. Scroll to **Location Settings**
3. Update **Latitude** and **Longitude**
4. Adjust **Zoom Level** (1-20)

## 📝 Form Submissions

Contact form submissions are automatically handled by Netlify:

1. Go to your Netlify dashboard
2. Click **Forms** tab
3. View all form submissions
4. Set up email notifications if desired

## 🔧 Technical Details

- **Framework**: Pure HTML/CSS/JavaScript
- **CMS**: Netlify CMS
- **Hosting**: Netlify
- **Forms**: Netlify Forms
- **Authentication**: Netlify Identity

## 📞 Support

For any technical issues or questions about editing content, the CMS interface provides helpful tooltips and guidance for each field.

## 🔄 Updates

All content updates are made through the CMS interface - no coding required! The website automatically rebuilds when you publish changes.
