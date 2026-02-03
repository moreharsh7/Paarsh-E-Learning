// vercel-build.js
const fs = require('fs');
const path = require('path');

// Create a simple vercel.json if it doesn't exist
const vercelConfig = {
  version: 2,
  builds: [
    {
      src: "package.json",
      use: "@vercel/static-build",
      config: { distDir: "build" }
    }
  ],
  routes: [
    {
      src: "/(.*)",
      dest: "/"
    }
  ]
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));

// Update package.json for vercel
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Add vercel build script
packageJson.scripts = {
  ...packageJson.scripts,
  "vercel-build": "react-scripts build"
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Vercel configuration created');