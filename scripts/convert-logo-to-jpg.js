const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const publicDir = path.join(__dirname, '..', 'public');
const svgFiles = [
  'logo-be-a-number-primary-black.svg',
  'logo-be-a-number-primary-white.svg',
  'logo-be-a-number-micro-black.svg',
  'logo-be-a-number-micro-white.svg'
];

// Convert each SVG to JPG
svgFiles.forEach(svgFile => {
  const svgPath = path.join(publicDir, svgFile);
  
  if (!fs.existsSync(svgPath)) {
    console.log(`Skipping ${svgFile} - file not found`);
    return;
  }
  
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  
  // Render SVG to PNG first (Resvg outputs PNG)
  const resvg = new Resvg(svgContent, {
    background: svgFile.includes('white') ? '#000000' : '#FFFFFF',
    fitTo: {
      mode: 'width',
      value: 1000, // High resolution output
    },
  });
  
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  
  // Convert PNG to JPG using sharp
  const sharp = require('sharp');
  const jpgFileName = svgFile.replace('.svg', '.jpg');
  const jpgPath = path.join(publicDir, jpgFileName);
  
  sharp(pngBuffer)
    .jpeg({ quality: 95 })
    .toFile(jpgPath)
    .then(() => {
      console.log(`✓ Converted ${svgFile} → ${jpgFileName}`);
    })
    .catch(err => {
      console.error(`✗ Error converting ${svgFile}:`, err.message);
    });
});
