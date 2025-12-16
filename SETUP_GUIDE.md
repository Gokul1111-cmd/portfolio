# Portfolio Setup Guide

## ✅ What Has Been Updated

All your personal information has been successfully integrated into the portfolio:

### Personal Information
- **Name**: Gokul Anbalagan
- **Title**: Full Stack Developer
- **Location**: Coimbatore, Tamil Nadu, India
- **Email**: gokulanbalagan1112@gmail.com
- **Phone**: +91 8754740118, +91 8056540118
- **LinkedIn**: https://www.linkedin.com/in/gokulanbalagan1112/
- **GitHub**: https://github.com/Gokul1111-cmd

### Technical Skills Updated
- Languages: Java (70%), SQL (60%), HTML (90%), CSS (80%), JavaScript (70%)
- Frontend: React, HTML, CSS, JavaScript, Tailwind CSS
- Backend: Spring Boot, Flask, Java, SQL, API
- Tools: Git, Docker, Firebase, MongoDB, MySQL

### Projects Added
1. **Shopverse** - E-commerce platform
2. **Weather Forecasting System** - Real-time weather app (Live: https://gokulweatherforecasting.netlify.app/)
3. **G&M Restaurant Booking** - Restaurant management system
4. **Komato** - Zomato clone
5. **Recipe Descriptor** - Recipe discovery platform
6. **Car Parking IoT System** - Smart parking management
7. **Parallax Car Website** - Parallax scrolling website

## 📋 Next Steps - IMPORTANT!

### 1. Add Your Resume PDF
1. Rename your resume PDF to: `gokul-resume.pdf`
2. Place it in the `client/public/` folder
3. The download button will work automatically

### 2. Add Your Profile Photo
1. Add your profile picture to: `client/public/profile-logo.png`
2. Recommended size: 500x500 pixels (square)
3. Format: PNG or JPG

### 3. Add Project Images
Create placeholder images or add your actual project screenshots:
- Place images in: `client/public/projects/`
- Required images:
  - `project1.png` (Shopverse)
  - `project2.png` (Weather Forecasting)
  - `project3.png` (G&M Restaurant)
  - `project4.png` (Komato)
  - `project5.png` (Recipe Descriptor)
  - `project6.png` (Car Parking IoT)
  - `project7.png` (Parallax Car)

### 4. Add Project Videos (Optional)
If you have demo videos:
- Place them in: `client/public/projects/videos/`
- Required videos:
  - `shopverse-demo.mp4`
  - `weather-demo.mp4`
  - `gm-demo.mp4`
  - `komato-demo.mp4`
  - `recipe-demo.mp4`
  - `parking-demo.mp4`
  - `car-demo.mp4`

### 5. Update Project URLs
Once your projects are deployed, update the demo URLs in:
`client/src/components/ProjectsSection.jsx`

Replace `"#"` with your actual deployment URLs:
```javascript
demoUrl: "your-project-url-here",
githubUrl: "your-github-repo-url",
```

## 🚀 Running the Portfolio

### Install Dependencies
```bash
cd client
npm install
```

### Run Development Server
```bash
npm run dev
```

Your portfolio will be available at: http://localhost:5173

### Build for Production
```bash
npm run build
```

## 📤 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set the root directory to `client`
5. Click **Deploy**

### Deploy to Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Set build directory to `client/dist`
5. Build command: `npm run build`
6. Click **Deploy**

## 🎨 Customization

### Change Colors
Edit `client/tailwind.config.ts` to change the color scheme.

### Update Contact Form
The contact form currently uses Formspree. Update the form endpoint in:
`client/src/components/ContactSection.jsx` (line 73)

Replace with your Formspree form ID:
```javascript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

## 📝 Important Notes

1. **Resume**: Make sure your resume PDF is named exactly `gokul-resume.pdf`
2. **Profile Photo**: Should be square and clear (500x500px recommended)
3. **Project Images**: Use consistent aspect ratios (16:9 recommended)
4. **Links**: Update all placeholder links (#) with actual URLs
5. **Demo URLs**: Add your deployed project URLs when available

## 🔧 Troubleshooting

### Images Not Showing
- Ensure images are in the `public` folder
- Check file names match exactly (case-sensitive)
- Restart development server after adding new images

### Resume Download Not Working
- Verify PDF is in `public` folder
- Check PDF file name is exactly `gokul-resume.pdf`
- Clear browser cache

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify all file paths are correct
3. Ensure all dependencies are installed
4. Restart the development server

---

**Your portfolio is ready! Just add your resume, profile photo, and project images to complete the setup.**
