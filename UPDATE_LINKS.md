# Quick Reference - Update Project Links

When you deploy your projects and want to add the URLs, edit this file:
`client/src/components/ProjectsSection.jsx`

## Current Projects Setup

### 1. Shopverse (E-commerce)
```javascript
demoUrl: "#",  // Add your deployed URL here
githubUrl: "#",  // Add GitHub repo URL here
```

### 2. Weather Forecasting System
```javascript
demoUrl: "https://gokulweatherforecasting.netlify.app/",  // ✅ Already added
githubUrl: "#",  // Add GitHub repo URL when available
```

### 3. G&M Restaurant Booking
```javascript
demoUrl: "#",  // Add your deployed URL here
githubUrl: "#",  // Add GitHub repo URL here
```

### 4. Komato - Zomato Clone
```javascript
demoUrl: "#",  // Add your deployed URL here
githubUrl: "#",  // Add GitHub repo URL here
```

### 5. Recipe Descriptor
```javascript
demoUrl: "#",  // Add your deployed URL here
githubUrl: "#",  // Add GitHub repo URL here
```

### 6. Car Parking IoT System
```javascript
demoUrl: "#",  // Add your deployed URL here
githubUrl: "#",  // Add GitHub repo URL here
```

### 7. Parallax Car Website
```javascript
demoUrl: "#",  // Add your deployed URL here
githubUrl: "#",  // Add GitHub repo URL here
```

## How to Update

1. Open `client/src/components/ProjectsSection.jsx`
2. Find the `projects` array at the top of the file
3. Replace `"#"` with your actual URLs
4. Save the file
5. The changes will appear immediately in development mode

## Example Update

**Before:**
```javascript
{
  id: 1,
  title: "Shopverse",
  demoUrl: "#",
  githubUrl: "#",
  ...
}
```

**After:**
```javascript
{
  id: 1,
  title: "Shopverse",
  demoUrl: "https://shopverse.vercel.app",
  githubUrl: "https://github.com/Gokul1111-cmd/shopverse",
  ...
}
```

## Notes
- If a project isn't deployed yet, leave it as `"#"` - it will show "Coming Soon"
- GitHub URLs are optional but recommended
- Make sure URLs start with `https://`
