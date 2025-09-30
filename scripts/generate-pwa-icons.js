const fs = require("fs");
const path = require("path");

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, "../public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG icon
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${
    size * 0.4
  }" font-weight="bold" text-anchor="middle" dy="0.35em" fill="white">N</text>
</svg>`;

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate SVG files
sizes.forEach((size) => {
  const svg = createIconSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svg);
  console.log(`Generated ${filename}`);
});

// Create a simple PNG fallback (this would normally be done with a proper image library)
// For now, we'll create a simple HTML file that can be converted to PNG
const createIconHTML = (size) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    .icon {
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: ${size * 0.2}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      font-size: ${size * 0.4}px;
      font-weight: bold;
      color: white;
    }
  </style>
</head>
<body>
  <div class="icon">N</div>
</body>
</html>`;

// Generate HTML files for manual conversion to PNG
sizes.forEach((size) => {
  const html = createIconHTML(size);
  const filename = `icon-${size}x${size}.html`;
  fs.writeFileSync(path.join(iconsDir, filename), html);
  console.log(`Generated ${filename} (convert to PNG manually)`);
});

console.log("\nPWA icons generated!");
console.log(
  "Note: You may need to convert the HTML files to PNG format for production use."
);
console.log(
  "You can use online tools or image libraries to convert SVG/HTML to PNG."
);
